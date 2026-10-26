<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('overview')
        : redirect()->route('login');
});

Route::get('/dashboard', fn () => redirect()->route('overview'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/overview', function () {
    $needsAttention = fn ($query) => $query->needsAttention();

    $driverAlerts = \App\Models\Driver::whereHas('documents', $needsAttention)->count();
    $vehicleAlerts = \App\Models\Vehicle::whereHas('documents', $needsAttention)->count();
    $otherAlerts = \App\Models\Company::whereHas('documents', $needsAttention)->count();

    $companiesWithAlerts = \App\Models\Company::where(function ($q) use ($needsAttention) {
        $q->whereHas('documents', $needsAttention)
          ->orWhereHas('drivers.documents', $needsAttention)
          ->orWhereHas('vehicles.documents', $needsAttention);
    })->count();

    return Inertia::render('Portal/Overview', [
        'stats' => [
            'companies' => \App\Models\Company::count(),
            'alerts' => $companiesWithAlerts,
            'drivers' => $driverAlerts,
            'vehicles' => $vehicleAlerts,
            'other' => $otherAlerts,
        ],
    ]);
})->name('overview');

    // Placeholders so the sidebar links do not 404 before Phase 2
    Route::get('/users', fn () => Inertia::render('Portal/Users'))->name('users');
    Route::get('/roles', fn () => Inertia::render('Portal/Roles'))->name('roles');
    Route::get('/notifications', fn () => Inertia::render('Portal/Notifications'))->name('notifications');
});

require __DIR__.'/auth.php';
