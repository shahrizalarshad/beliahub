<?php

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Demo data untuk semakan UI — selamat dipadam.
$admin = User::where('email', 'admin@beliahub.test')->first();

$member = User::updateOrCreate(
    ['email' => 'demo@beliahub.test'],
    [
        'name' => 'Ahli Demo',
        'password' => Hash::make('password'),
        'role' => UserRole::Member,
        'membership_id' => 'BH-DEMO-0001',
        'locality' => 'Kampung Demo',
        'phone' => '0123456789',
        'email_verified_at' => now(),
        'is_active' => true,
    ],
);

$service = Service::where('slug', 'website')->first()
    ?? Service::first();

$order = ServiceOrder::updateOrCreate(
    ['order_no' => 'BH-ORD-DEMO-0001'],
    [
        'user_id' => $member->id,
        'service_id' => $service->id,
        'provider_id' => $admin?->id,
        'quantity' => 1,
        'unit_price' => $service->price,
        'total_amount' => $service->price,
        'deposit_amount' => round((float) $service->price / 2, 2),
        'status' => OrderStatus::InProgress,
        'requirements' => 'Laman web organisasi dengan 5 halaman (demo).',
    ],
);

echo 'demo member id: '.$member->id.PHP_EOL;
echo 'demo order id: '.$order->id.PHP_EOL;
