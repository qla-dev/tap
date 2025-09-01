<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
                // Additional fields for user profile
            $table->string('phone_number')->nullable();
            $table->string('office_number')->nullable();
            $table->string('office_address')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('title')->nullable();
            $table->text('about_me')->nullable();
            $table->json('gallery')->nullable(); // Store gallery images as JSON array
            $table->string('map_location')->nullable(); // Store map coordinates or address
            $table->json('testimonials')->nullable(); // Store testimonials as JSON array
            $table->json('services')->nullable(); // Store services as JSON array
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('twitter')->nullable();
            $table->string('youtube')->nullable();
            $table->string('office_hours_monday')->nullable();
            $table->string('office_hours_tuesday')->nullable();
            $table->string('office_hours_wednesday')->nullable();
            $table->string('office_hours_thursday')->nullable();
            $table->string('office_hours_friday')->nullable();
            $table->string('office_hours_saturday')->nullable();
            $table->string('office_hours_sunday')->nullable();
            $table->string('website')->nullable();
            $table->string('directions')->nullable();                               
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
