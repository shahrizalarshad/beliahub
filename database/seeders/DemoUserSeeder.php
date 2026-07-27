<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\SequenceType;
use App\Enums\UserRole;
use App\Models\Skill;
use App\Models\User;
use App\Services\SequenceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make(env('DEMO_USER_PASSWORD', 'password'));

        User::updateOrCreate(
            ['email' => env('DEMO_CLIENT_EMAIL', 'client@beliahub.test')],
            [
                'name' => 'Pelanggan Demo',
                'password' => $password,
                'role' => UserRole::Client,
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '0123456789',
                'locality' => 'Kuala Lumpur',
            ],
        );

        $provider = User::updateOrCreate(
            ['email' => env('DEMO_PROVIDER_EMAIL', 'provider@beliahub.test')],
            [
                'name' => 'Petugas Demo',
                'password' => $password,
                'role' => UserRole::Provider,
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '0129876543',
                'locality' => 'Selangor',
                'bio' => 'Penyedia perkhidmatan digital untuk demo Belia Hub.',
            ],
        );

        $member = User::updateOrCreate(
            ['email' => env('DEMO_MEMBER_EMAIL', 'member@beliahub.test')],
            [
                'name' => 'Ahli Demo',
                'password' => $password,
                'role' => UserRole::Member,
                'email_verified_at' => now(),
                'is_active' => true,
                'phone' => '0134567890',
                'locality' => 'Johor Bahru',
                'bio' => 'Ahli aktif organisasi belia — akaun demo.',
                'membership_applied_at' => now(),
            ],
        );

        if (! $member->membership_id) {
            $member->update([
                'membership_id' => app(SequenceService::class)->next(SequenceType::Membership),
            ]);
        }

        $skillIds = Skill::query()->orderBy('name')->limit(3)->pluck('id');

        if ($skillIds->isNotEmpty()) {
            $provider->skills()->sync($skillIds);
            $member->skills()->sync($skillIds);
        }
    }
}
