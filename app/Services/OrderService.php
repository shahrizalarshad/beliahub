<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\SequenceType;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class OrderService
{
    public function __construct(
        private readonly SequenceService $sequences,
    ) {}

    public function create(User $client, Service $service, int $quantity, ?string $requirements): ServiceOrder
    {
        $quantity = max(1, $quantity);
        $unitPrice = (float) $service->price;
        $total = round($unitPrice * $quantity, 2);
        $deposit = round($total * 0.5, 2);

        return ServiceOrder::create([
            'order_no' => $this->sequences->next(SequenceType::Order),
            'user_id' => $client->id,
            'service_id' => $service->id,
            'status' => OrderStatus::Pending,
            'unit_price' => $unitPrice,
            'quantity' => $quantity,
            'total_amount' => $total,
            'deposit_amount' => $deposit,
            'requirements' => $requirements,
        ]);
    }

    public function transition(ServiceOrder $order, OrderStatus $target, ?User $provider = null): ServiceOrder
    {
        if (! $order->status->canTransitionTo($target)) {
            throw new InvalidArgumentException(__('orders.invalid_transition'));
        }

        return DB::transaction(function () use ($order, $target, $provider): ServiceOrder {
            $updates = ['status' => $target];

            if ($target === OrderStatus::InProgress) {
                $updates['confirmed_at'] = now();
                if ($provider) {
                    $updates['provider_id'] = $provider->id;
                }
            }

            if ($target === OrderStatus::Completed) {
                $updates['completed_at'] = now();
            }

            if ($target === OrderStatus::Cancelled) {
                $updates['cancelled_at'] = now();
            }

            $order->update($updates);

            return $order->fresh(['service', 'client', 'provider']);
        });
    }

    public function assignProvider(ServiceOrder $order, User $provider): ServiceOrder
    {
        $order->update(['provider_id' => $provider->id]);

        return $order->fresh();
    }
}
