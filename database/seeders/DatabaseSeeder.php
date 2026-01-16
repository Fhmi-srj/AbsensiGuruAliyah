<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call all seeders in order (dependencies first)
        $this->call([
            KelasSeeder::class,
            MapelSeeder::class,
            GuruSeeder::class,
            SiswaSeeder::class,
            JadwalSeeder::class,
            KegiatanSeeder::class,
            EkstrakurikulerSeeder::class,
            RapatSeeder::class,
            UserSeeder::class, // Must be last or after GuruSeeder
        ]);
    }
}

