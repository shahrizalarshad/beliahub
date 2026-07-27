<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class MemberCardController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->membership_id) {
            return redirect()
                ->route('dashboard')
                ->with('error', __('membership.card_members_only'));
        }

        $verifyUrl = route('members.verify', $user->membership_id);

        $qrSvg = (string) QrCode::format('svg')
            ->size(160)
            ->margin(0)
            ->generate($verifyUrl);

        return Inertia::render('Members/Card', [
            'member' => [
                'name' => $user->name,
                'membership_id' => $user->membership_id,
                'role_label' => $user->role->label(),
                'locality' => $user->locality,
                'member_since' => $user->created_at->format('Y'),
                'is_active' => $user->is_active,
                'avatar_url' => $user->avatarUrl(),
            ],
            'qrSvg' => $qrSvg,
            'verifyUrl' => $verifyUrl,
        ]);
    }

    public function verify(string $membershipId): Response
    {
        $member = User::query()
            ->where('membership_id', $membershipId)
            ->first();

        return Inertia::render('Members/Verify', [
            'member' => $member ? [
                'name' => $member->name,
                'membership_id' => $member->membership_id,
                'role_label' => $member->role->label(),
                'locality' => $member->locality,
                'member_since' => $member->created_at->format('Y'),
                'is_active' => $member->is_active,
                'avatar_url' => $member->avatarUrl(),
            ] : null,
        ]);
    }
}
