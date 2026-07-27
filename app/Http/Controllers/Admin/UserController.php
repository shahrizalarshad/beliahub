<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\User;
use App\Services\MembershipService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('skills')
            ->when($request->query('role'), fn ($q, $role) => $q->where('role', $role))
            ->when($request->query('locality'), fn ($q, $locality) => $q->where('locality', $locality))
            ->when($request->query('skill'), fn ($q, $skill) => $q->whereHas(
                'skills',
                fn ($q) => $q->where('skills.id', $skill),
            ))
            ->when($request->query('status'), function ($q, $status) {
                match ($status) {
                    'active' => $q->where('is_active', true),
                    'inactive' => $q->where('is_active', false),
                    'pending' => $q->whereNotNull('membership_applied_at')->where('role', 'client'),
                    'unverified' => $q->whereNull('email_verified_at'),
                    default => null,
                };
            })
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('membership_id', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'membership_id' => $user->membership_id,
                'locality' => $user->locality,
                'skills' => $user->skills->pluck('name'),
                'is_active' => $user->is_active,
                'membership_applied_at' => $user->membership_applied_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users->items(),
            'pagination' => [
                'links' => $users->linkCollection(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
            'filters' => $request->only(['role', 'search', 'locality', 'skill', 'status']),
            'roles' => collect(UserRole::cases())->map(fn ($r) => ['value' => $r->value, 'label' => $r->label()]),
            'localities' => config('beliahub.localities'),
            'skills' => Skill::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function approveMembership(User $user, MembershipService $membership): RedirectResponse
    {
        $membership->approve($user);

        return back()->with('success', __('membership.approved'));
    }

    public function rejectMembership(Request $request, User $user, MembershipService $membership): RedirectResponse
    {
        $reason = $request->string('reason')->toString() ?: null;
        $membership->reject($user, $reason);

        return back()->with('success', __('membership.rejected'));
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate(['role' => ['required', 'in:superadmin,provider,member,client']]);
        $user->update(['role' => UserRole::from($request->string('role')->toString())]);

        return back()->with('success', __('admin.role_updated'));
    }

    public function toggleActive(User $user): RedirectResponse
    {
        $user->update(['is_active' => ! $user->is_active]);

        return back()->with('success', __('admin.user_status_updated'));
    }
}
