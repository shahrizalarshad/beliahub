<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Event;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(private readonly AttendanceService $attendance) {}

    public function index(Request $request): Response
    {
        $attendances = Attendance::query()
            ->with('event')
            ->where('user_id', $request->user()->id)
            ->latest('scanned_at')
            ->get()
            ->map(fn (Attendance $attendance) => [
                'id' => $attendance->id,
                'event_title' => $attendance->event->title,
                'event_location' => $attendance->event->location,
                'scanned_at' => $attendance->scanned_at->format('d/m/Y, h:i A'),
            ]);

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
        ]);
    }

    public function scan(Request $request, Event $event): RedirectResponse
    {
        if (! $request->user()) {
            return redirect()->guest(route('login'));
        }

        try {
            $this->attendance->record($event, $request->user());
        } catch (\InvalidArgumentException $e) {
            return redirect()->route('dashboard')->with('error', $e->getMessage());
        }

        return redirect()->route('dashboard')->with('success', __('events.attendance_recorded'));
    }
}
