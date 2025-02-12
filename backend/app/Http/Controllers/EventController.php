<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('host')->get();
        return response()->json(['success' => true, 'events' => $events]);
    }

    /**
     * Store a newly created event.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
        ]);

        $event = Event::create([
            'title' => $request->title,
            'date' => $request->date,
            'location' => $request->location,
            'max_participants' => $request->max_participants,
            'host_id' => Auth::id(), // Assign current user as host
        ]);

        return response()->json(['success' => true, 'event' => $event], 201);
    }

    /**
     * Display the specified event.
     */
    public function show($id)
    {
        $event = Event::with(['host', 'participants'])->find($id);

        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found'], 404);
        }

        return response()->json(['success' => true, 'event' => $event]);
    }

    /**
     * Update an event.
     */
    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found'], 404);
        }

        // Only the event host can update the event
        if ($event->host_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|required|string|max:255',
            'max_participants' => 'sometimes|required|integer|min:1',
        ]);

        $event->update($request->all());

        return response()->json(['success' => true, 'event' => $event]);
    }

    /**
     * Remove an event.
     */
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found'], 404);
        }

        // Only the host can delete the event
        if ($event->host_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['success' => true, 'message' => 'Event deleted']);
    }
}
