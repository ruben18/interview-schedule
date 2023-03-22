<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class AvailabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'date'=>'required|date|after_or_equal:'.date('Y-m-d'),
            'start_time'=>'required|date_format:H:00',
            'end_time'=>'required|date_format:H:00|after:start_time'
        ];
    }
}
