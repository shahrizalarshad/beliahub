<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\SequenceType;
use App\Enums\UserRole;
use App\Mail\MembershipAppliedMail;
use App\Mail\MembershipApprovedMail;
use App\Mail\MembershipRejectedMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

class MembershipService
{
    public function __construct(
        private readonly SequenceService $sequences,
    ) {}

    public function apply(User $user): User
    {
        if (! $user->isClient()) {
            throw new InvalidArgumentException(__('membership.already_member'));
        }

        $user->update(['membership_applied_at' => now()]);

        $this->notifySuperadmins($user);

        return $user->fresh();
    }

    public function approve(User $user): User
    {
        if (! $user->hasPendingMembershipApplication()) {
            throw new InvalidArgumentException(__('membership.no_pending'));
        }

        $user = DB::transaction(function () use ($user): User {
            $user->update([
                'role' => UserRole::Member,
                'membership_id' => $this->sequences->next(SequenceType::Membership),
                'membership_applied_at' => null,
            ]);

            return $user->fresh();
        });

        $this->sendSafely(fn () => Mail::to($user->email)->send(new MembershipApprovedMail($user)));

        return $user;
    }

    public function reject(User $user, ?string $reason = null): User
    {
        $user->update(['membership_applied_at' => null]);

        $this->sendSafely(fn () => Mail::to($user->email)->send(new MembershipRejectedMail($user, $reason)));

        return $user->fresh();
    }

    private function notifySuperadmins(User $applicant): void
    {
        $emails = User::query()
            ->where('role', UserRole::Superadmin)
            ->where('is_active', true)
            ->pluck('email');

        foreach ($emails as $email) {
            $this->sendSafely(fn () => Mail::to($email)->send(new MembershipAppliedMail($applicant)));
        }
    }

    private function sendSafely(callable $send): void
    {
        try {
            $send();
        } catch (\Throwable $e) {
            Log::warning('Mail delivery failed: '.$e->getMessage());
        }
    }
}
