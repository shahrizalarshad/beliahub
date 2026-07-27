<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            'Web Design',
            'Copywriting',
            'Video Editing',
            'App Development',
            'Graphic Design',
            'Jahitan',
            'Photography',
            'Social Media',
        ];

        foreach ($skills as $name) {
            Skill::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );
        }
    }
}
