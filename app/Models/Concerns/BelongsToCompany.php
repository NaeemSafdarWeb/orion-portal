<?php

namespace App\Models\Concerns;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

/**
 * Row level scoping.
 *
 * Orion DOT staff have no company_id and see everything. A client user has one,
 * and from that point every query on this model is silently restricted to their
 * own company. Because this is applied as a global scope rather than a where()
 * written per screen, turning on client access in Phase 3 does not mean
 * revisiting every query, which is what was promised to the client.
 *
 * Use withoutCompanyScope() for genuine admin-wide operations such as imports.
 */
trait BelongsToCompany
{
    public static function bootBelongsToCompany(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            $user = Auth::user();

            if ($user && $user->company_id) {
                $builder->where($builder->getModel()->getTable().'.company_id', $user->company_id);
            }
        });

        static::creating(function ($model) {
            $user = Auth::user();

            if (! $model->company_id && $user && $user->company_id) {
                $model->company_id = $user->company_id;
            }
        });
    }

    public function scopeWithoutCompanyScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('company');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
