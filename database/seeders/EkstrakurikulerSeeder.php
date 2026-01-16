<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EkstrakurikulerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_ekstra' => 'Pramuka', 'penanggung_jawab' => 'Budi Santoso', 'hari' => 'Senin', 'waktu' => '15:00', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'Paskibra', 'penanggung_jawab' => 'Dewi Lestari', 'hari' => 'Rabu', 'waktu' => '16:00', 'durasi' => '1.5 jam'],
            ['nama_ekstra' => 'Basket', 'penanggung_jawab' => 'Ahmad Fauzi', 'hari' => 'Jumat', 'waktu' => '15:30', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'Teater', 'penanggung_jawab' => 'Siti Nurhaliza', 'hari' => 'Selasa', 'waktu' => '16:00', 'durasi' => '1 jam'],
            ['nama_ekstra' => 'Musik', 'penanggung_jawab' => 'Rizky Ramadhan', 'hari' => 'Kamis', 'waktu' => '15:00', 'durasi' => '1.5 jam'],
            ['nama_ekstra' => 'Volly', 'penanggung_jawab' => 'Budi Santoso', 'hari' => 'Sabtu', 'waktu' => '08:00', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'Futsal', 'penanggung_jawab' => 'Ahmad Fauzi', 'hari' => 'Minggu', 'waktu' => '09:00', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'Kaligrafi', 'penanggung_jawab' => 'Dewi Lestari', 'hari' => 'Rabu', 'waktu' => '15:00', 'durasi' => '1 jam'],
            ['nama_ekstra' => 'Robotik', 'penanggung_jawab' => 'Siti Nurhaliza', 'hari' => 'Jumat', 'waktu' => '16:00', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'Bahasa Inggris', 'penanggung_jawab' => 'Rizky Ramadhan', 'hari' => 'Senin', 'waktu' => '16:00', 'durasi' => '1 jam'],
            ['nama_ekstra' => 'Seni Lukis', 'penanggung_jawab' => 'Budi Santoso', 'hari' => 'Kamis', 'waktu' => '15:30', 'durasi' => '1.5 jam'],
            ['nama_ekstra' => 'Paduan Suara', 'penanggung_jawab' => 'Ahmad Fauzi', 'hari' => 'Selasa', 'waktu' => '15:00', 'durasi' => '1 jam'],
            ['nama_ekstra' => 'Fotografi', 'penanggung_jawab' => 'Dewi Lestari', 'hari' => 'Sabtu', 'waktu' => '10:00', 'durasi' => '2 jam'],
            ['nama_ekstra' => 'KIR', 'penanggung_jawab' => 'Siti Nurhaliza', 'hari' => 'Rabu', 'waktu' => '15:00', 'durasi' => '1.5 jam'],
            ['nama_ekstra' => 'Catur', 'penanggung_jawab' => 'Rizky Ramadhan', 'hari' => 'Jumat', 'waktu' => '15:00', 'durasi' => '1 jam'],
        ];

        foreach ($data as $item) {
            DB::table('ekstrakurikuler')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
