<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('vin', 25)->index();
            $table->string('unit_number', 50)->nullable()->index();
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->year('year')->nullable();
            $table->string('license_plate', 20)->nullable()->index();
            $table->string('plate_state', 50)->nullable();
            $table->string('tire_size', 30)->nullable();
            $table->string('vehicle_type', 50)->nullable(); // tractor, trailer, straight truck
            $table->boolean('active')->default(true)->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
