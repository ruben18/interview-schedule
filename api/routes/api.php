<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['middleware' => ['cors', 'json.response']], function () {
    Route::post('/login', 'Auth\ApiAuthController@login');    
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', 'Auth\ApiAuthController@logout');
    
    Route::get('availability/daily/{date?}', 'Api\AvailabilityController@getDayAvailabilities');
    Route::get('availability/free/{date_from?}/{date_end?}', 'Api\AvailabilityController@freeAvailabilities');
    Route::resource('availability', 'Api\AvailabilityController', ['except' => ['create', 'show']]);

    Route::get('interview/daily/{date?}', 'Api\InterviewController@getDayInterviews');
    Route::resource('interview', 'Api\InterviewController', ['except' => ['create', 'update','delete', 'show']]);
});

Route::fallback(function () {
    return Response::json(["error" => "Method not allowed."], 401);
});

