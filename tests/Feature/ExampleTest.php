<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_admin_application_is_not_treated_as_a_customer_profile(): void
    {
        $response = $this->get('/admin');

        $response->assertOk();
        $response->assertHeader('content-type', 'text/html; charset=UTF-8');
    }

    public function test_admin_client_routes_return_the_admin_application(): void
    {
        $this->get('/admin/profiles/example')->assertOk();
    }
}
