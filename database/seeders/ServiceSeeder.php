<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Website',
                'slug' => 'website',
                'price' => 300.00,
                'description' => 'Laman web profesional untuk individu, PKS, atau organisasi — responsif dan mesra pengguna.',
                'order_instructions' => 'Sila nyatakan tujuan laman web, warna/branding, dan contoh rujukan jika ada.',
            ],
            [
                'name' => 'App / APK',
                'slug' => 'app',
                'price' => 150.00,
                'description' => 'Aplikasi mudah alih atau pakej APK untuk projek digital anda.',
                'order_instructions' => 'Terangkan fungsi aplikasi, platform sasaran (Android/iOS), dan ciri utama.',
            ],
            [
                'name' => 'Resume',
                'slug' => 'resume',
                'price' => 50.00,
                'description' => 'Resume profesional dalam format PDF, siap untuk permohonan kerja atau biasiswa.',
                'order_instructions' => 'Muat naik maklumat peribadi, pendidikan, pengalaman, dan kemahiran.',
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => $service['slug']],
                $service + ['is_active' => true],
            );
        }
    }
}
