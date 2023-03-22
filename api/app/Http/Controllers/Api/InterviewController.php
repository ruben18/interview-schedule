<?php

namespace App\Http\Controllers\Api;

use App\Availability;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\InterviewRequest;
use App\Interview;
use Exception;

class InterviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $newInterviews= array();
        if($user->role=='interviewer'){
            $interviews = Interview::all();
            foreach($interviews as &$interview){
                if( (
                        ($interview->availability->date == date('Y-m-d') &&
                        $interview->availability->start_time > date('H:i'))
                        ||
                        ($interview->availability->date>date('Y-m-d'))
                    ) &&
                    $interview->availability->user->id == $user->id){
                    $interview["candidate"]=$interview->user;
                    $interview["interviewer"]=$interview->availability->user;
                    $availability = $interview->availability;
                    $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));    
                    $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
                    $interview["availability"]=$interview->availability;
                    $newInterviews[]=$interview;
                }
            }
        }else{
            $interviews = $user->interviews;
            foreach($interviews as &$interview){
                $interview["candidate"]=$interview->user;
                $availability = $interview->availability;
                $availability["interviewer"] = $interview->user;
                $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));    
                $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
                $interview["availability"]=$interview->availability;
                $newInterviews[]=$interview;
            }        
        }
        return response($newInterviews, 200);
    }

    public function getDayInterviews(Request $request, $date=null){
        $user = $request->user();
        $newInterviews=array();
        if($user->role=='interviewer'){
            $interviews = Interview::all();
            foreach($interviews as &$interview){
                if($interview->availability->date == $date &&
                    $interview->availability->user->id == $user->id){
                    $availability = $interview->availability;
                    $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));    
                    $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
                    $interview["availability"]=$interview->availability;
                    $interview["candidate"]=$interview->user;
                    $interview["interviewer"]=$interview->availability->user;
                    $newInterviews[]=$interview;
                }
            }
        }else{
            $interviews = $user->interviews;
            foreach($interviews as &$interview){
                if($interview->availability["date"]==$date){
                    $availability = $interview->availability;
                    $availability["start_time"] = date('H:i', strtotime($availability["start_time"]));    
                    $availability["end_time"] = date('H:i',  strtotime($availability["end_time"]));
                    $interview["candidate"]=$interview->user;
                    $interview["interviewer"]=$interview->availability->user;
                    $newInterviews[]=$interview;
                }
            }
        }
        
        return response($newInterviews, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(InterviewRequest $request)
    {
        try{
            $availability = Availability::findOrFail($request->availability_id);

            if(strtotime($availability["date"])<=strtotime(date('Y-m-d')) &&
                strtotime($availability["start_time"])<strtotime(date('H:i'))
            ){
                $errors["Availability id"]=["message"=>"Select a availability in the future."];
                $response=["error"=>true, "message" => "The given data was invalid.", "errors"=>$errors];

                return response($response, 422);    
            }else{
                $availabilities = Availability::doesntHave('interview')->get();
                $find=0;
                foreach($availabilities as $avalability){
                    if($avalability->id==$request->get('availability_id')){
                        $find=1;
                    }
                }
                if(!$find){
                    $errors["Availability id"]=["message"=>"The selected availability id is invalid."];
                    $response=["error"=>true, "message" => "The given data was invalid.", "errors"=>$errors];
                    return response($response, 422); 
                }

                $interview=array();
                $interview["availability_id"] = $request->get('availability_id');
                $interview["user_id"] = $request->user()->id;
                $interview = Interview::create($interview);
                $interview["candidate"]=$interview->user;
                
                $availability = $interview->availability;
                $availability["interviewer"] = $availability->user;
                $interview["availability"]=$availability;

                $response=["error"=>false, "message" => "Interview successfuly scheduled.", "interview"=>$interview];

                return response($response, 200);
            }
        }catch(Exception $ex){
            $errors["Availability id"]=["message"=>"The selected availability id is invalid."];
            $response=["error"=>true, "message" => "The given data was invalid.", "errors"=>$errors];

            return response($response, 422); 
        }
    }


    public function edit($id)
    {
        try{
            $interview = Interview::findOrFail($id);

            $interview["candidate"] = $interview->user;
            $aval = $interview->availability;
            $aval["start_time"] = date('H:i', strtotime($aval["start_time"]));    
            $aval["end_time"] = date('H:i',  strtotime($aval["end_time"]));
            $aval["interviewer"] = $interview->availability->user;
            $interview["availability"] = $aval;

            return response($interview, 200); 

        }catch(Exception $ex){
            $errors["Availability id"]=["message"=>"The selected availability id is invalid."];
            $response=["error"=>true, "message" => "The given data was invalid.", "errors"=>$errors];
            return response($response, 422); 

        }
    }
}
