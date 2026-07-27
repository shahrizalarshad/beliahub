<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use Tests\TestCase;

class OrderTransitionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Storage::fake('local');
    }

    private function service(): Service
    {
        return Service::create([
            'name' => 'Website',
            'slug' => 'website',
            'price' => 300.00,
            'description' => 'Laman web organisasi',
            'order_instructions' => 'Sertakan butiran halaman.',
            'is_active' => true,
        ]);
    }

    private function createOrder(User $client, Service $service): ServiceOrder
    {
        return app(OrderService::class)->create($client, $service, 2, 'Keperluan demo');
    }

    public function test_verified_client_can_create_order_with_50_percent_deposit(): void
    {
        $client = User::factory()->create();
        $service = $this->service();

        $this->actingAs($client)
            ->post('/orders', [
                'service_id' => $service->id,
                'quantity' => 2,
                'requirements' => 'Keperluan demo',
            ])
            ->assertRedirect();

        $order = ServiceOrder::firstOrFail();

        $this->assertSame(OrderStatus::Pending, $order->status);
        $this->assertSame('600.00', $order->total_amount);
        $this->assertSame('300.00', $order->deposit_amount);
    }

    public function test_confirm_requires_assigned_provider(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Superadmin]);
        $order = $this->createOrder(User::factory()->create(), $this->service());

        $this->actingAs($admin)
            ->post("/admin/orders/{$order->id}/confirm")
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertSame(OrderStatus::Pending, $order->fresh()->status);
    }

    public function test_admin_can_assign_provider_and_confirm_order(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Superadmin]);
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = $this->createOrder(User::factory()->create(), $this->service());

        $this->actingAs($admin)
            ->post("/admin/orders/{$order->id}/assign", ['provider_id' => $provider->id])
            ->assertRedirect();

        $this->actingAs($admin)
            ->post("/admin/orders/{$order->id}/confirm")
            ->assertRedirect()
            ->assertSessionHas('success');

        $order->refresh();

        $this->assertSame(OrderStatus::InProgress, $order->status);
        $this->assertSame($provider->id, $order->provider_id);
        $this->assertNotNull($order->confirmed_at);
    }

    public function test_assigned_provider_can_complete_order(): void
    {
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = $this->createOrder(User::factory()->create(), $this->service());
        $order->update(['status' => OrderStatus::InProgress, 'provider_id' => $provider->id]);

        $this->actingAs($provider)
            ->post("/provider/orders/{$order->id}/complete")
            ->assertRedirect();

        $order->refresh();

        $this->assertSame(OrderStatus::Completed, $order->status);
        $this->assertNotNull($order->completed_at);
    }

    public function test_client_can_cancel_pending_order(): void
    {
        $client = User::factory()->create();
        $order = $this->createOrder($client, $this->service());

        $this->actingAs($client)
            ->post("/orders/{$order->id}/cancel")
            ->assertRedirect();

        $this->assertSame(OrderStatus::Cancelled, $order->fresh()->status);
    }

    public function test_illegal_transition_is_rejected(): void
    {
        $order = $this->createOrder(User::factory()->create(), $this->service());

        $this->expectException(InvalidArgumentException::class);

        // pending → completed melangkau in_progress: tidak dibenarkan.
        app(OrderService::class)->transition($order, OrderStatus::Completed);
    }
}
