<?php

namespace App\Support;

use Illuminate\Support\Facades\Config;

/**
 * Deterministic hash used to search encrypted columns.
 *
 * Encrypted values are different every time they are written, so SQL cannot
 * match on them. Alongside each encrypted column we store an HMAC of the
 * normalised value, and exact-match searches run against that instead.
 *
 * The app key is the secret, so this hash is useless to anyone who gets hold
 * of the database on its own.
 */
class BlindIndex
{
    public static function make(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        // Normalise so "a-123 456" and "A123456" match.
        $normalised = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $value));

        if ($normalised === '') {
            return null;
        }

        return hash_hmac('sha256', $normalised, Config::get('app.key'));
    }
}
