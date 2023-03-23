<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name'=>'John Doe',
            'role'=>'interviewer',
            'email'=>'johndoe@mail.com',
            'password'=>Hash::make('interviewer')
        ]);

        DB::table('users')->insert([
            'name'=>'Jane Doe',
            'role'=>'candidate',
            'email'=>'janedoe@mail.com',
            'password'=>Hash::make('candidate')
        ]);

        DB::table('users')->insert([
            'name'=>'Poppie Dotson',
            'role'=>'candidate',
            'email'=>'poppiedotson@mail.com',
            'password'=>Hash::make('candidate')
        ]);

        DB::table('users')->insert([
            'name'=>'Sinead Mcghee',
            'role'=>'interviewer',
            'email'=>'sineadmcghee@mail.com',
            'password'=>Hash::make('interviewer')
        ]);
        DB::table('users')->insert([
            'name'=>'Farhana Bullock',
            'role'=>'candidate',
            'email'=>'farhanabullock@mail.com',
            'password'=>Hash::make('candidate')
        ]);
    }
}
