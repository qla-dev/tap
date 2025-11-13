<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'office_number',
        'office_address',
        'profile_image',
        'cover_image',
        'title',
        'about_me',
        'gallery',
        'map_location',
        'facebook',
        'instagram',
        'whatsapp',
        'linkedin',
        'twitter',
        'youtube',
        'office_hours_monday',
        'office_hours_tuesday',
        'office_hours_wednesday',
        'office_hours_thursday',
        'office_hours_friday',
        'office_hours_saturday',
        'office_hours_sunday',
        'testimonials',
        'services',
        'website',
        'directions',
        'airbnb',
        'google',
        'pik',
        'booking',
        'reviews',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'gallery' => 'array',
            'work_hours' => 'array',
        ];
    }
}
