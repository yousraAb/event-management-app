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
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

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

        event(new \App\Events\EventJoined($event));

        return response()->json(['success' => true, 'message' => 'Joined successfully']);
    }

    public function notifyHost($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $host = $event->host;

        if ($host) {
            event(new \App\Events\EventJoined($event));
            return response()->json(['success' => true]);
        }

        return response()->json(['message' => 'Host not found'], 400);
    }

    public function leaveEvent($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $deleted = EventParticipant::where('event_id', $event->id)
                                   ->where('user_id', Auth::id())
                                   ->delete();

        if ($deleted) {
            $event->refresh();

            if ($event->participants_count > 0) {
                $event->decrement('participants_count');
            }
        }

        return response()->json(['message' => 'Left the event']);
    }

    public function checkIfJoined($id)
    {
        $user = auth()->user();
        $isJoined = EventParticipant::where('event_id', $id)
                 ->where('user_id', $user->id)
                 ->exists();

        return response()->json(['isJoined' => $isJoined]);
    }
}
