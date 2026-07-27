<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\EventStatus;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\URL;
use InvalidArgumentException;

class AttendanceService
{
    public function generateToken(Event $event): array
    {
        $ttl = (int) config('beliahub.attendance_qr_ttl_minutes', 5);
        $expiresAt = now()->addMinutes($ttl);

        $url = URL::temporarySignedRoute(
            'attendance.scan',
            $expiresAt,
            ['event' => $event->id],
        );

        return [
            'url' => $url,
            'expires_at' => $expiresAt->toIso8601String(),
        ];
    }

    public function record(Event $event, User $user): Attendance
    {
        if (! $user->role->canAccessEvents()) {
            throw new InvalidArgumentException(__('events.members_only'));
        }

        if ($event->status !== EventStatus::Published) {
            throw new InvalidArgumentException(__('events.not_published'));
        }

        if (! $event->isWithinWindow()) {
            throw new InvalidArgumentException(__('events.outside_window'));
        }

        if (Attendance::query()->where('event_id', $event->id)->where('user_id', $user->id)->exists()) {
            throw new InvalidArgumentException(__('events.already_attended'));
        }

        return Attendance::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'scanned_at' => now(),
        ]);
    }
}
