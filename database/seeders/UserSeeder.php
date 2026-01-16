<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default super admin
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'is_active' => true,
            ]
        );

        // Note: Guru accounts are managed via ManajemenGuru
        // They login using username/password from guru table
        // User record is auto-created on first successful login
    }
}
