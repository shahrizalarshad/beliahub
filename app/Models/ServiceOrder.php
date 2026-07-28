<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FileCategory;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServiceOrder extends Model
{
    protected $fillable = [
        'order_no',
        'user_id',
        'service_id',
        'provider_id',
        'status',
        'unit_price',
        'quantity',
        'total_amount',
        'deposit_amount',
        'requirements',
        'confirmed_at',
        'completed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'unit_price' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'quantity' => 'integer',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(OrderFile::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(OrderComment::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function paidAmount(): float
    {
        return (float) $this->payments()
            ->whereIn('type', ['deposit', 'balance'])
            ->sum('amount')
            - (float) $this->payments()->where('type', 'refund')->sum('amount');
    }

    public function balanceDue(): float
    {
        return max(0, (float) $this->total_amount - $this->paidAmount());
    }

    public function isStale(): bool
    {
        $days = (int) config('beliahub.stale_order_days', 14);

        return $this->status === OrderStatus::Pending
            && $this->created_at->lt(now()->subDays($days))
            && $this->paidAmount() <= 0;
    }

    public function viewerCanAccess(User $user): bool
    {
        return $this->user_id === $user->id
            || $user->isSuperadmin()
            || $this->provider_id === $user->id;
    }

    /** @return array<string, bool> */
    public function uploadPermissionsFor(User $user): array
    {
        if (! $this->viewerCanAccess($user)) {
            return [
                FileCategory::Reference->value => false,
                FileCategory::PaymentProof->value => false,
                FileCategory::Delivery->value => false,
            ];
        }

        if ($user->isSuperadmin()) {
            return [
                FileCategory::Reference->value => true,
                FileCategory::PaymentProof->value => true,
                FileCategory::Delivery->value => true,
            ];
        }

        return [
            FileCategory::Reference->value => $this->user_id === $user->id,
            FileCategory::PaymentProof->value => $this->user_id === $user->id,
            FileCategory::Delivery->value => $this->provider_id === $user->id,
        ];
    }

    public function userCanUploadCategory(User $user, string $category): bool
    {
        return $this->uploadPermissionsFor($user)[$category] ?? false;
    }
}
