<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->limit(3)
            ->get()
            ->map(function (Service $service): array {
                $price = (float) $service->price;
                $deposit = $price * 0.5;

                return [
                    'slug' => $service->slug,
                    'name' => $service->name,
                    'description' => $service->description ?? '',
                    'price' => $price,
                    'price_formatted' => $this->formatRinggit($price),
                    'deposit_formatted' => $this->formatRinggit($deposit),
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Landing', [
            'services' => $services,
            'translations' => __('landing'),
            'heroImageUrl' => $this->resolveHeroImageUrl(),
            'heroImageFallbackUrl' => $this->resolvePublicImageUrl(
                (string) config('beliahub.landing.hero_image_fallback', ''),
            ),
            'heroOverlay' => (float) config('beliahub.landing.hero_overlay', 0.55),
            'stats' => $this->stats(),
            'canLogin' => true,
            'canRegister' => true,
        ]);
    }

    private function stats(): array
    {
        return [
            'members' => User::query()->where('role', UserRole::Member)->where('is_active', true)->count(),
            'services' => Service::query()->where('is_active', true)->count(),
            'completed_orders' => ServiceOrder::query()->where('status', 'completed')->count(),
        ];
    }

    private function resolveHeroImageUrl(): ?string
    {
        $configured = $this->resolvePublicImageUrl(
            (string) config('beliahub.landing.hero_image', ''),
        );

        if ($configured !== null) {
            return $configured;
        }

        // Prefer compressed assets if legacy/env path is missing (e.g. old hero.png).
        foreach (['images/hero.webp', 'images/hero.jpg', 'images/hero.png'] as $candidate) {
            $url = $this->resolvePublicImageUrl($candidate);
            if ($url !== null) {
                return $url;
            }
        }

        return null;
    }

    private function resolvePublicImageUrl(string $image): ?string
    {
        $image = trim($image);

        if ($image === '') {
            return null;
        }

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        $relative = ltrim($image, '/');

        if (! is_file(public_path($relative))) {
            return null;
        }

        return '/'.$relative;
    }

    private function formatRinggit(float $amount): string
    {
        return 'RM'.number_format($amount, 2);
    }
}
