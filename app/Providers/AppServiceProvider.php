<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production', 'staging')) {
        \Illuminate\Support\Facades\URL::forceScheme('https');
    }
        \Illuminate\Support\Facades\Event::listen(
        \Illuminate\Auth\Events\Login::class,
        \App\Listeners\RecordSuccessfulLogin::class,
        );
        Vite::prefetch(concurrency: 3);
    }
}
