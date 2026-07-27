<?php

declare(strict_types=1);

namespace App\Http\Controllers\Provider;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\ServiceOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $providerId = $request->user()->id;

        $orders = ServiceOrder::query()
            ->where('provider_id', $providerId)
            ->get();

        $needsAction = ServiceOrder::query()
            ->with(['service', 'client'])
            ->where('provider_id', $providerId)
            ->where('status', OrderStatus::InProgress)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'service_name' => $order->service->name,
                'client_name' => $order->client->name,
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        $recentPayouts = Payout::query()
            ->with('order.service')
            ->where('provider_id', $providerId)
            ->latest('paid_at')
            ->limit(5)
            ->get()
            ->map(fn (Payout $payout) => [
                'id' => $payout->id,
                'order_no' => $payout->order->order_no,
                'service_name' => $payout->order->service->name,
                'amount_formatted' => 'RM'.number_format((float) $payout->amount, 2),
                'paid_at' => $payout->paid_at->format('d/m/Y'),
            ]);

        return Inertia::render('Provider/Dashboard', [
            'stats' => [
                'assigned' => $orders->count(),
                'in_progress' => $orders->where('status', OrderStatus::InProgress)->count(),
                'completed' => $orders->where('status', OrderStatus::Completed)->count(),
                'earnings_formatted' => 'RM'.number_format(
                    (float) Payout::query()->where('provider_id', $providerId)->sum('amount'),
                    2,
                ),
            ],
            'needsAction' => $needsAction,
            'recentPayouts' => $recentPayouts,
        ]);
    }
}
