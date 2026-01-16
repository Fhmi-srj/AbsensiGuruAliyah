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
        Schema::table('kegiatan', function (Blueprint $table) {
            // Drop old columns and replace with new structure
            $table->enum('jenis_kegiatan', ['Rutin', 'Tahunan', 'Insidental'])->default('Rutin')->after('nama_kegiatan');
            $table->string('tempat', 100)->nullable()->after('waktu_berakhir');
            $table->unsignedBigInteger('penanggung_jawab_id')->nullable()->after('tempat');
            $table->string('peserta', 100)->nullable()->after('penanggung_jawab_id');
            $table->text('deskripsi')->nullable()->after('peserta');
            $table->enum('status', ['Aktif', 'Selesai', 'Dibatalkan'])->default('Aktif')->after('deskripsi');

            $table->foreign('penanggung_jawab_id')->references('id')->on('guru')->onDelete('set null');
        });

        // Modify waktu_mulai and waktu_berakhir to datetime
        Schema::table('kegiatan', function (Blueprint $table) {
            $table->dateTime('waktu_mulai')->change();
            $table->dateTime('waktu_berakhir')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kegiatan', function (Blueprint $table) {
            $table->dropForeign(['penanggung_jawab_id']);
            $table->dropColumn(['jenis_kegiatan', 'tempat', 'penanggung_jawab_id', 'peserta', 'deskripsi', 'status']);
        });

        Schema::table('kegiatan', function (Blueprint $table) {
            $table->date('waktu_mulai')->change();
            $table->date('waktu_berakhir')->change();
        });
    }
};
