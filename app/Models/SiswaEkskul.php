<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiswaEkskul extends Model
{
    use HasFactory;

    protected $table = 'siswa_ekskul';

    protected $fillable = [
        'siswa_id',
        'ekskul_id',
        'tanggal_daftar',
        'status',
    ];

    protected $casts = [
        'tanggal_daftar' => 'date',
    ];

    /**
     * Get the siswa for this membership.
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Get the ekskul for this membership.
     */
    public function ekskul()
    {
        return $this->belongsTo(Ekskul::class);
    }
}
