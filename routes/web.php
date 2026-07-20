<?php

use Illuminate\Support\Facades\Route;

Route::get('/admin/{path?}', function () {
    $index = public_path('admin/index.html');

    abort_unless(is_file($index), 503, 'The admin app has not been built. Run `npm run build` in the admin directory.');

    return response()->file($index);
})->where('path', '.*')->name('admin.app');

Route::post('/{name}/count-views', [App\Http\Controllers\UserController::class, 'countViews'])
    ->where('name', '^(?!admin$|api$|up$)[A-Za-z0-9_-]+$');

Route::get('/{name}', [App\Http\Controllers\UserController::class, 'show'])
    ->where('name', '^(?!admin$|api$|up$)[A-Za-z0-9_-]+$');
