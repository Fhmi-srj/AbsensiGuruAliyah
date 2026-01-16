<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JadwalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get IDs
        $guruBudi = DB::table('guru')->where('nama', 'Budi Santoso')->first()->id;
        $guruSiti = DB::table('guru')->where('nama', 'Siti Nurhaliza')->first()->id;
        $guruDewi = DB::table('guru')->where('nama', 'Dewi Lestari')->first()->id;
        $guruRizky = DB::table('guru')->where('nama', 'Rizky Ramadhan')->first()->id;
        $guruAhmad = DB::table('guru')->where('nama', 'Ahmad Fauzi')->first()->id;

        $mapelMtk = DB::table('mapel')->where('nama_mapel', 'Matematika')->first()->id;
        $mapelBind = DB::table('mapel')->where('nama_mapel', 'Bahasa Indonesia')->first()->id;
        $mapelFis = DB::table('mapel')->where('nama_mapel', 'Fisika')->first()->id;
        $mapelKim = DB::table('mapel')->where('nama_mapel', 'Kimia')->first()->id;
        $mapelSej = DB::table('mapel')->where('nama_mapel', 'Sejarah')->first()->id;

        $kelasXIPA1 = DB::table('kelas')->where('nama_kelas', 'X IPA 1')->first()->id;
        $kelasXIIPS2 = DB::table('kelas')->where('nama_kelas', 'XI IPS 2')->first()->id;
        $kelasXII = DB::table('kelas')->where('nama_kelas', 'XII')->first()->id;
        $kelasXI = DB::table('kelas')->where('nama_kelas', 'XI')->first()->id;
        $kelasX = DB::table('kelas')->where('nama_kelas', 'X')->first()->id;

        $data = [
            ['jam_ke' => '1', 'guru_id' => $guruBudi, 'mapel_id' => $mapelMtk, 'kelas_id' => $kelasXIPA1, 'hari' => 'Senin'],
            ['jam_ke' => '2', 'guru_id' => $guruSiti, 'mapel_id' => $mapelBind, 'kelas_id' => $kelasXIIPS2, 'hari' => 'Selasa'],
            ['jam_ke' => '3', 'guru_id' => $guruAhmad, 'mapel_id' => $mapelFis, 'kelas_id' => $kelasXII, 'hari' => 'Rabu'],
            ['jam_ke' => '4', 'guru_id' => $guruDewi, 'mapel_id' => $mapelKim, 'kelas_id' => $kelasXI, 'hari' => 'Kamis'],
            ['jam_ke' => '5', 'guru_id' => $guruRizky, 'mapel_id' => $mapelSej, 'kelas_id' => $kelasX, 'hari' => 'Jumat'],
        ];

        foreach ($data as $item) {
            DB::table('jadwal')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
