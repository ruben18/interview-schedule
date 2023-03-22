<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Contracts\Pipeline\Hub;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ApiAuthController extends Controller
{
    public function login (Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|',
        ]);
        if ($validator->fails())
        {
            return response(['error'=>true, 'errors'=>$validator->errors()->all()], 422);
        }
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Calendar UI API Passport Token')->accessToken;
                $response = ['error'=> false, 'token' => $token, 'user'=>$user];
                return response($response, 200);
            } else {
                $response = ['error'=> true, "message" => "Incorrect Password"];
                return response($response, 422);
            }
        } else {
            $response = ['error'=> true, "message" =>'User does not exist'];
            return response($response, 422);
        }
    }

    public function logout (Request $request) {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['error'=> false, 'message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }
}
