<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class EventController extends Controller
{
    public function index()
    {
        return Event::with('host')->withCount('participants')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'max_participants' => 'required|integer|min:1',
        ]);

        $event = Event::create([
            ...$validated,
            'host_id' => Auth::id(),
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return $event->load('host', 'participants.user');
    }

    public function update(Request $request, Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'string',
            'date' => 'date',
            'location' => 'string',
            'max_participants' => 'integer|min:1',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
