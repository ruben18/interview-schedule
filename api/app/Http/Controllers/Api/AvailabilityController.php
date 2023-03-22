<?php

namespace App\Http\Controllers\Api;

use App\Availability;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AvailabilityRequest;
use Exception;

class AvailabilityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $availabilities = Availability::doesntHave('interview')->where('user_id', '=', $user->id)->orderBy('date', 'desc')->get();
        foreach($availabilities as &$availability){
            $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
            $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
        }
        return response($availabilities, 200);
    }

    public function getDayAvailabilities(Request $request, $date=null){
        $user = $request->user();
        if($user->role=='interviewer'){
            $availabilities = Availability::doesntHave('interview')->where('user_id', '=', $user->id)->where('date', '=', $date)->orderBy('date', 'desc')->get();
            foreach($availabilities as &$availability){
                $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
                $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
            }
        }else{
            $availabilities = Availability::doesntHave('interview')->where('date', '=', $date)->orderBy('date', 'desc')->get();
            foreach($availabilities as &$availability){
                $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
                $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
            }
        }
        return response($availabilities, 200);
    }

    /**
     * Display a listing of a free availabilities .
     *
     * @return \Illuminate\Http\Response
     */
    public function freeAvailabilities($date_from=null, $date_end =null)
    {
        if(isset($date_from) && isset($date_end)){
            $availabilities = Availability::doesntHave('interview')->whereBetween('date', [$date_from, $date_end])
                                            ->orderBy('date', 'desc')->get();
            foreach($availabilities as &$availability){
                $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
                $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
            }
        }else{
            $availabilities = Availability::doesntHave('interview')
            ->where([
                ['date', '=', date('Y-m-d')],
                ['start_time', '>=', date('H:i:s')]
            ])
            ->orWhere('date', '>', date('Y-m-d'))
            ->doesntHave('interview')
            ->orderBy('date', 'desc')->get();
            foreach($availabilities as &$availability){
                $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
                $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
            }
        }
        
        return response($availabilities, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AvailabilityRequest $request)
    {
        $availability = $request->all();
        if(strtotime($availability["date"])==strtotime(date('Y-m-d')) &&
           strtotime($availability["start_time"])<strtotime(date('H:i'))){
            $fields["start time"][]="Start time must be a time before ".date('H:i');
            $response = ['message' => 'The given data was invalid.', 'errors'=>$fields];
            return response($response, 422);
        }

        if(strtotime($availability["end_time"])<>strtotime('+1 hour', strtotime($availability["start_time"]))){
            $fields["end time"][]="It's only possible to create availabilities with 1 hour interval.";
            $response = ['message' => 'The given data was invalid.', 'errors'=>$fields];
            return response($response, 422);
        }

        $availability["user_id"]=$request->user()->id;
        Availability::create($availability);
        $response = ['message' => 'Availability successfuly created.'];
        return response($response, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try{
            $availability=Availability::findOrFail($id);
            $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));
            $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
            return response($availability, 200);
        }catch(Exception $ex)
        {
            $response = ["error"=>true, "message" => "Availability not founded"];
            return response($response, 422);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(AvailabilityRequest $request, $id)
    {
        try{
            if(strtotime($request->get("start_time"))<strtotime(date('H:i'))){
                $fields["start time"][]="Start time must be a time before ".date('H:i');
                $response = ['message' => 'The given data was invalid.', 'errors'=>$fields];
                return response($response, 422);
            }
            
            if(strtotime($request->get("end_time"))<>strtotime('+1 hour', strtotime($request->get("start_time")))){
                $fields["end time"][]="It's only possible to create availabilities with 1 hour interval.";
                $response = ['message' => 'The given data was invalid.', 'errors'=>$fields];
                return response($response, 422);
            }

            $availability=Availability::findOrFail($id);
            $availability->date = $request->get('date');
            $availability->start_time = $request->get('start_time');
            $availability->end_time = $request->get('end_time');

            $availability->save();

            return response(["message"=>"Availability succesfully updated.", "availability"=>$availability], 200);

        }catch(Exception $ex)
        {
            $response = ["error"=>true, "message" => "Availability not founded"];
            return response($response, 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $availability=Availability::findOrFail($id);

            $availability->delete();

            return response(["message"=>"Availability succesfully deleted."], 200);

        }catch(Exception $ex)
        {
            $response = ["error"=>true, "message" => "Availability not founded"];
            return response($response, 422);
        }
    }
}
