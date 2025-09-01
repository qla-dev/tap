<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function show($name)
    {
        $user = User::where('name', $name)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return view('index', ['user' => $user]);
    }
}
