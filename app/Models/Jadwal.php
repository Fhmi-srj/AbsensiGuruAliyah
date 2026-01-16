<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwal';

    protected $fillable = [
        'jam_ke',
        'jam_mulai',
        'jam_selesai',
        'guru_id',
        'mapel_id',
        'kelas_id',
        'hari',
        'semester',
        'tahun_ajaran',
        'status',
    ];

    /**
     * Get the guru for this jadwal.
     */
    public function guru()
    {
        return $this->belongsTo(Guru::class);
    }

    /**
     * Get the mapel for this jadwal.
     */
    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }

    /**
     * Get the kelas for this jadwal.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
