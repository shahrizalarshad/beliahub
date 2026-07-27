<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Superadmin = 'superadmin';
    case Provider = 'provider';
    case Member = 'member';
    case Client = 'client';

    public function label(): string
    {
        return match ($this) {
            self::Superadmin => 'Pentadbir',
            self::Provider => 'Petugas',
            self::Member => 'Ahli',
            self::Client => 'Pelanggan',
        };
    }

    public function isStaff(): bool
    {
        return in_array($this, [self::Superadmin, self::Provider, self::Member], true);
    }

    public function canAccessEvents(): bool
    {
        return in_array($this, [self::Superadmin, self::Provider, self::Member], true);
    }
}
