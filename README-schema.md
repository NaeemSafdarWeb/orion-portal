# Orion DOT Portal, Milestone 1 schema

Drop these into the project, keeping the folder structure:

    app/Models/*.php
    app/Models/Concerns/BelongsToCompany.php
    app/Support/BlindIndex.php
    database/migrations/*.php
    database/seeders/PortalSeeder.php

## Run

    php artisan migrate
    php artisan db:seed --class=PortalSeeder

The seeder only creates demo data in local and staging. In production it seeds
roles, permissions, document types and the admin user, nothing else.

Admin login after seeding: admin@oriondot.com / ChangeMe!2026
Change that before the staging link goes to the client.

## Add to the User model

    use Illuminate\Database\Eloquent\SoftDeletes;

    use SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'company_id', 'phone', 'active',
    ];

    public function role() { return $this->belongsTo(\App\Models\Role::class); }
    public function company() { return $this->belongsTo(\App\Models\Company::class); }

    public function isClient(): bool { return $this->company_id !== null; }

    public function can(string $permission): bool
    {
        return (bool) $this->role?->hasPermission($permission);
    }

## Two decisions baked in

**Blind index.** license_number and dd_number are encrypted, so SQL cannot search
them. Each one carries an HMAC of the normalised value in a *_hash column, and
exact match search runs against that. Without this, checklist item 17 (search a
driver by license number) and checklist item 36 (encrypted at rest) contradict
each other.

**Company scoping.** users.company_id is NULL for Orion DOT staff and set for
client users. The BelongsToCompany trait applies this as a global scope, so
every query on Driver, Vehicle and Company is restricted automatically rather
than per screen. This is what makes Phase 3 client access a configuration
change instead of a rebuild, which is what the client was told.

## Note on the seeded documents

Rows point at paths that do not exist on disk. That is fine for building and
testing the alert screens. Milestone 3 adds real uploads.
