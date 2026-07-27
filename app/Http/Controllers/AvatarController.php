<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AvatarController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $request->validate(
            ['avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048']],
            [
                'avatar.required' => __('profile.avatar_required'),
                'avatar.image' => __('profile.avatar_invalid'),
                'avatar.mimes' => __('profile.avatar_invalid'),
                'avatar.max' => __('profile.avatar_too_large'),
            ],
        );

        $user = $request->user();
        $file = $request->file('avatar');
        $path = "avatars/{$user->id}/".Str::uuid()->toString().'.'.$file->getClientOriginalExtension();

        $disk = Storage::disk($this->disk());
        $disk->put($path, file_get_contents($file->getRealPath()));

        if ($user->avatar_path && $disk->exists($user->avatar_path)) {
            $disk->delete($user->avatar_path);
        }

        $user->update(['avatar_path' => $path]);

        return back()->with('success', __('profile.avatar_updated'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar_path) {
            $disk = Storage::disk($this->disk());

            if ($disk->exists($user->avatar_path)) {
                $disk->delete($user->avatar_path);
            }

            $user->update(['avatar_path' => null]);
        }

        return back()->with('success', __('profile.avatar_removed'));
    }

    public function show(User $user): Response
    {
        abort_unless((bool) $user->avatar_path, 404);

        $disk = Storage::disk($this->disk());

        abort_unless($disk->exists($user->avatar_path), 404);

        if ($this->disk() === 's3') {
            return redirect()->away(
                $disk->temporaryUrl($user->avatar_path, now()->addMinutes(60)),
            );
        }

        return $disk->response($user->avatar_path, null, [
            // Path berubah setiap muat naik, jadi selamat dicache lama.
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    private function disk(): string
    {
        return config('filesystems.default') === 's3' ? 's3' : 'local';
    }
}
