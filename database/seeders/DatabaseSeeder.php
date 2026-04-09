<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
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

        School::create([
            'npsn' => '20310001',
            'name' => 'SD Negeri 1 Pati',
            'level' => 'SD',
            'status' => 'Negeri',
            'address' => 'Jl. Pemuda No. 10, Pati',
            'district' => 'Pati',
            'latitude' => -6.748717,
            'longitude' => 111.037812,
            'student_2023' => 150,
            'student_2024' => 160,
            'student_2025' => 175,
            'teachers_count' => 12, 
            'accreditation' => 'A'
        ]);

        School::create([
            'npsn' => '20310002',
            'name' => 'SMP Negeri 1 Margorejo',
            'level' => 'SMP',
            'status' => 'Negeri',
            'address' => 'Jl. Raya Pati-Kudus Km. 5',
            'district' => 'Margorejo',
            'latitude' => -6.765432,
            'longitude' => 110.987654,
            'student_2023' => 300,
            'student_2024' => 310,
            'student_2025' => 320,
            'teachers_count' => 25,
            'accreditation' => 'A'
        ]);
    }
}