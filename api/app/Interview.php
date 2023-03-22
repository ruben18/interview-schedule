<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    protected $fillable = [
        'availability_id', 'user_id'
    ];
    
    public function user()
    {
        return $this->hasOne(User::class, "id", "user_id");
    }

    public function availability()
    {
        return $this->hasOne(Availability::class, "id", "availability_id");
    }
}
