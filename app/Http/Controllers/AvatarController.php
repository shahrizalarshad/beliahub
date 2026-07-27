<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Support\StorageDisk;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

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
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $directory = "avatars/{$user->id}";
        $path = "{$directory}/{$filename}";

        try {
            $disk = Storage::disk(StorageDisk::uploads());
            $disk->putFileAs($directory, $file, $filename);

            if ($user->avatar_path && $disk->exists($user->avatar_path)) {
                $disk->delete($user->avatar_path);
            }

            $user->update(['avatar_path' => $path]);
        } catch (Throwable $e) {
            Log::error('Avatar upload failed', [
                'disk' => StorageDisk::uploads(),
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            return back()->with('error', __('profile.avatar_upload_failed'));
        }

        return back()->with('success', __('profile.avatar_updated'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar_path) {
            try {
                $disk = Storage::disk(StorageDisk::uploads());

                if ($disk->exists($user->avatar_path)) {
                    $disk->delete($user->avatar_path);
                }
            } catch (Throwable $e) {
                Log::error('Avatar delete failed', [
                    'disk' => StorageDisk::uploads(),
                    'user_id' => $user->id,
                    'message' => $e->getMessage(),
                ]);

                return back()->with('error', __('profile.avatar_upload_failed'));
            }

            $user->update(['avatar_path' => null]);
        }

        return back()->with('success', __('profile.avatar_removed'));
    }

    public function show(User $user): Response
    {
        abort_unless((bool) $user->avatar_path, 404);

        try {
            $disk = Storage::disk(StorageDisk::uploads());

            abort_unless($disk->exists($user->avatar_path), 404);

            if (StorageDisk::isRemote()) {
                return redirect()->away(
                    $disk->temporaryUrl($user->avatar_path, now()->addMinutes(60)),
                );
            }

            return $disk->response($user->avatar_path, null, [
                // Path berubah setiap muat naik, jadi selamat dicache lama.
                'Cache-Control' => 'public, max-age=86400',
            ]);
        } catch (Throwable $e) {
            Log::error('Avatar show failed', [
                'disk' => StorageDisk::uploads(),
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            abort(404);
        }
    }
}
