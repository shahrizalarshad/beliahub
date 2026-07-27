<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Payout;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PayoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    private function completedOrder(User $provider): ServiceOrder
    {
        $service = Service::create([
            'name' => 'Resume',
            'slug' => 'resume',
            'price' => 50.00,
            'is_active' => true,
        ]);

        $order = app(OrderService::class)->create(User::factory()->create(), $service, 1, null);
        $order->update([
            'status' => OrderStatus::Completed,
            'provider_id' => $provider->id,
            'completed_at' => now(),
        ]);

        return $order->fresh();
    }

    public function test_payout_can_be_recorded_for_completed_order(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Superadmin]);
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = $this->completedOrder($provider);

        $this->actingAs($admin)
            ->post("/admin/orders/{$order->id}/payouts", [
                'amount' => 30.00,
                'method' => 'transfer',
                'reference_no' => 'PAY123',
                'paid_at' => now()->format('Y-m-d'),
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $payout = Payout::firstOrFail();

        $this->assertSame($provider->id, $payout->provider_id);
        $this->assertSame($order->id, $payout->service_order_id);
        $this->assertSame('30.00', $payout->amount);
    }

    public function test_payout_rejected_for_incomplete_order(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Superadmin]);
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = $this->completedOrder($provider);
        $order->update(['status' => OrderStatus::InProgress]);

        $this->actingAs($admin)
            ->post("/admin/orders/{$order->id}/payouts", [
                'amount' => 30.00,
                'method' => 'transfer',
                'paid_at' => now()->format('Y-m-d'),
            ])
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertSame(0, Payout::count());
    }

    public function test_provider_can_view_own_earnings(): void
    {
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = $this->completedOrder($provider);

        Payout::create([
            'service_order_id' => $order->id,
            'provider_id' => $provider->id,
            'recorded_by' => User::factory()->create(['role' => UserRole::Superadmin])->id,
            'amount' => 30.00,
            'method' => 'transfer',
            'paid_at' => now(),
        ]);

        $this->actingAs($provider)
            ->get('/provider/earnings')
            ->assertOk();
    }
}
