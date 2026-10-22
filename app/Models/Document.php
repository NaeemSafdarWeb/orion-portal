<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    use SoftDeletes;

    public const STATUS_OK = 'ok';
    public const STATUS_WARNING = 'warning';   // yellow
    public const STATUS_EXPIRED = 'expired';   // red

    protected $fillable = [
        'documentable_type', 'documentable_id', 'document_type_id',
        'disk', 'path', 'original_name', 'mime_type', 'size_bytes',
        'issued_on', 'expires_on', 'replaced_by_id', 'is_current',
        'uploaded_by', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'expires_on' => 'date',
            'is_current' => 'boolean',
        ];
    }

    public function documentable()
    {
        return $this->morphTo();
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeCurrent(Builder $query): Builder
    {
        return $query->where('is_current', true);
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->current()->whereNotNull('expires_on')->whereDate('expires_on', '<', now());
    }

    /**
     * Due within the warning window for its document type.
     */
    public function scopeDueSoon(Builder $query): Builder
    {
        return $query->current()
            ->whereNotNull('expires_on')
            ->whereDate('expires_on', '>=', now())
            ->whereHas('documentType', function (Builder $q) {
                $q->whereRaw('DATEDIFF(documents.expires_on, CURDATE()) <= document_types.warning_days');
            });
    }

    public function getStatusAttribute(): string
    {
        if (! $this->expires_on) {
            return self::STATUS_OK;
        }

        if ($this->expires_on->isPast()) {
            return self::STATUS_EXPIRED;
        }

        $warningDays = $this->documentType?->warning_days ?? 30;

        return $this->expires_on->diffInDays(now()) <= $warningDays
            ? self::STATUS_WARNING
            : self::STATUS_OK;
    }

    public function getDaysUntilExpiryAttribute(): ?int
    {
        return $this->expires_on ? (int) now()->startOfDay()->diffInDays($this->expires_on, false) : null;
    }

    /**
     * Always go through the filesystem disk, never a hardcoded path, so the
     * move to Azure Blob Storage is a config change.
     */
    public function getUrlAttribute(): ?string
    {
        return $this->path ? Storage::disk($this->disk)->temporaryUrl($this->path, now()->addMinutes(10)) : null;
    }
}
