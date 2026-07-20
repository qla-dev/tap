<?php

use App\Http\Controllers\AdminProfileController;
use Illuminate\Support\Facades\Route;

Route::apiResource('admin/profiles', AdminProfileController::class)
    ->only(['index', 'store', 'update', 'destroy']);
