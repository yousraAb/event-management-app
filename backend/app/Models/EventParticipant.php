<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    use HasFactory;

    protected $fillable = ['event_id', 'user_id'];

    public function event()
{
    return $this->belongsTo(\App\Models\Event::class, 'event_id');
}


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function participants()
{
    return $this->hasMany(\App\Models\EventParticipant::class, 'event_id');
}

}
