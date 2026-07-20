<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'slug')) {
                $table->string('slug')->nullable()->unique();
            }
            if (! Schema::hasColumn('users', 'testimonials')) {
                $table->json('testimonials')->nullable();
            }
            if (! Schema::hasColumn('users', 'services')) {
                $table->json('services')->nullable();
            }
            if (! Schema::hasColumn('users', 'booking')) {
                $table->string('booking')->nullable();
            }
            if (! Schema::hasColumn('users', 'airbnb')) {
                $table->string('airbnb')->nullable();
            }
            if (! Schema::hasColumn('users', 'google')) {
                $table->string('google')->nullable();
            }
            if (! Schema::hasColumn('users', 'pik')) {
                $table->string('pik')->nullable();
            }
            if (! Schema::hasColumn('users', 'reviews')) {
                $table->string('reviews')->nullable();
            }
            if (! Schema::hasColumn('users', 'work_hours')) {
                $table->json('work_hours')->nullable();
            }
            if (! Schema::hasColumn('users', 'views')) {
                $table->unsignedBigInteger('views')->default(0);
            }
        });
    }

    public function down(): void
    {
        // These columns may predate this migration in deployed databases, so
        // intentionally leave them intact on rollback.
    }
};
