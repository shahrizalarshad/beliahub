<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Skill;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'profile' => [
                'phone' => $user->phone,
                'locality' => $user->locality,
                'bio' => $user->bio,
                'skill_ids' => $user->skills()->pluck('skills.id'),
            ],
            'localities' => config('beliahub.localities'),
            'allSkills' => Skill::query()->orderBy('name')->get(['id', 'name']),
            'canTagSkills' => ! $user->isClient(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $skills = $data['skills'] ?? null;
        unset($data['skills']);

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Spesifikasi: tag skill untuk ahli/petugas/pentadbir sahaja.
        if (is_array($skills) && ! $user->isClient()) {
            $user->skills()->sync($skills);
        }

        return Redirect::route('profile.edit')->with('success', __('profile.updated'));
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
