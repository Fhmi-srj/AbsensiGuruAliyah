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
        Schema::create('siswa_ekskul', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('siswa_id');
            $table->unsignedBigInteger('ekskul_id');
            $table->date('tanggal_daftar')->nullable();
            $table->enum('status', ['Aktif', 'Keluar'])->default('Aktif');
            $table->timestamps();

            $table->foreign('siswa_id')->references('id')->on('siswa')->onDelete('cascade');
            $table->foreign('ekskul_id')->references('id')->on('ekskul')->onDelete('cascade');

            // Prevent duplicate entries
            $table->unique(['siswa_id', 'ekskul_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa_ekskul');
    }
};
