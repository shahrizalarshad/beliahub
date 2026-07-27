<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\ServiceOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->role === UserRole::Superadmin) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === UserRole::Provider) {
            return redirect()->route('provider.orders.index');
        }

        $recentOrders = ServiceOrder::query()
            ->with('service')
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'service_name' => $order->service->name,
                'status' => $order->status->value,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Dashboard', [
            'recentOrders' => $recentOrders,
            'membership' => [
                'is_member' => $user->isMember(),
                'is_pending' => $user->hasPendingMembershipApplication(),
                'membership_id' => $user->membership_id,
            ],
            'canApplyMembership' => $user->isClient() && ! $user->hasPendingMembershipApplication(),
        ]);
    }
}
