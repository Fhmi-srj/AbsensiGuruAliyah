<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'inisial',
        'tingkat',
        'wali_kelas_id',
        'kapasitas',
        'status',
    ];

    /**
     * Get the siswa for this kelas.
     */
    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }

    /**
     * Get the jadwal for this kelas.
     */
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    /**
     * Get the wali kelas (guru) for this kelas.
     */
    public function waliKelas()
    {
        return $this->belongsTo(Guru::class, 'wali_kelas_id');
    }

    /**
     * Get jumlah siswa count.
     */
    public function getJumlahSiswaAttribute()
    {
        return $this->siswa()->count();
    }
}
