<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCatalogController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'description' => $service->description,
                'order_instructions' => $service->order_instructions,
                'price' => (float) $service->price,
                'price_formatted' => 'RM'.number_format((float) $service->price, 2),
                'deposit_formatted' => 'RM'.number_format((float) $service->price * 0.5, 2),
            ]);

        return Inertia::render('Services/Catalog', [
            'services' => $services,
            'translations' => __('landing'),
        ]);
    }
}
