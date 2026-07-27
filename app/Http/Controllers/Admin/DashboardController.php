<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $members = User::query()->where('role', UserRole::Member)->where('is_active', true)->count();
        $clients = User::query()->where('role', UserRole::Client)->count();
        $pendingApps = User::query()->whereNotNull('membership_applied_at')->where('role', UserRole::Client)->count();
        $gross = (float) Payment::query()->whereIn('type', ['deposit', 'balance'])->sum('amount')
            - (float) Payment::query()->where('type', 'refund')->sum('amount');
        $payouts = (float) Payout::query()->sum('amount');
        $activeOrders = ServiceOrder::query()->whereIn('status', ['pending', 'in_progress'])->count();

        $outstanding = ServiceOrder::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->get()
            ->sum(fn (ServiceOrder $order) => $order->balanceDue());

        $pendingConfirmation = ServiceOrder::query()->where('status', 'pending')->count();
        $staleOrders = ServiceOrder::query()
            ->where('status', 'pending')
            ->get()
            ->filter(fn (ServiceOrder $order) => $order->isStale())
            ->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'active_members' => $members,
                'clients' => $clients,
                'pending_applications' => $pendingApps,
                'gross_collection_formatted' => 'RM'.number_format($gross, 2),
                'total_payouts_formatted' => 'RM'.number_format($payouts, 2),
                'net_revenue_formatted' => 'RM'.number_format($gross - $payouts, 2),
                'outstanding_balance_formatted' => 'RM'.number_format($outstanding, 2),
                'active_orders' => $activeOrders,
            ],
            'actionQueue' => [
                'pending_applications' => $pendingApps,
                'pending_confirmation' => $pendingConfirmation,
                'stale_orders' => $staleOrders,
            ],
            'charts' => $this->chartData(),
        ]);
    }

    private function chartData(): array
    {
        $months = collect(range(11, 0))
            ->map(fn (int $offset) => now()->subMonths($offset)->startOfMonth());

        $labels = $months->map(fn (Carbon $month) => $month->translatedFormat('M Y'))->values()->all();

        $registrations = $months->map(
            fn (Carbon $month) => User::query()
                ->whereBetween('created_at', [$month, $month->copy()->endOfMonth()])
                ->count()
        )->values()->all();

        $collections = $months->map(function (Carbon $month): float {
            $in = (float) Payment::query()
                ->whereIn('type', ['deposit', 'balance'])
                ->whereBetween('paid_at', [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()])
                ->sum('amount');
            $refund = (float) Payment::query()
                ->where('type', 'refund')
                ->whereBetween('paid_at', [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()])
                ->sum('amount');

            return $in - $refund;
        })->values()->all();

        $payoutSeries = $months->map(
            fn (Carbon $month) => (float) Payout::query()
                ->whereBetween('paid_at', [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()])
                ->sum('amount')
        )->values()->all();

        $ordersByService = ServiceOrder::query()
            ->with('service')
            ->get()
            ->groupBy(fn (ServiceOrder $order) => $order->service->name)
            ->map(fn ($group) => $group->count());

        return [
            'labels' => $labels,
            'registrations' => $registrations,
            'collections' => $collections,
            'payouts' => $payoutSeries,
            'orders_by_service' => [
                'labels' => $ordersByService->keys()->values()->all(),
                'data' => $ordersByService->values()->all(),
            ],
        ];
    }
}
