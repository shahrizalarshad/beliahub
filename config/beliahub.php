<?php

declare(strict_types=1);

return [

    'landing' => [
        'hero_image' => env('LANDING_HERO_IMAGE', 'images/hero.png'),
        'hero_overlay' => (float) env('LANDING_HERO_OVERLAY', 0.55),
    ],

    'localities' => [
        'Kuala Lumpur',
        'Selangor',
        'Johor',
        'Melaka',
        'Negeri Sembilan',
        'Pahang',
        'Terengganu',
        'Kelantan',
        'Kedah',
        'Perlis',
        'Perak',
        'Pulau Pinang',
        'Sabah',
        'Sarawak',
        'Labuan',
        'Putrajaya',
    ],

    'stale_order_days' => 14,
    'attendance_grace_minutes' => 15,
    'attendance_qr_ttl_minutes' => 5,

    'upload' => [
        'max_size_kb' => 10240,
        'allowed_mimes' => ['jpg', 'jpeg', 'png', 'pdf', 'zip', 'docx'],
    ],

    'bank' => [
        'name' => env('ORG_BANK_NAME', ''),
        'account_no' => env('ORG_BANK_ACCOUNT_NO', ''),
        'account_name' => env('ORG_BANK_ACCOUNT_NAME', ''),
    ],

];
