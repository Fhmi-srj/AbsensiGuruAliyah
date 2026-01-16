<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $table = 'guru';

    protected $fillable = [
        'username',
        'password',
        'nama',
        'nip',
        'email',
        'sk',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'pendidikan',
        'kontak',
        'tmt',
        'jabatan',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tmt' => 'date',
    ];

    /**
     * Get the jadwal for this guru.
     */
    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }
}
