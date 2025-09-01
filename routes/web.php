<?php

use Illuminate\Support\Facades\Route;


Route::get('/{name}', [App\Http\Controllers\UserController::class, 'show']);
