<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    private function superadmin(): User
    {
        return User::factory()->create(['role' => UserRole::Superadmin]);
    }

    public function test_client_can_apply_for_membership(): void
    {
        $client = User::factory()->create();

        $this->actingAs($client)
            ->post('/membership/apply')
            ->assertRedirect();

        $this->assertNotNull($client->fresh()->membership_applied_at);
    }

    public function test_superadmin_can_approve_membership_and_id_is_generated(): void
    {
        $admin = $this->superadmin();
        $client = User::factory()->create(['membership_applied_at' => now()]);

        $this->actingAs($admin)
            ->post("/admin/users/{$client->id}/membership/approve")
            ->assertRedirect();

        $client->refresh();
        $year = now()->format('Y');

        $this->assertSame(UserRole::Member, $client->role);
        $this->assertSame("BH-{$year}-0001", $client->membership_id);
        $this->assertNull($client->membership_applied_at);
    }

    public function test_membership_ids_increment_sequentially(): void
    {
        $admin = $this->superadmin();
        $first = User::factory()->create(['membership_applied_at' => now()]);
        $second = User::factory()->create(['membership_applied_at' => now()]);

        $this->actingAs($admin)->post("/admin/users/{$first->id}/membership/approve");
        $this->actingAs($admin)->post("/admin/users/{$second->id}/membership/approve");

        $year = now()->format('Y');

        $this->assertSame("BH-{$year}-0001", $first->fresh()->membership_id);
        $this->assertSame("BH-{$year}-0002", $second->fresh()->membership_id);
    }

    public function test_superadmin_can_reject_membership_application(): void
    {
        $admin = $this->superadmin();
        $client = User::factory()->create(['membership_applied_at' => now()]);

        $this->actingAs($admin)
            ->post("/admin/users/{$client->id}/membership/reject", [
                'reason' => 'Maklumat tidak lengkap',
            ])
            ->assertRedirect();

        $client->refresh();

        $this->assertSame(UserRole::Client, $client->role);
        $this->assertNull($client->membership_applied_at);
        $this->assertNull($client->membership_id);
    }

    public function test_non_admin_cannot_approve_membership(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member]);
        $client = User::factory()->create(['membership_applied_at' => now()]);

        $this->actingAs($member)
            ->post("/admin/users/{$client->id}/membership/approve")
            ->assertForbidden();

        $this->assertSame(UserRole::Client, $client->fresh()->role);
    }
}
