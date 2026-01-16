<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_kelas' => 'X', 'inisial' => 'X'],
            ['nama_kelas' => 'XI', 'inisial' => 'XI'],
            ['nama_kelas' => 'XII', 'inisial' => 'XII'],
            ['nama_kelas' => 'X IPA 1', 'inisial' => 'XIPA1'],
            ['nama_kelas' => 'XI IPS 2', 'inisial' => 'XIIPS2'],
        ];

        foreach ($data as $item) {
            DB::table('kelas')->insert([
                'nama_kelas' => $item['nama_kelas'],
                'inisial' => $item['inisial'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
