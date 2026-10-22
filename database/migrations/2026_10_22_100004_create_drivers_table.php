<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name')->index();

            // Encrypted at rest (Milestone 5). Encrypted columns cannot be searched
            // with SQL, so each one carries a deterministic HMAC alongside it that
            // exact-match search runs against. Milestone 2 needs that search, which
            // is why both columns exist from the start.
            $table->text('license_number')->nullable();
            $table->string('license_number_hash', 64)->nullable()->index();
            $table->text('dd_number')->nullable();
            $table->string('dd_number_hash', 64)->nullable()->index();

            $table->string('license_state', 50)->nullable();
            $table->string('license_class', 10)->nullable();
            $table->string('endorsements')->nullable();
            $table->string('restrictions')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->date('hired_on')->nullable();
            $table->string('phone', 40)->nullable();
            $table->string('email')->nullable();
            $table->boolean('active')->default(true)->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
