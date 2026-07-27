<?php

declare(strict_types=1);

namespace App\Enums;

enum SequenceType: string
{
    case Membership = 'membership';
    case Order = 'order';
    case Invoice = 'invoice';
    case Receipt = 'receipt';

    public function prefix(): string
    {
        return match ($this) {
            self::Membership => 'BH',
            self::Order => 'ORD',
            self::Invoice => 'INV',
            self::Receipt => 'RCP',
        };
    }
}
