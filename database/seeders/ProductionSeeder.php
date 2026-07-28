<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SkillSeeder::class,
            ServiceSeeder::class,
            SuperadminSeeder::class,
        ]);
    }
}
