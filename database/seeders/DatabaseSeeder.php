<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@patikab.go.id',
            'password' => Hash::make('password123'), 
        ]);

        $settings = [
            ['key' => 'siteName', 'value' => 'Disdikbud Kabupaten Pati'],
            ['key' => 'welcomeText', 'value' => 'Sistem Informasi Peta Persebaran Sekolah Kabupaten Pati, Jawa Tengah.'],
            ['key' => 'email', 'value' => 'disdikbud@patikab.go.id'],
            ['key' => 'phone', 'value' => '(0295) 381456'],
            ['key' => 'address', 'value' => 'Jl. P. Sudirman No. 1, Pati Lor, Kec. Pati, Kabupaten Pati, Jawa Tengah 59111'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }

        $this->call([
            SchoolCsvSeeder::class
        ]);
    }
}