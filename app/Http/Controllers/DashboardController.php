<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();

        $stats = [
            'totalLists' => TaskList::where('user_id', $userId)
                ->count(),

            'totalTasks' => Task::whereHas('list', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->count(),

            'completedTasks' => Task::whereHas('list', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->where('is_completed', true)->count(),

            'pendingTasks' => Task::whereHas('list', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->where('is_completed', false)->count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
