<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCompany;
use App\Support\BlindIndex;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use BelongsToCompany, HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'first_name', 'last_name',
        'license_number', 'dd_number', 'license_state', 'license_class',
        'endorsements', 'restrictions', 'date_of_birth', 'hired_on',
        'phone', 'email', 'active', 'notes',
    ];

    protected $hidden = ['license_number_hash', 'dd_number_hash'];

    protected function casts(): array
    {
        return [
            // Encrypted at rest. Reading the raw database row shows ciphertext,
            // which is what gets demonstrated for checklist item 36.
            'license_number' => 'encrypted',
            'dd_number' => 'encrypted',
            'date_of_birth' => 'date',
            'hired_on' => 'date',
            'active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        // Keep the searchable hashes in step with the encrypted values.
        static::saving(function (Driver $driver) {
            if ($driver->isDirty('license_number')) {
                $driver->license_number_hash = BlindIndex::make($driver->license_number);
            }

            if ($driver->isDirty('dd_number')) {
                $driver->dd_number_hash = BlindIndex::make($driver->dd_number);
            }
        });
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    /**
     * Name search is a LIKE. License and DD number search goes through the
     * blind index, so it is exact match only, which is how people search
     * for a license number anyway.
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        $hash = BlindIndex::make($term);

        return $query->where(function (Builder $q) use ($term, $hash) {
            $q->where('first_name', 'like', "%{$term}%")
              ->orWhere('last_name', 'like', "%{$term}%")
              ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$term}%"]);

            if ($hash) {
                $q->orWhere('license_number_hash', $hash)
                  ->orWhere('dd_number_hash', $hash);
            }
        });
    }
}
