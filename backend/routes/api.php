<?php

use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\TagController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('tags', TagController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::get('posts', [PostController::class, 'index']);
        Route::get('posts/{post}', [PostController::class, 'show']);
        Route::post('posts', [PostController::class, 'store']);
    });
});
