<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RapatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'agenda_rapat' => 'Rapat Koordinasi Kurikulum',
                'pimpinan' => 'Ahmad Fauzi',
                'sekretaris' => 'Siti Nurhaliza',
                'tanggal' => '2024-07-01',
                'waktu_mulai' => '09:00',
                'waktu_selesai' => '11:00',
                'tempat' => 'Ruang Rapat Utama',
            ],
            [
                'agenda_rapat' => 'Rapat Evaluasi Semester',
                'pimpinan' => 'Budi Santoso',
                'sekretaris' => 'Dewi Lestari',
                'tanggal' => '2024-07-05',
                'waktu_mulai' => '13:00',
                'waktu_selesai' => '15:00',
                'tempat' => 'Ruang Rapat 2',
            ],
            [
                'agenda_rapat' => 'Rapat Persiapan Ujian',
                'pimpinan' => 'Rizky Ramadhan',
                'sekretaris' => 'Ahmad Fauzi',
                'tanggal' => '2024-07-10',
                'waktu_mulai' => '10:00',
                'waktu_selesai' => '12:00',
                'tempat' => 'Ruang Rapat Utama',
            ],
            [
                'agenda_rapat' => 'Rapat Pengembangan SDM',
                'pimpinan' => 'Dewi Lestari',
                'sekretaris' => 'Budi Santoso',
                'tanggal' => '2024-07-15',
                'waktu_mulai' => '14:00',
                'waktu_selesai' => '16:00',
                'tempat' => 'Ruang Rapat 3',
            ],
            [
                'agenda_rapat' => 'Rapat Pembahasan Anggaran',
                'pimpinan' => 'Siti Nurhaliza',
                'sekretaris' => 'Rizky Ramadhan',
                'tanggal' => '2024-07-20',
                'waktu_mulai' => '08:00',
                'waktu_selesai' => '10:00',
                'tempat' => 'Ruang Rapat Utama',
            ],
        ];

        foreach ($data as $item) {
            DB::table('rapat')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
