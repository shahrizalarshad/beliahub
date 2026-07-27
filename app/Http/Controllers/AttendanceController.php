<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(private readonly AttendanceService $attendance) {}

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
