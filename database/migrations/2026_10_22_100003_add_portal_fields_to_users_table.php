<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('email')->constrained()->nullOnDelete();

            // NULL for Orion DOT staff. Set for client users, who then only ever
            // see their own company's records. This is what keeps the Phase 3
            // client portal a configuration change rather than a rebuild.
            $table->foreignId('company_id')->nullable()->after('role_id')->constrained()->nullOnDelete();

            $table->string('phone', 40)->nullable()->after('company_id');
            $table->boolean('active')->default(true)->after('phone')->index();
            $table->timestamp('last_login_at')->nullable()->after('active');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
            $table->dropConstrainedForeignId('company_id');
            $table->dropColumn(['phone', 'active', 'last_login_at', 'deleted_at']);
        });
    }
};
