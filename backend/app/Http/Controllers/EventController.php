<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Log;

class EventController extends Controller
{
    protected $table = 'events';

    protected $modelClass = Event::class;

    protected function getTable()
    {
        return $this->table;
    }

    protected function getModelClass()
    {
        return $this->modelClass;
    }

    public function readAll(Request $request)
    {
        $events = Event::with('host')->get();
        return response()->json(['success' => true, 'events' => $events]);
    }

    public function createOne(Request $request)
    {
        try {
        
            $request->validate([
                'title' => 'required|string|max:255',
                'date' => 'required|date',
                'location' => 'required|string|max:255',
                'max_participants' => 'required|integer|min:1',
                'description' => 'nullable|string|min:1',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('event_images', 'public');
                $request->merge(['image' => $imagePath]);
            }

            $request->merge(['host_id' => Auth::id()]);

         
            $event = Event::create([
                'title' => $request->title,
                'date' => $request->date,
                'location' => $request->location,
                'max_participants' => $request->max_participants,
                'description' => $request->description,
                'image' => $request->image, 
                'host_id' => $request->host_id, 
            ]);

            
            return response()->json([
                'success' => true,
                'data' => $event,
            ], 201); 

        } catch (\Exception $e) {
            Log::error('Error in EventController.createOne: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]], 500);
        }
    }


    public function afterCreateOne($event, $request)
    {
        try {
            Log::info('Event created successfully with ID: ' . $event->id);
        } catch (\Exception $e) {
            Log::error('Error in EventController.afterCreateOne: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['success' => false, 'errors' => [__('common.unexpected_error')]], 500);
        }
    }

    /**
     * Display the specified event.
     */
    public function readOne($id, Request $request)
    {
        $event = Event::with(['host', 'participants'])->find($id);

        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found'], 404);
        }

        return response()->json([
            'success' => true,
            'event' => $event,
            'participant_count' => $event->participants->count()
        ]);
    }

    /**
     * Update an event.
     */
    public function updateOne($id, Request $request)
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $event->image = $request->file('image')->store('event_images', 'public');
        }

        $event->update($request->except('image'));

        return response()->json(['success' => true, 'event' => $event]);
    }

    /**
     * Remove an event.
     */
    public function deleteOne($id, Request $request)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found'], 404);
        }

     
        if ($event->host_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return response()->json(['success' => true, 'message' => 'Event deleted']);
    }

    public function eventCrud(Request $request, $action = null, $id = null)
    {
        switch ($action) {
            case 'create':
                return $this->createOne($request);

            case 'update':
                return $this->updateOne($id, $request);

            case 'delete':
                return $this->deleteOne($id, $request);

            case 'read':
            default:
               
                return $this->readAll($request);
        }
    }
}
