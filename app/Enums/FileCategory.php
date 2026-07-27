<?php

declare(strict_types=1);

namespace App\Enums;

enum FileCategory: string
{
    case Reference = 'reference';
    case Delivery = 'delivery';
    case PaymentProof = 'payment_proof';

    public function label(): string
    {
        return match ($this) {
            self::Reference => 'Rujukan',
            self::Delivery => 'Penghantaran',
            self::PaymentProof => 'Bukti Bayaran',
        };
    }
}
