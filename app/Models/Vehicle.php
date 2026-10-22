<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use BelongsToCompany, HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'vin', 'unit_number', 'make', 'model', 'year',
        'license_plate', 'plate_state', 'tire_size', 'vehicle_type',
        'active', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function getLabelAttribute(): string
    {
        return trim($this->vin.' | '.collect([$this->make, $this->model])->filter()->implode(' - '));
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('vin', 'like', "%{$term}%")
              ->orWhere('unit_number', 'like', "%{$term}%")
              ->orWhere('license_plate', 'like', "%{$term}%")
              ->orWhere('make', 'like', "%{$term}%")
              ->orWhere('model', 'like', "%{$term}%");
        });
    }
}
