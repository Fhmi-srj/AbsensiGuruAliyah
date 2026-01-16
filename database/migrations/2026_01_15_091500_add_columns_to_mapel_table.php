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
        Schema::table('mapel', function (Blueprint $table) {
            $table->string('kode_mapel', 20)->after('inisial')->nullable();
            $table->enum('tingkat', ['X', 'XI', 'XII', 'Semua'])->default('Semua')->after('kode_mapel');
            $table->unsignedBigInteger('guru_pengampu_id')->nullable()->after('tingkat');
            $table->integer('kkm')->default(75)->after('guru_pengampu_id');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif')->after('kkm');

            $table->foreign('guru_pengampu_id')->references('id')->on('guru')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mapel', function (Blueprint $table) {
            $table->dropForeign(['guru_pengampu_id']);
            $table->dropColumn(['kode_mapel', 'tingkat', 'guru_pengampu_id', 'kkm', 'status']);
        });
    }
};
