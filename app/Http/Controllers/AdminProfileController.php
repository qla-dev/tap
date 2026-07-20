<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(User::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['password'] = Hash::make(str()->random(40));

        $profile = User::create($data);

        return response()->json($profile, 201);
    }

    public function update(Request $request, User $profile): JsonResponse
    {
        $profile->update($this->validated($request, $profile));

        return response()->json($profile->fresh());
    }

    public function destroy(User $profile): JsonResponse
    {
        $profile->delete();

        return response()->json(status: 204);
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?User $profile = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'alpha_dash', 'max:255', Rule::unique('users', 'slug')->ignore($profile)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($profile)],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'office_number' => ['nullable', 'string', 'max:255'],
            'office_address' => ['nullable', 'string', 'max:255'],
            'profile_image' => ['nullable', 'string', 'max:2048'],
            'cover_image' => ['nullable', 'string', 'max:2048'],
            'title' => ['nullable', 'string', 'max:255'],
            'about_me' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['array'],
            'gallery.*.image' => ['required', 'string', 'max:2048'],
            'gallery.*.zoom' => ['nullable', 'string', 'max:2048'],
            'gallery.*.alt' => ['nullable', 'string', 'max:255'],
            'map_location' => ['nullable', 'string'],
            'testimonials' => ['nullable', 'array'],
            'services' => ['nullable', 'array'],
            'facebook' => ['nullable', 'string', 'max:2048'],
            'instagram' => ['nullable', 'string', 'max:2048'],
            'whatsapp' => ['nullable', 'string', 'max:2048'],
            'linkedin' => ['nullable', 'string', 'max:2048'],
            'twitter' => ['nullable', 'string', 'max:2048'],
            'youtube' => ['nullable', 'string', 'max:2048'],
            'booking' => ['nullable', 'string', 'max:2048'],
            'airbnb' => ['nullable', 'string', 'max:2048'],
            'google' => ['nullable', 'string', 'max:2048'],
            'pik' => ['nullable', 'string', 'max:2048'],
            'office_hours_monday' => ['nullable', 'string', 'max:255'],
            'office_hours_tuesday' => ['nullable', 'string', 'max:255'],
            'office_hours_wednesday' => ['nullable', 'string', 'max:255'],
            'office_hours_thursday' => ['nullable', 'string', 'max:255'],
            'office_hours_friday' => ['nullable', 'string', 'max:255'],
            'office_hours_saturday' => ['nullable', 'string', 'max:255'],
            'office_hours_sunday' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:2048'],
            'directions' => ['nullable', 'string', 'max:2048'],
            'reviews' => ['nullable', 'string', 'max:2048'],
            'work_hours' => ['nullable'],
            'google_redirect' => ['boolean'],
        ]);
    }
}
