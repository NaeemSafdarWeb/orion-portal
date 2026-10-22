<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentType extends Model
{
    protected $fillable = [
        'name', 'slug', 'applies_to', 'requires_expiry',
        'warning_days', 'required', 'sort_order', 'active',
    ];

    protected function casts(): array
    {
        return [
            'requires_expiry' => 'boolean',
            'required' => 'boolean',
            'active' => 'boolean',
            'warning_days' => 'integer',
        ];
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
