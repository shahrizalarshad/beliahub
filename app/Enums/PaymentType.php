<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentType: string
{
    case Deposit = 'deposit';
    case Balance = 'balance';
    case Refund = 'refund';

    public function label(): string
    {
        return match ($this) {
            self::Deposit => 'Deposit',
            self::Balance => 'Baki',
            self::Refund => 'Bayaran Balik',
        };
    }
}
