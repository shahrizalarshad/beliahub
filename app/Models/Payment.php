<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'service_order_id',
        'recorded_by',
        'type',
        'amount',
        'method',
        'reference_no',
        'order_file_id',
        'receipt_no',
        'receipt_path',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => PaymentType::class,
            'amount' => 'decimal:2',
            'paid_at' => 'date',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(ServiceOrder::class, 'service_order_id');
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function proofFile(): BelongsTo
    {
        return $this->belongsTo(OrderFile::class, 'order_file_id');
    }
}
