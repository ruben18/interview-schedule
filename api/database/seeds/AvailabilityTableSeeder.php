<?php
namespace Database\Seeders;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AvailabilityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $interviewers = User::select('id')->where('role', '=', 'interviewer')->get()->toArray();
        $b=1;
        $inicial=0;
        $final = 5;
        foreach ($interviewers as $interviewer) {
            if($b>1){
                $inicial += 5;
                $final = 5*$b;
            }
            for ($i = $inicial; $i < $final; $i++) {
                $start_hour = 9;
                if ($i == 0) {
                    $start_hour = (int)date('H') + 1;
                    $date = date('Y-m-d');
                } else {
                    $date = date('Y-m-d', strtotime("+" . ($i) . "days", strtotime(date('Y-m-d'))));
                }

                $available_hours = array();
                for ($a = 0; $a <= 3; $a++) {
                    $start_time = rand($start_hour, 17);
                    while (in_array($start_time, $available_hours)) {
                        $start_time = rand($start_hour, 17);
                    }
                    $available_hours[] = $start_time;

                    DB::table('availabilities')->insert([
                        'user_id' => $interviewer["id"],
                        'date' => $date,
                        'start_time' => $start_time . ":00",
                        'end_time' => ($start_time + 1) . ":00"
                    ]);
                }
            }
            $b++;
        }
    }
}
