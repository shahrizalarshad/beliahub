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
            return redirect()->route('provider.dashboard');
        }

        $orders = ServiceOrder::query()->where('user_id', $user->id)->get();

        $recentOrders = $orders
            ->sortByDesc('created_at')
            ->take(5)
            ->load('service')
            ->map(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'service_name' => $order->service->name,
                'status' => $order->status->value,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'created_at' => $order->created_at->format('d/m/Y'),
            ])
            ->values();

        return Inertia::render('Dashboard', [
            'recentOrders' => $recentOrders,
            'stats' => [
                'total_orders' => $orders->count(),
                'active_orders' => $orders->whereIn('status', ['pending', 'in_progress'])->count(),
                'completed_orders' => $orders->where('status', 'completed')->count(),
            ],
            'membership' => [
                'is_member' => $user->isMember(),
                'is_pending' => $user->hasPendingMembershipApplication(),
                'membership_id' => $user->membership_id,
            ],
            'memberCard' => $user->isMember() ? [
                'name' => $user->name,
                'membership_id' => $user->membership_id,
                'role_label' => $user->role->label(),
                'locality' => $user->locality,
                'member_since' => $user->created_at->format('Y'),
                'is_active' => $user->is_active,
                'avatar_url' => $user->avatarUrl(),
            ] : null,
            'canApplyMembership' => $user->isClient() && ! $user->hasPendingMembershipApplication(),
        ]);
    }
}
