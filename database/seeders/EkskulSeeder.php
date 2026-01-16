<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ekskul;
use App\Models\Guru;

class EkskulSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first 10 guru IDs for pembina
        $guruIds = Guru::where('status', 'Aktif')->pluck('id')->take(10)->toArray();

        $ekskulData = [
            [
                'nama_ekskul' => 'Pramuka',
                'kategori' => 'Keagamaan',
                'hari' => 'Jumat',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Lapangan Utama',
                'deskripsi' => 'Gerakan Pramuka untuk membentuk karakter siswa',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Futsal',
                'kategori' => 'Olahraga',
                'hari' => 'Selasa',
                'jam_mulai' => '15:00',
                'jam_selesai' => '17:00',
                'tempat' => 'Lapangan Futsal',
                'deskripsi' => 'Olahraga futsal untuk siswa putra dan putri',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'PMR (Palang Merah Remaja)',
                'kategori' => 'Keagamaan',
                'hari' => 'Rabu',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Ruang UKS',
                'deskripsi' => 'Pelatihan pertolongan pertama dan kepalangmerahan',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Paduan Suara',
                'kategori' => 'Seni',
                'hari' => 'Kamis',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Aula Sekolah',
                'deskripsi' => 'Latihan bernyanyi bersama untuk acara sekolah',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'English Club',
                'kategori' => 'Akademik',
                'hari' => 'Senin',
                'jam_mulai' => '14:00',
                'jam_selesai' => '15:30',
                'tempat' => 'Ruang Bahasa',
                'deskripsi' => 'Klub bahasa Inggris untuk meningkatkan kemampuan speaking',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Basket',
                'kategori' => 'Olahraga',
                'hari' => 'Kamis',
                'jam_mulai' => '15:00',
                'jam_selesai' => '17:00',
                'tempat' => 'Lapangan Basket',
                'deskripsi' => 'Latihan basket untuk kompetisi antar sekolah',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Rohis (Rohani Islam)',
                'kategori' => 'Keagamaan',
                'hari' => 'Jumat',
                'jam_mulai' => '13:00',
                'jam_selesai' => '14:30',
                'tempat' => 'Mushola Sekolah',
                'deskripsi' => 'Kajian keislaman dan kegiatan keagamaan',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Seni Tari',
                'kategori' => 'Seni',
                'hari' => 'Sabtu',
                'jam_mulai' => '09:00',
                'jam_selesai' => '11:00',
                'tempat' => 'Ruang Seni',
                'deskripsi' => 'Latihan tari tradisional dan modern',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Jurnalistik',
                'kategori' => 'Akademik',
                'hari' => 'Rabu',
                'jam_mulai' => '14:00',
                'jam_selesai' => '16:00',
                'tempat' => 'Ruang Media',
                'deskripsi' => 'Pelatihan menulis berita dan majalah sekolah',
                'status' => 'Aktif',
            ],
            [
                'nama_ekskul' => 'Voli',
                'kategori' => 'Olahraga',
                'hari' => 'Senin',
                'jam_mulai' => '15:00',
                'jam_selesai' => '17:00',
                'tempat' => 'Lapangan Voli',
                'deskripsi' => 'Latihan bola voli putra dan putri',
                'status' => 'Aktif',
            ],
        ];

        foreach ($ekskulData as $index => $ekskul) {
            // Assign pembina from guru list if available
            $ekskul['pembina_id'] = $guruIds[$index] ?? null;
            Ekskul::create($ekskul);
        }
    }
}
