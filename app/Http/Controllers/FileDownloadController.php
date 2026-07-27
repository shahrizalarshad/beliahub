<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\OrderFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileDownloadController extends Controller
{
    public function __invoke(Request $request, string $path): StreamedResponse
    {
        $decoded = base64_decode(strtr($path, '-_', '+/'), true);

        abort_if($decoded === false, 404);

        $file = OrderFile::query()->where('path', $decoded)->firstOrFail();
        $order = $file->order;
        $user = $request->user();

        abort_unless(
            $order->user_id === $user->id
            || $order->provider_id === $user->id
            || $user->isSuperadmin(),
            403,
        );

        abort_unless(Storage::disk('local')->exists($decoded), 404);

        return Storage::disk('local')->download($decoded, $file->original_name);
    }
}
