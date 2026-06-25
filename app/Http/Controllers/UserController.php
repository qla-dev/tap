<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function show($name)
    {
        $user = User::where('slug', $name)
            ->orWhere('name', $name)
            ->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->google_redirect && !empty($user->reviews)) {
            return redirect()->away($user->reviews);
        }

        return view('index', ['user' => $user]);
    }
}
