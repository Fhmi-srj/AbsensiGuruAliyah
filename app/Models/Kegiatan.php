<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use HasFactory;

    protected $table = 'kegiatan';

    protected $fillable = [
        'nama_kegiatan',
        'jenis_kegiatan',
        'waktu_mulai',
        'waktu_berakhir',
        'tempat',
        'penanggung_jawab_id',
        'penanggung_jawab', // Keep for backward compatibility
        'peserta',
        'deskripsi',
        'status',
        'status_kbm', // Keep for backward compatibility
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_berakhir' => 'datetime',
    ];

    /**
     * Get the penanggung jawab (guru) for this kegiatan.
     */
    public function penanggungjawab()
    {
        return $this->belongsTo(Guru::class, 'penanggung_jawab_id');
    }
}
