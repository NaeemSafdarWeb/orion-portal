<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/overview', function () {
        return Inertia::render('Portal/Overview', [
            'stats' => [
                'companies' => \App\Models\Company::count(),
                'alerts' => 0,
                'drivers' => \App\Models\Driver::count(),
                'vehicles' => \App\Models\Vehicle::count(),
                'other' => 0,
            ],
        ]);
    })->name('overview');

    // Placeholders so the sidebar links do not 404 before Phase 2
    Route::get('/users', fn () => Inertia::render('Portal/Overview'))->name('users');
    Route::get('/roles', fn () => Inertia::render('Portal/Overview'))->name('roles');
    Route::get('/notifications', fn () => Inertia::render('Portal/Overview'))->name('notifications');
});

require __DIR__.'/auth.php';
