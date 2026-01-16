<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama_kegiatan' => 'Pelatihan Guru Matematika',
                'waktu_mulai' => '2024-07-01',
                'waktu_berakhir' => '2024-07-01',
                'penanggung_jawab' => 'Ahmad Fauzi',
                'status_kbm' => 'Aktif',
            ],
            [
                'nama_kegiatan' => 'Workshop Bahasa Indonesia',
                'waktu_mulai' => '2024-07-05',
                'waktu_berakhir' => '2024-07-05',
                'penanggung_jawab' => 'Siti Nurhaliza',
                'status_kbm' => 'Tidak Aktif',
            ],
            [
                'nama_kegiatan' => 'Seminar Fisika Terapan',
                'waktu_mulai' => '2024-07-10',
                'waktu_berakhir' => '2024-07-10',
                'penanggung_jawab' => 'Budi Santoso',
                'status_kbm' => 'Aktif',
            ],
            [
                'nama_kegiatan' => 'Pelatihan Kimia Dasar',
                'waktu_mulai' => '2024-07-15',
                'waktu_berakhir' => '2024-07-15',
                'penanggung_jawab' => 'Dewi Lestari',
                'status_kbm' => 'Aktif',
            ],
            [
                'nama_kegiatan' => 'Workshop Sejarah Nasional',
                'waktu_mulai' => '2024-07-20',
                'waktu_berakhir' => '2024-07-20',
                'penanggung_jawab' => 'Rizky Ramadhan',
                'status_kbm' => 'Tidak Aktif',
            ],
        ];

        foreach ($data as $item) {
            DB::table('kegiatan')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
