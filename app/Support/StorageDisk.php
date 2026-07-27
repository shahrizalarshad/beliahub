<?php

declare(strict_types=1);

namespace App\Support;

final class StorageDisk
{
    public static function uploads(): string
    {
        return config('filesystems.default') === 's3' ? 's3' : 'local';
    }

    public static function isRemote(): bool
    {
        return self::uploads() === 's3';
    }
}
