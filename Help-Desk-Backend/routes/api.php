<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TiketController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PeLaporController;
use App\Http\Controllers\LokasiController;

Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    // Admin Authentication Routes
    Route::prefix('admin')->group(function () {
        // Public route
        Route::middleware(['throttle:20,1'])->post('/login', [AdminController::class, 'login']); // Stricter limit for login
        
        // Protected routes (require valid admin token)
        Route::middleware(['admin.auth'])->group(function () {
            Route::post('/logout', [AdminController::class, 'logout']);
            Route::get('/verify-token', [AdminController::class, 'verifyToken']);
            Route::get('/profile', [AdminController::class, 'profile']);
            Route::put('/change-password', [AdminController::class, 'changePassword']);
        });
    });

    // Pelapor Routes
    Route::prefix('pelapor')->group(function () {
        Route::post('/', [PeLaporController::class, 'store']);
        Route::get('/', [PeLaporController::class, 'index']);
        Route::get('/{id}', [PeLaporController::class, 'show']);
    });

    // Tiket Routes (SINGULAR - tiket not tikets)
    Route::prefix('tiket')->group(function () {
        // SPECIFIC ROUTES FIRST (fixed: routes conflict issue #1)
        Route::get('/stats/report', [TiketController::class, 'getStats']);
        Route::get('/search/by-phone/{no_telepon}', [TiketController::class, 'searchByPhone']);
        Route::put('/{id}/status', [TiketController::class, 'updateStatus']);
        
        // DYNAMIC ROUTES LAST
        Route::get('/', [TiketController::class, 'index']);
        Route::post('/', [TiketController::class, 'store']);
        Route::get('/{nomor_tiket}', [TiketController::class, 'show']);
        Route::put('/{nomor_tiket}', [TiketController::class, 'update']);
        Route::delete('/{nomor_tiket}', [TiketController::class, 'destroy']);
    });

    // Kategori Routes
    Route::prefix('kategori')->group(function () {
        // SPECIFIC ROUTES FIRST (fixed: routes conflict issue #2)
        Route::get('/', [KategoriController::class, 'index']);
        Route::get('/{id}/jenis-permasalahan', [KategoriController::class, 'getJenisByKategori']);
        Route::get('/by-slug/{slug}', [KategoriController::class, 'getBySlug']);
        
        // DYNAMIC ROUTES LAST
        Route::get('/{id}', [KategoriController::class, 'show']);
    });

    // Lokasi Routes
    Route::prefix('lokasi')->group(function () {
        Route::get('/', [LokasiController::class, 'index']);
        Route::get('/by-kategori/{kategori_id}', [LokasiController::class, 'getByKategori']);
    });
});
