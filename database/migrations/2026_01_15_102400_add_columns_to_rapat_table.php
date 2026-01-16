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
        Schema::table('rapat', function (Blueprint $table) {
            $table->enum('jenis_rapat', ['Rutin', 'Koordinasi', 'Darurat', 'Evaluasi'])->default('Rutin')->after('agenda_rapat');
            $table->unsignedBigInteger('notulis_id')->nullable()->after('sekretaris');
            $table->enum('status', ['Dijadwalkan', 'Berlangsung', 'Selesai', 'Dibatalkan'])->default('Dijadwalkan')->after('tempat');

            $table->foreign('notulis_id')->references('id')->on('guru')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rapat', function (Blueprint $table) {
            $table->dropForeign(['notulis_id']);
            $table->dropColumn(['jenis_rapat', 'notulis_id', 'status']);
        });
    }
};
