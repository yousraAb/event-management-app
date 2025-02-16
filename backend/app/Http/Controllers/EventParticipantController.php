<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventParticipantController extends Controller
{

    public function joinEvent($id)
    {
        // Manually fetch the event based on the passed 'id'
        $event = Event::find($id);

        // Check if the event exists
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        // Log for debugging
        \Log::info('Event ID: ' . $event->id);
        \Log::info('Participants Count: ' . $event->participants()->count());
        \Log::info('Max Participants: ' . $event->max_participants);

        // Check if the event is full
        if ($event->participants()->count() >= $event->max_participants) {
            return response()->json(['message' => 'Event is full'], 400);
        }

        // Check if the user is already a participant
        if (EventParticipant::where('event_id', $event->id)->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Already joined'], 400);
        }

        // Add the user as a participant
        EventParticipant::create([
            'event_id' => $event->id,
            'user_id' => Auth::id(),
        ]);

        // Optionally, you can notify the host
        event(new \App\Events\EventJoined($event));

        return response()->json(['success' => true, 'message' => 'Joined successfully']);
    }




    public function notifyHost($id)
    {
        // Manually fetch the event based on the passed 'id'
        $event = Event::find($id);

        // Check if the event exists
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        // Get the host of the event
        $host = $event->host;

        if ($host) {
            // You can broadcast a notification to the host (using Pusher).
            event(new \App\Events\EventJoined($event));  // Broadcast the event joined to the host
            return response()->json(['success' => true]);
        }

        return response()->json(['message' => 'Host not found'], 400);
    }

    public function leaveEvent($id)
    {
        // Manually fetch the event based on the passed 'id'
        $event = Event::find($id);
    
        // Check if the event exists
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
    
        // Remove the user from the event participants
        EventParticipant::where('event_id', $event->id)
                        ->where('user_id', Auth::id())
                        ->delete();
    
        // Decrement the participants count on the event
        $event->decrement('participants_count');
    
        return response()->json(['message' => 'Left the event']);
    }
    
}
