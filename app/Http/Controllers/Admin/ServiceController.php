<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->withCount('orders')
            ->orderBy('name')
            ->get()
            ->map(fn (Service $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'slug' => $s->slug,
                'price_formatted' => 'RM'.number_format((float) $s->price, 2),
                'is_active' => $s->is_active,
                'orders_count' => $s->orders_count,
            ]);

        return Inertia::render('Admin/Services/Index', ['services' => $services]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Services/Form', ['service' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        Service::create($data);

        return redirect()->route('admin.services.index')->with('success', __('admin.service_created'));
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('Admin/Services/Form', [
            'service' => $service->only(['id', 'name', 'price', 'description', 'order_instructions', 'is_active']),
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $data = $this->validated($request);
        $service->update($data);

        return redirect()->route('admin.services.index')->with('success', __('admin.service_updated'));
    }

    public function destroy(Service $service): RedirectResponse
    {
        if ($service->orders()->exists()) {
            return back()->with('error', __('admin.service_has_orders'));
        }

        $service->delete();

        return back()->with('success', __('admin.service_deleted'));
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'order_instructions' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]) + ['is_active' => $request->boolean('is_active', true)];
    }
}
