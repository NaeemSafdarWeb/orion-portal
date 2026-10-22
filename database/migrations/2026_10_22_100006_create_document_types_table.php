<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');                       // "Driver License"
            $table->string('slug')->unique();             // "driver-license"
            $table->enum('applies_to', ['company', 'driver', 'vehicle'])->index();
            $table->boolean('requires_expiry')->default(true);

            // Days before expiry that this document turns yellow. Editable in the UI,
            // which is what checklist item 24 asks for.
            $table->unsignedSmallInteger('warning_days')->default(30);

            $table->boolean('required')->default(false);  // drives "what is missing" later
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};
