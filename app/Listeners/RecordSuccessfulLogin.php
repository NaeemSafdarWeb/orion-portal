<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

/**
 * Fills users.last_login_at. Useful on the Users screen, and it is the first
 * thing anyone asks for when an account looks suspicious.
 */
class RecordSuccessfulLogin
{
    public function handle(Login $event): void
    {
        $event->user->forceFill([
            'last_login_at' => now(),
        ])->saveQuietly();
    }
}
