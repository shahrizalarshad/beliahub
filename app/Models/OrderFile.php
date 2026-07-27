<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FileCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderFile extends Model
{
    protected $fillable = [
        'service_order_id',
        'uploaded_by',
        'category',
        'path',
        'original_name',
        'size',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'category' => FileCategory::class,
            'size' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(ServiceOrder::class, 'service_order_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
