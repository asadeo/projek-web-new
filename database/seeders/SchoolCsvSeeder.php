<?php

namespace Database\Seeders;
use App\Models\School;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolCsvSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = fopen(base_path("database/seeders/MASTER_Sekolah_Pati_Updatedv2.csv"), "r");

        $firstline = true;

        $this->command->info('Memulai proses penyuntikan data sekolah...');

        while (($data = fgetcsv($csvFile, 2000, ",")) !== FALSE) {
            
            if (!$firstline) {
                School::updateOrCreate(
                    ['npsn' => $data[1]], 
                    [
                        'name'       => $data[0],
                        'level'      => $data[2],
                        'status'     => $data[3],
                        'accreditation' => $data[4],
                        'district'   => $data[5],
                        'address'    => $data[6],
                        'latitude'   => $data[7],
                        'longitude'  => $data[8],
                    ]
                );
            }
            $firstline = false;
        }

        fclose($csvFile);
    }
}
