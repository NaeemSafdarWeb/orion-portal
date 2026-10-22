<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Driver;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Vehicle;
use App\Support\BlindIndex;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Seeds roles, permissions, document types and a realistic data set:
 * 50 companies, 2,000 drivers, 2,000 vehicles and their documents.
 *
 * Run with: php artisan db:seed --class=PortalSeeder
 */
class PortalSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPermissions();
        $this->seedRoles();
        $this->seedDocumentTypes();
        $this->seedUsers();

        if (app()->environment('local', 'staging')) {
            $this->seedDemoData();
        }
    }

    private function seedPermissions(): void
    {
        $map = [
            'Companies' => ['view', 'create', 'edit', 'delete'],
            'Drivers' => ['view', 'create', 'edit', 'delete'],
            'Vehicles' => ['view', 'create', 'edit', 'delete'],
            'Documents' => ['view', 'upload', 'replace', 'download', 'delete'],
            'Reports' => ['view', 'print', 'export'],
            'Users' => ['view', 'create', 'edit', 'delete'],
            'Roles' => ['view', 'create', 'edit', 'delete'],
            'Audit' => ['view', 'export'],
        ];

        foreach ($map as $group => $actions) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    ['slug' => Str::slug($group).'.'.$action],
                    ['name' => ucfirst($action).' '.$group, 'group' => $group],
                );
            }
        }
    }

    private function seedRoles(): void
    {
        $administrator = Role::updateOrCreate(
            ['slug' => 'administrator'],
            ['name' => 'Administrator', 'is_system' => true, 'description' => 'Full access to everything.'],
        );
        $administrator->permissions()->sync(Permission::pluck('id'));

        $manager = Role::updateOrCreate(
            ['slug' => 'manager'],
            ['name' => 'Manager', 'description' => 'Manages companies, drivers, vehicles and documents.'],
        );
        $manager->permissions()->sync(
            Permission::whereIn('group', ['Companies', 'Drivers', 'Vehicles', 'Documents', 'Reports'])
                ->whereNot('slug', 'like', '%.delete')
                ->pluck('id')
        );

        $supervisor = Role::updateOrCreate(
            ['slug' => 'supervisor'],
            ['name' => 'Supervisor', 'description' => 'Read and print only.'],
        );
        $supervisor->permissions()->sync(
            Permission::where('slug', 'like', '%.view')
                ->orWhere('slug', 'reports.print')
                ->pluck('id')
        );

        // Phase 3 lives here. The role exists now so the scoping it depends on
        // is exercised from the start. Write permissions get added later.
        $client = Role::updateOrCreate(
            ['slug' => 'client'],
            ['name' => 'Client', 'is_client_role' => true, 'description' => 'Sees only their own company.'],
        );
        $client->permissions()->sync(
            Permission::whereIn('slug', [
                'companies.view', 'drivers.view', 'vehicles.view',
                'documents.view', 'documents.download',
                'reports.view', 'reports.print',
            ])->pluck('id')
        );
    }

    private function seedDocumentTypes(): void
    {
        $types = [
            ['Driver License', 'driver', true, 45, true],
            ['Medical Card', 'driver', true, 45, true],
            ['MVR', 'driver', true, 30, false],
            ['Drug Test', 'driver', true, 30, false],
            ['Registration', 'vehicle', true, 45, true],
            ['Annual Inspection', 'vehicle', true, 45, true],
            ['Insurance', 'vehicle', true, 30, false],
            ['IFTA', 'company', true, 45, true],
            ['MCS-150', 'company', true, 60, true],
            ['MCS-90', 'company', true, 60, false],
            ['UCR', 'company', true, 45, false],
        ];

        foreach ($types as $i => [$name, $appliesTo, $requiresExpiry, $warningDays, $required]) {
            DocumentType::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'applies_to' => $appliesTo,
                    'requires_expiry' => $requiresExpiry,
                    'warning_days' => $warningDays,
                    'required' => $required,
                    'sort_order' => $i,
                ],
            );
        }
    }

    private function seedUsers(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@oriondot.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('ChangeMe!2026'),
                'role_id' => Role::where('slug', 'administrator')->value('id'),
                'email_verified_at' => now(),
            ],
        );
    }

    private function seedDemoData(): void
    {
        $faker = \Faker\Factory::create('en_US');
        $now = now();

        $this->command->info('Seeding 50 companies...');

        $companies = [];
        for ($i = 0; $i < 50; $i++) {
            $companies[] = [
                'name' => $faker->company().' '.$faker->randomElement(['Trucking', 'Logistics', 'Transport', 'Freight', 'Carriers']),
                'dot_number' => 'DOT'.$faker->numerify('#######'),
                'mc_number' => 'MC'.$faker->numerify('#######'),
                'address_line_1' => $faker->streetAddress(),
                'city' => $faker->city(),
                'state' => $faker->stateAbbr(),
                'postal_code' => $faker->postcode(),
                'country' => 'US',
                'phone' => $faker->numerify('+1 ### ### ####'),
                'email' => $faker->companyEmail(),
                'contact_name' => $faker->name(),
                'active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        Company::insert($companies);
        $companyIds = Company::withoutGlobalScope('company')->pluck('id')->all();

        $this->command->info('Seeding 2,000 drivers...');

        $driverRows = [];
        for ($i = 0; $i < 2000; $i++) {
            $license = strtoupper($faker->bothify('?#########'));
            $dd = $faker->numerify('####################');

            $driverRows[] = [
                'company_id' => $faker->randomElement($companyIds),
                'first_name' => $faker->firstName(),
                'last_name' => $faker->lastName(),
                'license_number' => Crypt::encryptString($license),
                'license_number_hash' => BlindIndex::make($license),
                'dd_number' => Crypt::encryptString($dd),
                'dd_number_hash' => BlindIndex::make($dd),
                'license_state' => $faker->stateAbbr(),
                'license_class' => $faker->randomElement(['A', 'B', 'C']),
                'endorsements' => $faker->randomElement(['H', 'N', 'T', 'X', 'H, N', 'T, X', null]),
                'restrictions' => $faker->randomElement(['E', 'L', 'O', 'E, L', null]),
                'date_of_birth' => $faker->dateTimeBetween('-65 years', '-23 years')->format('Y-m-d'),
                'hired_on' => $faker->dateTimeBetween('-8 years', 'now')->format('Y-m-d'),
                'phone' => $faker->numerify('+1 ### ### ####'),
                'email' => $faker->safeEmail(),
                'active' => $faker->boolean(92),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if (count($driverRows) === 500) {
                DB::table('drivers')->insert($driverRows);
                $driverRows = [];
            }
        }
        if ($driverRows) {
            DB::table('drivers')->insert($driverRows);
        }

        $this->command->info('Seeding 2,000 vehicles...');

        $vehicleRows = [];
        for ($i = 0; $i < 2000; $i++) {
            $vehicleRows[] = [
                'company_id' => $faker->randomElement($companyIds),
                'vin' => strtoupper($faker->bothify('#??#??#########')),
                'unit_number' => (string) $faker->numberBetween(1, 400),
                'make' => $faker->randomElement(['Freightliner', 'Peterbilt', 'Kenworth', 'Volvo', 'Mack', 'International']),
                'model' => $faker->randomElement(['Cascadia', '579', 'T680', 'VNL 760', 'Anthem', 'LT']),
                'year' => $faker->numberBetween(2012, 2026),
                'license_plate' => strtoupper($faker->bothify('???####')),
                'plate_state' => $faker->stateAbbr(),
                'tire_size' => $faker->randomElement(['20"', '22.5"', '24.5"']),
                'vehicle_type' => $faker->randomElement(['tractor', 'trailer', 'straight truck']),
                'active' => $faker->boolean(94),
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if (count($vehicleRows) === 500) {
                DB::table('vehicles')->insert($vehicleRows);
                $vehicleRows = [];
            }
        }
        if ($vehicleRows) {
            DB::table('vehicles')->insert($vehicleRows);
        }

        $this->command->info('Seeding documents with a realistic spread of expiry dates...');

        $this->seedDocumentsFor(Driver::class, 'drivers', 'driver', $faker, $now);
        $this->seedDocumentsFor(Vehicle::class, 'vehicles', 'vehicle', $faker, $now);
        $this->seedDocumentsFor(Company::class, 'companies', 'company', $faker, $now);

        $this->command->info('Done. Seeded '.Company::withoutGlobalScope('company')->count().' companies, '
            .DB::table('drivers')->count().' drivers, '
            .DB::table('vehicles')->count().' vehicles, '
            .DB::table('documents')->count().' documents.');
    }

    /**
     * Roughly 10% expired, 15% due soon, the rest fine. That spread is what
     * makes the alert screens look real when the client first opens them.
     */
    private function seedDocumentsFor(string $model, string $table, string $appliesTo, $faker, $now): void
    {
        $types = DocumentType::where('applies_to', $appliesTo)->get();
        $ids = DB::table($table)->pluck('id');
        $rows = [];

        foreach ($ids as $ownerId) {
            foreach ($types as $type) {
                // Not every record has every document, which is realistic and
                // also gives the "what is missing" view something to find.
                if (! $type->required && $faker->boolean(40)) {
                    continue;
                }

                $roll = $faker->numberBetween(1, 100);

                $expiresOn = match (true) {
                    $roll <= 10 => $faker->dateTimeBetween('-6 months', '-1 day'),
                    $roll <= 25 => $faker->dateTimeBetween('+1 day', '+'.$type->warning_days.' days'),
                    default => $faker->dateTimeBetween('+'.($type->warning_days + 1).' days', '+2 years'),
                };

                $rows[] = [
                    'documentable_type' => $model,
                    'documentable_id' => $ownerId,
                    'document_type_id' => $type->id,
                    'disk' => 'local',
                    'path' => 'demo/'.Str::uuid().'.pdf',
                    'original_name' => Str::slug($type->name).'.pdf',
                    'mime_type' => 'application/pdf',
                    'size_bytes' => $faker->numberBetween(80000, 2500000),
                    'issued_on' => $faker->dateTimeBetween('-3 years', '-1 month')->format('Y-m-d'),
                    'expires_on' => $expiresOn->format('Y-m-d'),
                    'is_current' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($rows) === 1000) {
                    DB::table('documents')->insert($rows);
                    $rows = [];
                }
            }
        }

        if ($rows) {
            DB::table('documents')->insert($rows);
        }
    }
}
