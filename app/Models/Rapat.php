<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rapat extends Model
{
    use HasFactory;

    protected $table = 'rapat';

    protected $fillable = [
        'agenda_rapat',
        'jenis_rapat',
        'pimpinan',
        'sekretaris',
        'notulis_id',
        'tanggal',
        'waktu_mulai',
        'waktu_selesai',
        'tempat',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /**
     * Get the notulis (guru) for this rapat.
     */
    public function notulis()
    {
        return $this->belongsTo(Guru::class, 'notulis_id');
    }
}
