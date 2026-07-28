<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\OrderFile;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class OrderFileUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
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

    private function orderWithProvider(): ServiceOrder
    {
        $client = User::factory()->create();
        $provider = User::factory()->create(['role' => UserRole::Provider]);
        $order = app(OrderService::class)->create($client, $this->service(), 1, 'Keperluan demo');
        $order->update(['status' => OrderStatus::InProgress, 'provider_id' => $provider->id]);

        return $order->fresh(['client', 'provider']);
    }

    private function uploadAs(User $user, ServiceOrder $order, string $category): TestResponse
    {
        return $this->actingAs($user)->post("/orders/{$order->id}/files", [
            'file' => UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'),
            'category' => $category,
        ]);
    }

    public function test_client_can_upload_reference_and_payment_proof(): void
    {
        $order = $this->orderWithProvider();

        $this->uploadAs($order->client, $order, 'reference')
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->uploadAs($order->client, $order, 'payment_proof')
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertSame(2, OrderFile::query()->where('service_order_id', $order->id)->count());
    }

    public function test_client_cannot_upload_delivery_files(): void
    {
        $order = $this->orderWithProvider();

        $this->uploadAs($order->client, $order, 'delivery')
            ->assertForbidden();

        $this->assertSame(0, OrderFile::query()->count());
    }

    public function test_provider_can_upload_delivery_files(): void
    {
        $order = $this->orderWithProvider();

        $this->uploadAs($order->provider, $order, 'delivery')
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('order_files', [
            'service_order_id' => $order->id,
            'uploaded_by' => $order->provider_id,
            'category' => 'delivery',
        ]);
    }

    public function test_provider_cannot_upload_reference_or_payment_proof(): void
    {
        $order = $this->orderWithProvider();

        $this->uploadAs($order->provider, $order, 'reference')
            ->assertForbidden();

        $this->uploadAs($order->provider, $order, 'payment_proof')
            ->assertForbidden();

        $this->assertSame(0, OrderFile::query()->count());
    }

    public function test_superadmin_can_upload_any_category(): void
    {
        $order = $this->orderWithProvider();
        $admin = User::factory()->create(['role' => UserRole::Superadmin]);

        foreach (['reference', 'payment_proof', 'delivery'] as $category) {
            $this->uploadAs($admin, $order, $category)
                ->assertRedirect()
                ->assertSessionHas('success');
        }

        $this->assertSame(3, OrderFile::query()->where('service_order_id', $order->id)->count());
    }
}
