<?php

declare(strict_types=1);

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EarningsController extends Controller
{
    public function index(Request $request): Response
    {
        $payouts = Payout::query()
            ->with('order.service')
            ->where('provider_id', $request->user()->id)
            ->latest('paid_at')
            ->get()
            ->map(fn (Payout $payout) => [
                'id' => $payout->id,
                'order_no' => $payout->order->order_no,
                'service_name' => $payout->order->service->name,
                'amount_formatted' => 'RM'.number_format((float) $payout->amount, 2),
                'method' => $payout->method,
                'paid_at' => $payout->paid_at->format('d/m/Y'),
            ]);

        $total = (float) Payout::query()->where('provider_id', $request->user()->id)->sum('amount');

        return Inertia::render('Provider/Earnings/Index', [
            'payouts' => $payouts,
            'total_formatted' => 'RM'.number_format($total, 2),
        ]);
    }
}
