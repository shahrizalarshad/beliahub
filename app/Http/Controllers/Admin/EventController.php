<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Event;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EventController extends Controller
{
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
        $data = $this->validated($request);
        Event::create([
            ...$data,
            'status' => EventStatus::from($data['status']),
            'created_by' => $request->user()->id,
        ]);

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
                'status' => $event->status->value,
            ],
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $data = $this->validated($request);
        $event->update([
            ...$data,
            'status' => EventStatus::from($data['status']),
        ]);

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

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:draft,published,done'],
        ]);
    }
}
