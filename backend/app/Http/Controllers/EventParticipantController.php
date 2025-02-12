<?php

namespace App\Http\Controllers;
use App\Models\Event;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventParticipantController extends Controller
{
    public function joinEvent(Event $event)
    {
        if ($event->participants()->count() >= $event->max_participants) {
            return response()->json(['message' => 'Event is full'], 400);
        }

        if (EventParticipant::where('event_id', $event->id)->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Already joined'], 400);
        }

        EventParticipant::create([
            'event_id' => $event->id,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['message' => 'Joined successfully']);
    }

    public function leaveEvent(Event $event)
    {
        EventParticipant::where('event_id', $event->id)->where('user_id', Auth::id())->delete();

        return response()->json(['message' => 'Left the event']);
    }
}
