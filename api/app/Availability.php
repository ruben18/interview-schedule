<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = [
        'date', 'start_time', 'end_time', 'user_id'
    ];

    protected $hidden = [
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function interview()
    {
        return $this->hasOne(Interview::class);
    }
}
