<?php
namespace Database\Seeders;
use App\Availability;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InterviewTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $candidates = User::select('id')->where('role', '=', 'candidate')->get()->toArray();
        $availabilities = Availability::all('id')->toArray();

        $newAvailabilities = array();
        foreach ($availabilities as $availability) {
            $newAvailabilities[] = $availability["id"];
        }

        $newCandidates = array();
        foreach ($candidates as $candidate) {
            $newCandidates[] = $candidate["id"];
        }
        $usedAvailabilities = array();

        for ($i = 0; $i <= 5; $i++) {
            $availabilityId = $newAvailabilities[array_rand($newAvailabilities)];
            while (in_array($availabilityId, $usedAvailabilities)) {
                $availabilityId = $newAvailabilities[array_rand($newAvailabilities)];
            }
            $usedAvailabilities[] = $availabilityId;

            DB::table('interviews')->insert([
                'availability_id' => $availabilityId,
                'user_id' => $newCandidates[array_rand($newCandidates)]
            ]);
        }
    }
}
