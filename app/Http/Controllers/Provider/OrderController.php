<?php

declare(strict_types=1);

namespace App\Http\Controllers\Provider;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Mail\OrderCompletedMail;
use App\Models\ServiceOrder;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = ServiceOrder::query()
            ->with(['service', 'client'])
            ->where('provider_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'service_name' => $order->service->name,
                'client_name' => $order->client->name,
                'status' => $order->status->value,
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Provider/Orders/Index', ['orders' => $orders]);
    }

    public function complete(Request $request, ServiceOrder $order, OrderService $orders): RedirectResponse
    {
        abort_unless(
            $order->provider_id === $request->user()->id || $request->user()->isSuperadmin(),
            403,
        );

        $order = $orders->transition($order, OrderStatus::Completed);

        try {
            Mail::to($order->client->email)->send(new OrderCompletedMail($order));
        } catch (\Throwable $e) {
            Log::warning('Mail delivery failed: '.$e->getMessage());
        }

        activity()->performedOn($order)->causedBy($request->user())->log('Tempahan ditanda selesai');

        return back()->with('success', __('orders.completed'));
    }
}
