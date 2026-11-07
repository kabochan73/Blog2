<?php

use App\Http\Controllers\Api\Admin\ImageController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\TagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController as PublicPostController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::get('posts', [PublicPostController::class, 'index'])->name('public.posts.index');
Route::get('posts/{post}', [PublicPostController::class, 'show'])->name('public.posts.show');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::apiResource('posts', PostController::class);

        Route::post('images', [ImageController::class, 'store']);
    });
});
