<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GuruSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'username' => 'guru1',
                'password' => Hash::make('pass123'),
                'nama' => 'Ahmad Fauzi',
                'nip' => '1987654321',
                'sk' => 'SK12345',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '1980-01-01',
                'alamat' => 'Jl. Merpati No. 12',
                'pendidikan' => 'S1 Pendidikan Matematika',
                'kontak' => '081234567890',
                'tmt' => '2010-08-01',
                'jabatan' => 'Guru Matematika',
                'status' => 'Aktif',
            ],
            [
                'username' => 'guru2',
                'password' => Hash::make('pass234'),
                'nama' => 'Siti Nurhaliza',
                'nip' => '1987654322',
                'sk' => 'SK12346',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '1982-05-15',
                'alamat' => 'Jl. Melati No. 5',
                'pendidikan' => 'S1 Pendidikan Bahasa Indonesia',
                'kontak' => '082345678901',
                'tmt' => '2012-09-01',
                'jabatan' => 'Guru Bahasa Indonesia',
                'status' => 'Tidak Aktif',
            ],
            [
                'username' => 'guru3',
                'password' => Hash::make('pass345'),
                'nama' => 'Budi Santoso',
                'nip' => '1987654323',
                'sk' => 'SK12347',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => '1978-08-20',
                'alamat' => 'Jl. Kenanga No. 8',
                'pendidikan' => 'S2 Pendidikan Fisika',
                'kontak' => '083456789012',
                'tmt' => '2008-07-01',
                'jabatan' => 'Guru Fisika',
                'status' => 'Aktif',
            ],
            [
                'username' => 'guru4',
                'password' => Hash::make('pass456'),
                'nama' => 'Dewi Lestari',
                'nip' => '1987654324',
                'sk' => 'SK12348',
                'jenis_kelamin' => 'P',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => '1985-10-10',
                'alamat' => 'Jl. Anggrek No. 3',
                'pendidikan' => 'S1 Pendidikan Kimia',
                'kontak' => '084567890123',
                'tmt' => '2015-01-01',
                'jabatan' => 'Guru Kimia',
                'status' => 'Aktif',
            ],
            [
                'username' => 'guru5',
                'password' => Hash::make('pass567'),
                'nama' => 'Rizky Ramadhan',
                'nip' => '1987654325',
                'sk' => 'SK12349',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '1979-03-05',
                'alamat' => 'Jl. Dahlia No. 7',
                'pendidikan' => 'S1 Pendidikan Sejarah',
                'kontak' => '085678901234',
                'tmt' => '2011-06-01',
                'jabatan' => 'Guru Sejarah',
                'status' => 'Tidak Aktif',
            ],
        ];

        foreach ($data as $item) {
            DB::table('guru')->insert(array_merge($item, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
