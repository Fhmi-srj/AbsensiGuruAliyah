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
        Schema::table('jadwal', function (Blueprint $table) {
            $table->time('jam_mulai')->nullable()->after('jam_ke');
            $table->time('jam_selesai')->nullable()->after('jam_mulai');
            $table->enum('semester', ['Ganjil', 'Genap'])->default('Ganjil')->after('hari');
            $table->string('tahun_ajaran', 20)->default('2025/2026')->after('semester');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif')->after('tahun_ajaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropColumn(['jam_mulai', 'jam_selesai', 'semester', 'tahun_ajaran', 'status']);
        });
    }
};
