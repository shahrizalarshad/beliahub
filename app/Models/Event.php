<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EventStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'starts_at',
        'ends_at',
        'budget',
        'actual_spend',
        'poster_path',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => EventStatus::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'budget' => 'decimal:2',
            'actual_spend' => 'decimal:2',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function isWithinWindow(): bool
    {
        $grace = (int) config('beliahub.attendance_grace_minutes', 15);
        $now = now();

        return $now->between(
            $this->starts_at->copy()->subMinutes($grace),
            $this->ends_at->copy()->addMinutes($grace)
        );
    }
}
