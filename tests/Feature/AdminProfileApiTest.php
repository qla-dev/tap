<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_profiles_can_be_created_updated_listed_and_deleted(): void
    {
        $profile = [
            'name' => 'Example Company',
            'slug' => 'example-company',
            'email' => 'example@company.test',
            'gallery' => [[
                'image' => 'https://example.test/gallery.jpg',
                'zoom' => 'https://example.test/gallery-large.jpg',
                'alt' => 'Gallery image',
            ]],
            'testimonials' => [],
            'services' => [],
            'work_hours' => [
                'Ponedjeljak' => '09:00 - 17:00',
                'Utorak' => '09:00 - 17:00',
                'Srijeda' => '09:00 - 17:00',
                'Četvrtak' => '09:00 - 17:00',
                'Petak' => '09:00 - 17:00',
                'Subota' => 'Zatvoreno',
                'Nedjelja' => 'Zatvoreno',
            ],
            'google_redirect' => false,
        ];

        $created = $this->postJson('/api/admin/profiles', $profile)
            ->assertCreated()
            ->assertJsonPath('slug', 'example-company')
            ->assertJsonPath('work_hours.Ponedjeljak', '09:00 - 17:00')
            ->assertJsonMissingPath('password');

        $id = $created->json('id');

        $this->getJson('/api/admin/profiles')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $id);

        $this->putJson("/api/admin/profiles/{$id}", [
            ...$profile,
            'name' => 'Updated Company',
        ])->assertOk()->assertJsonPath('name', 'Updated Company');

        $this->deleteJson("/api/admin/profiles/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('users', ['id' => $id]);
    }

    public function test_profile_view_count_can_be_incremented_without_matching_admin(): void
    {
        $profile = User::factory()->create([
            'slug' => 'example-card',
            'views' => 3,
        ]);

        $this->postJson('/example-card/count-views')
            ->assertOk()
            ->assertJsonPath('views', 4);

        $this->assertDatabaseHas('users', ['id' => $profile->id, 'views' => 4]);
        $this->postJson('/admin/count-views')->assertNotFound();
    }

    public function test_public_profile_page_triggers_its_view_counter(): void
    {
        User::factory()->create([
            'name' => 'Public Profile',
            'slug' => 'public-profile',
            'views' => 0,
            'gallery' => [],
        ]);

        $this->get('/public-profile')
            ->assertOk()
            ->assertSee('public-profile\/count-views', false)
            ->assertSee('X-CSRF-TOKEN', false);
    }
}
