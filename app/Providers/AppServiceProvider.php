<?php

namespace App\Providers;

use App\Listeners\RecordSuccessfulLogin;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(Login::class, RecordSuccessfulLogin::class);

        if ($this->app->environment('production', 'staging')) {
            URL::forceScheme('https');
        }
    }
}