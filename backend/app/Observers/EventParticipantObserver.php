<?php

namespace App\Observers;

use App\Models\EventParticipant;
use App\Models\Event;

class EventParticipantObserver
{
    /**
     * Handle the EventParticipant "created" event.
     */
    public function created(EventParticipant $eventParticipant)
    {
        // Increment the participants count on the event when a new participant is added
        $eventParticipant->event->increment('participants_count');
    }

    /**
     * Handle the EventParticipant "deleted" event.
     *
     * @param  \App\Models\EventParticipant  $eventParticipant
     * @return void
     */
    public function deleted(EventParticipant $eventParticipant)
    {
        // Decrement the participants count on the event when a participant is removed
        $eventParticipant->event->decrement('participants_count');
    }

    /**
     * Handle the EventParticipant "updated" event.
     */
    public function updated(EventParticipant $eventParticipant): void
    {
        //
    }

   

    /**
     * Handle the EventParticipant "restored" event.
     */
    public function restored(EventParticipant $eventParticipant): void
    {
        //
    }

    /**
     * Handle the EventParticipant "force deleted" event.
     */
    public function forceDeleted(EventParticipant $eventParticipant): void
    {
        //
    }
}
