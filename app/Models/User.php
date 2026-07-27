<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, LogsActivity, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'membership_id',
        'membership_applied_at',
        'phone',
        'locality',
        'bio',
        'avatar_path',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'membership_applied_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['role', 'membership_id', 'is_active'])
            ->logOnlyDirty();
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(ServiceOrder::class, 'user_id');
    }

    public function assignedOrders(): HasMany
    {
        return $this->hasMany(ServiceOrder::class, 'provider_id');
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(Payout::class, 'provider_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function avatarUrl(): ?string
    {
        if (! $this->avatar_path) {
            return null;
        }

        // Parameter v memecah cache browser apabila gambar ditukar.
        return route('avatar.show', [
            'user' => $this->id,
            'v' => substr(md5($this->avatar_path), 0, 8),
        ]);
    }

    public function isSuperadmin(): bool
    {
        return $this->role === UserRole::Superadmin;
    }

    public function isProvider(): bool
    {
        return $this->role === UserRole::Provider;
    }

    public function isMember(): bool
    {
        return $this->role === UserRole::Member;
    }

    public function isClient(): bool
    {
        return $this->role === UserRole::Client;
    }

    public function hasPendingMembershipApplication(): bool
    {
        return $this->membership_applied_at !== null && $this->isClient();
    }
}
