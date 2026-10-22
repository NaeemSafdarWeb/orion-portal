<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();

            // Attaches to a company, driver or vehicle.
            $table->morphs('documentable');

            $table->foreignId('document_type_id')->constrained()->restrictOnDelete();

            // Disk is stored per file so local staging and Azure Blob can coexist
            // during the move in Milestone 4.
            $table->string('disk', 30)->default('local');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();

            $table->date('issued_on')->nullable();
            $table->date('expires_on')->nullable()->index();

            // Replacing a document keeps the old row rather than deleting it,
            // which is checklist item 26 and also matters for the audit trail.
            $table->foreignId('replaced_by_id')->nullable()->constrained('documents')->nullOnDelete();
            $table->boolean('is_current')->default(true)->index();

            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['documentable_type', 'documentable_id', 'is_current'], 'documents_owner_current_idx');
            $table->index(['is_current', 'expires_on'], 'documents_current_expiry_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
