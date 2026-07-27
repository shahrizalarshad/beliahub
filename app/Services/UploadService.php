<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\FileCategory;
use App\Models\OrderFile;
use App\Models\ServiceOrder;
use App\Models\User;
use App\Support\StorageDisk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService
{
    public function storeOrderFile(
        ServiceOrder $order,
        User $uploader,
        UploadedFile $file,
        FileCategory $category,
    ): OrderFile {
        $disk = StorageDisk::uploads();
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = "orders/{$order->id}/{$category->value}/{$filename}";

        Storage::disk($disk)->put($path, $file->get());

        return OrderFile::create([
            'service_order_id' => $order->id,
            'uploaded_by' => $uploader->id,
            'category' => $category,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
        ]);
    }

    public function temporaryUrl(string $path, int $minutes = 30): ?string
    {
        $disk = Storage::disk(StorageDisk::uploads());

        if (! $disk->exists($path)) {
            return null;
        }

        if (StorageDisk::isRemote()) {
            return $disk->temporaryUrl($path, now()->addMinutes($minutes));
        }

        // URL-safe base64 so the encoded path fits in a single route segment.
        return route('files.download', [
            'path' => rtrim(strtr(base64_encode($path), '+/', '-_'), '='),
        ]);
    }
}
