<?php

namespace Tests\Feature;

use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    private function publishedEvent(): Event
    {
        return Event::create([
            'title' => 'Perhimpunan Belia',
            'description' => 'Program tahunan',
            'location' => 'Dewan Komuniti',
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHour(),
            'status' => EventStatus::Published,
            'created_by' => User::factory()->create(['role' => UserRole::Superadmin])->id,
        ]);
    }

    private function signedScanUrl(Event $event): string
    {
        return URL::temporarySignedRoute('attendance.scan', now()->addMinutes(5), [
            'event' => $event->id,
        ]);
    }

    public function test_member_can_record_attendance(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member]);
        $event = $this->publishedEvent();

        $this->actingAs($member)
            ->get($this->signedScanUrl($event))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('success');

        $this->assertSame(1, Attendance::where('event_id', $event->id)->count());
    }

    public function test_duplicate_attendance_is_blocked(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member]);
        $event = $this->publishedEvent();

        $this->actingAs($member)->get($this->signedScanUrl($event));

        $this->actingAs($member)
            ->get($this->signedScanUrl($event))
            ->assertSessionHas('error');

        $this->assertSame(1, Attendance::where('event_id', $event->id)->count());
    }

    public function test_client_cannot_record_attendance(): void
    {
        $client = User::factory()->create(['role' => UserRole::Client]);
        $event = $this->publishedEvent();

        $this->actingAs($client)
            ->get($this->signedScanUrl($event))
            ->assertSessionHas('error');

        $this->assertSame(0, Attendance::count());
    }

    public function test_attendance_outside_event_window_is_blocked(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member]);
        $event = $this->publishedEvent();
        $event->update([
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDay()->addHours(2),
        ]);

        $this->actingAs($member)
            ->get($this->signedScanUrl($event))
            ->assertSessionHas('error');

        $this->assertSame(0, Attendance::count());
    }

    public function test_unsigned_scan_url_is_rejected(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member]);
        $event = $this->publishedEvent();

        $this->actingAs($member)
            ->get(route('attendance.scan', $event))
            ->assertForbidden();

        $this->assertSame(0, Attendance::count());
    }

    public function test_superadmin_can_view_attendance_list(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member, 'membership_id' => 'BH-2026-0001']);
        $event = $this->publishedEvent();
        $admin = User::where('role', UserRole::Superadmin)->firstOrFail();

        Attendance::create([
            'event_id' => $event->id,
            'user_id' => $member->id,
            'scanned_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get("/admin/events/{$event->id}/attendances")
            ->assertOk();
    }

    public function test_superadmin_can_export_attendance_csv(): void
    {
        $member = User::factory()->create(['role' => UserRole::Member, 'membership_id' => 'BH-2026-0001']);
        $event = $this->publishedEvent();
        $admin = User::where('role', UserRole::Superadmin)->firstOrFail();

        Attendance::create([
            'event_id' => $event->id,
            'user_id' => $member->id,
            'scanned_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->get("/admin/events/{$event->id}/attendances/export");

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

        $csv = $response->streamedContent();

        $this->assertStringContainsString($member->name, $csv);
        $this->assertStringContainsString('BH-2026-0001', $csv);
    }
}
