<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Event;
use App\Services\AttendanceService;
use App\Services\UploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class EventController extends Controller
{
    public function __construct(private readonly UploadService $uploads) {}

    public function index(): Response
    {
        $events = Event::query()->withCount('attendances')->latest('starts_at')->paginate(15);

        return Inertia::render('Admin/Events/Index', [
            'events' => $events->through(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'location' => $event->location,
                'starts_at' => $event->starts_at->format('d/m/Y H:i'),
                'ends_at' => $event->ends_at->format('d/m/Y H:i'),
                'status' => $event->status->label(),
                'attendances_count' => $event->attendances_count,
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Events/Form', ['event' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->eventAttributes($request);

        $event = Event::create([
            ...$data,
            'status' => EventStatus::from($data['status']),
            'created_by' => $request->user()->id,
        ]);

        if ($request->hasFile('poster')) {
            $this->syncPoster($event, $request->file('poster'));
        }

        return redirect()->route('admin.events.index')->with('success', __('events.created'));
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Admin/Events/Form', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'location' => $event->location,
                'starts_at' => $event->starts_at->format('Y-m-d\TH:i'),
                'ends_at' => $event->ends_at->format('Y-m-d\TH:i'),
                'budget' => $event->budget,
                'actual_spend' => $event->actual_spend,
                'status' => $event->status->value,
                'poster_url' => $event->poster_path
                    ? $this->uploads->temporaryUrl($event->poster_path)
                    : null,
            ],
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $data = $this->eventAttributes($request);

        $event->update([
            ...$data,
            'status' => EventStatus::from($data['status']),
        ]);

        if ($request->boolean('remove_poster')) {
            $this->removePoster($event);
        } elseif ($request->hasFile('poster')) {
            $this->syncPoster($event, $request->file('poster'), replace: true);
        }

        return redirect()->route('admin.events.index')->with('success', __('events.updated'));
    }

    public function attendances(Event $event): Response
    {
        $attendances = $event->attendances()
            ->with('user')
            ->latest('scanned_at')
            ->get()
            ->map(fn (Attendance $attendance) => [
                'id' => $attendance->id,
                'name' => $attendance->user->name,
                'membership_id' => $attendance->user->membership_id,
                'locality' => $attendance->user->locality,
                'scanned_at' => $attendance->scanned_at->format('d/m/Y H:i:s'),
            ]);

        return Inertia::render('Admin/Events/Attendances', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'starts_at' => $event->starts_at->format('d/m/Y H:i'),
                'status' => $event->status->value,
            ],
            'attendances' => $attendances,
        ]);
    }

    public function exportAttendances(Event $event): StreamedResponse
    {
        $filename = 'kehadiran-'.Str::slug($event->title).'.csv';

        return response()->streamDownload(function () use ($event) {
            $handle = fopen('php://output', 'w');
            // BOM supaya Excel membaca aksara UTF-8 dengan betul.
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['Nama', 'ID Ahli', 'Lokaliti', 'Masa Imbas']);

            $event->attendances()->with('user')->orderBy('scanned_at')->lazy()
                ->each(function (Attendance $attendance) use ($handle) {
                    fputcsv($handle, [
                        $attendance->user->name,
                        $attendance->user->membership_id ?? '-',
                        $attendance->user->locality ?? '-',
                        $attendance->scanned_at->format('d/m/Y H:i:s'),
                    ]);
                });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function qrDisplay(Event $event): Response
    {
        $token = app(AttendanceService::class)->generateToken($event);

        $svg = (string) QrCode::format('svg')
            ->size(300)
            ->margin(1)
            ->generate($token['url']);

        return Inertia::render('Admin/Events/QrDisplay', [
            'event' => $event->only(['id', 'title']),
            'qrSvg' => $svg,
            'expiresAt' => $token['expires_at'],
        ]);
    }

    private function eventAttributes(Request $request): array
    {
        $data = $this->validated($request);
        unset($data['poster'], $data['remove_poster']);

        return $data;
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'actual_spend' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:draft,published,done'],
            'poster' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_poster' => ['sometimes', 'boolean'],
        ], [
            'poster.image' => __('events.poster_invalid'),
            'poster.mimes' => __('events.poster_invalid'),
            'poster.max' => __('events.poster_too_large'),
        ]);
    }

    private function syncPoster(Event $event, UploadedFile $file, bool $replace = false): void
    {
        try {
            if ($replace) {
                $this->removePoster($event, persist: false);
            }

            $event->update([
                'poster_path' => $this->uploads->storeEventPoster($event, $file),
            ]);
        } catch (Throwable $e) {
            Log::error('Event poster upload failed', [
                'event_id' => $event->id,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function removePoster(Event $event, bool $persist = true): void
    {
        $this->uploads->deleteIfExists($event->poster_path);

        if ($persist) {
            $event->update(['poster_path' => null]);
        }
    }
}
