<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'date', 'location', 'max_participants', 'participants_count', 'host_id', 'description', 'image'];


    protected $casts = [
        'date' => 'datetime',
    ];

    public function host()
    {
        return $this->belongsTo(\App\Models\User::class, 'host_id');
    }

    /**
     * Get the participants of the event.
     */
    public function participants()
    {
        return $this->hasMany(\App\Models\EventParticipant::class, 'event_id');
    }
}
