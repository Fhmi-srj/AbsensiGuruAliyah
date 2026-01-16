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
        Schema::create('ekskul', function (Blueprint $table) {
            $table->id();
            $table->string('nama_ekskul', 100);
            $table->enum('kategori', ['Olahraga', 'Seni', 'Akademik', 'Keagamaan'])->default('Olahraga');
            $table->unsignedBigInteger('pembina_id')->nullable();
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'])->default('Senin');
            $table->time('jam_mulai')->nullable();
            $table->time('jam_selesai')->nullable();
            $table->string('tempat', 100)->nullable();
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif');
            $table->timestamps();

            $table->foreign('pembina_id')->references('id')->on('guru')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekskul');
    }
};
