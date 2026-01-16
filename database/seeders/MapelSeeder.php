<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_mapel' => 'Matematika', 'inisial' => 'MTK'],
            ['nama_mapel' => 'Bahasa Indonesia', 'inisial' => 'BIND'],
            ['nama_mapel' => 'Bahasa Inggris', 'inisial' => 'BING'],
            ['nama_mapel' => 'Fisika', 'inisial' => 'FIS'],
            ['nama_mapel' => 'Kimia', 'inisial' => 'KIM'],
            ['nama_mapel' => 'Sejarah', 'inisial' => 'SEJ'],
        ];

        foreach ($data as $item) {
            DB::table('mapel')->insert([
                'nama_mapel' => $item['nama_mapel'],
                'inisial' => $item['inisial'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
