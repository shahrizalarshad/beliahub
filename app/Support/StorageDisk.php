<?php

declare(strict_types=1);

namespace App\Support;

final class StorageDisk
{
    public static function uploads(): string
    {
        if (self::hasS3Credentials()) {
            return 's3';
        }

        return config('filesystems.default') === 's3' ? 's3' : 'local';
    }

    public static function isRemote(): bool
    {
        return self::uploads() === 's3';
    }

    private static function hasS3Credentials(): bool
    {
        return filled(env('AWS_ACCESS_KEY_ID'))
            && filled(env('AWS_SECRET_ACCESS_KEY'))
            && filled(env('AWS_BUCKET'))
            && filled(env('AWS_ENDPOINT'));
    }
}
