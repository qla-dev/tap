<?php

namespace Tests\Feature;

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
            'gallery' => ['https://example.test/gallery.jpg'],
            'testimonials' => [],
            'services' => [],
            'google_redirect' => false,
        ];

        $created = $this->postJson('/api/admin/profiles', $profile)
            ->assertCreated()
            ->assertJsonPath('slug', 'example-company')
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
}
