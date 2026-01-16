<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->enum('tingkat', ['X', 'XI', 'XII'])->default('X')->after('inisial');
            $table->foreignId('wali_kelas_id')->nullable()->after('tingkat')->constrained('guru')->nullOnDelete();
            $table->integer('kapasitas')->default(36)->after('wali_kelas_id');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif')->after('kapasitas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropForeign(['wali_kelas_id']);
            $table->dropColumn(['tingkat', 'wali_kelas_id', 'kapasitas', 'status']);
        });
    }
};
