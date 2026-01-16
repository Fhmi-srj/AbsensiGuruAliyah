<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get kelas IDs
        $kelasX = DB::table('kelas')->where('nama_kelas', 'X')->first()->id;
        $kelasXI = DB::table('kelas')->where('nama_kelas', 'XI')->first()->id;
        $kelasXII = DB::table('kelas')->where('nama_kelas', 'XII')->first()->id;

        $data = [
            [
                'nama' => 'Ahmad Fauzi',
                'status' => 'Aktif',
                'nis' => '12345',
                'nisn' => '9876543210',
                'kelas_id' => $kelasX,
                'jenis_kelamin' => 'L',
                'alamat' => 'Jl. Merpati No. 12',
                'tanggal_lahir' => '2005-01-01',
                'tempat_lahir' => 'Jakarta',
                'asal_sekolah' => 'SMPN 1 Jakarta',
                'kontak_ortu' => '081234567890',
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'status' => 'Tidak Aktif',
                'nis' => '12346',
                'nisn' => '9876543211',
                'kelas_id' => $kelasXI,
                'jenis_kelamin' => 'P',
                'alamat' => 'Jl. Melati No. 5',
                'tanggal_lahir' => '2004-05-15',
                'tempat_lahir' => 'Bandung',
                'asal_sekolah' => 'SMPN 2 Bandung',
                'kontak_ortu' => '082345678901',
            ],
            [
                'nama' => 'Budi Santoso',
                'status' => 'Aktif',
                'nis' => '12347',
                'nisn' => '9876543212',
                'kelas_id' => $kelasXII,
                'jenis_kelamin' => 'L',
                'alamat' => 'Jl. Kenanga No. 8',
                'tanggal_lahir' => '2003-08-20',
                'tempat_lahir' => 'Surabaya',
                'asal_sekolah' => 'SMPN 3 Surabaya',
                'kontak_ortu' => '083456789012',
            ],
            [
                'nama' => 'Dewi Lestari',
                'status' => 'Aktif',
                'nis' => '12348',
                'nisn' => '9876543213',
                'kelas_id' => $kelasXI,
                'jenis_kelamin' => 'P',
                'alamat' => 'Jl. Anggrek No. 3',
                'tanggal_lahir' => '2004-10-10',
                'tempat_lahir' => 'Yogyakarta',
                'asal_sekolah' => 'SMPN 4 Yogyakarta',
                'kontak_ortu' => '084567890123',
            ],
            [
                'nama' => 'Rizky Ramadhan',
                'status' => 'Tidak Aktif',
                'nis' => '12349',
                'nisn' => '9876543214',
                'kelas_id' => $kelasX,
                'jenis_kelamin' => 'L',
                'alamat' => 'Jl. Dahlia No. 7',
                'tanggal_lahir' => '2005-03-05',
                'tempat_lahir' => 'Medan',
                'asal_sekolah' => 'SMPN 5 Medan',
                'kontak_ortu' => '085678901234',
            ],
        ];

        foreach ($data as $item) {
            DB::table('siswa')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
