<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Add superadmin to enum first (with all old values)
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('operator', 'kepala_sekolah', 'guru', 'superadmin') DEFAULT 'guru'");

        // Step 2: Update operator and kepala_sekolah to superadmin
        DB::statement("UPDATE users SET role = 'superadmin' WHERE role = 'operator' OR role = 'kepala_sekolah'");

        // Step 3: Remove old values from enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('superadmin', 'guru') DEFAULT 'guru'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('operator', 'kepala_sekolah', 'guru', 'superadmin') DEFAULT 'operator'");
        DB::statement("UPDATE users SET role = 'operator' WHERE role = 'superadmin'");
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('operator', 'kepala_sekolah', 'guru') DEFAULT 'operator'");
    }
};
