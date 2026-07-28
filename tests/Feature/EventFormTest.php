<?php

namespace Tests\Feature;

use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EventFormTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
    }

    private function superadmin(): User
    {
        return User::factory()->create(['role' => UserRole::Superadmin]);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Kem Belia 2026',
            'description' => 'Program pembangunan kepimpinan belia.',
            'location' => 'Dewan Komuniti',
            'starts_at' => now()->addDay()->format('Y-m-d\TH:i'),
            'ends_at' => now()->addDay()->addHours(3)->format('Y-m-d\TH:i'),
            'budget' => '1500.00',
            'status' => 'draft',
        ], $overrides);
    }

    public function test_superadmin_can_create_event_with_budget_and_description(): void
    {
        $this->actingAs($this->superadmin())
            ->post(route('admin.events.store'), $this->validPayload())
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHas('success');

        $event = Event::firstOrFail();

        $this->assertSame('Kem Belia 2026', $event->title);
        $this->assertSame('Program pembangunan kepimpinan belia.', $event->description);
        $this->assertSame('1500.00', $event->budget);
    }

    public function test_superadmin_can_update_actual_spend_after_event(): void
    {
        $admin = $this->superadmin();
        $event = Event::create([
            'title' => 'Workshop Digital',
            'description' => 'Asas reka bentuk web.',
            'location' => 'Bilik Mesyuarat',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subDay()->addHours(2),
            'budget' => 500,
            'status' => EventStatus::Done,
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.events.update', $event), $this->validPayload([
                'title' => $event->title,
                'description' => $event->description,
                'location' => $event->location,
                'starts_at' => $event->starts_at->format('Y-m-d\TH:i'),
                'ends_at' => $event->ends_at->format('Y-m-d\TH:i'),
                'budget' => '500.00',
                'actual_spend' => '475.50',
                'status' => 'done',
            ]))
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHas('success');

        $this->assertSame('475.50', $event->fresh()->actual_spend);
    }

    public function test_superadmin_can_upload_event_poster(): void
    {
        $this->actingAs($this->superadmin())
            ->post(route('admin.events.store'), [
                ...$this->validPayload(),
                'poster' => UploadedFile::fake()->image('poster.jpg'),
            ])
            ->assertRedirect(route('admin.events.index'))
            ->assertSessionHas('success');

        $event = Event::firstOrFail();

        $this->assertNotNull($event->poster_path);
        Storage::disk('local')->assertExists($event->poster_path);
    }

    public function test_invalid_poster_is_rejected(): void
    {
        $this->actingAs($this->superadmin())
            ->post(route('admin.events.store'), [
                ...$this->validPayload(),
                'poster' => UploadedFile::fake()->create('not-an-image.pdf', 100, 'application/pdf'),
            ])
            ->assertSessionHasErrors('poster');
    }
}
