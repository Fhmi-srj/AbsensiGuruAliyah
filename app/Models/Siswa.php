<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'nama',
        'status',
        'nis',
        'nisn',
        'kelas_id',
        'jenis_kelamin',
        'alamat',
        'tanggal_lahir',
        'tempat_lahir',
        'asal_sekolah',
        'kontak_ortu',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    /**
     * Get the kelas that this siswa belongs to.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
