<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperadminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('SUPERADMIN_EMAIL', 'admin@beliahub.test')],
            [
                'name' => env('SUPERADMIN_NAME', 'Pentadbir Belia Hub'),
                'password' => Hash::make(env('SUPERADMIN_PASSWORD', 'password')),
                'role' => UserRole::Superadmin,
                'email_verified_at' => now(),
                'is_active' => true,
            ],
        );
    }
}
