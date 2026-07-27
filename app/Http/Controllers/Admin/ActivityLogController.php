<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $activities = Activity::query()
            ->with('causer')
            ->when($request->query('search'), function ($q, $search) {
                $q->where('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'description' => $this->translateDescription($activity->description),
                'causer_name' => $activity->causer?->name ?? 'Sistem',
                'subject_type' => $activity->subject_type
                    ? class_basename($activity->subject_type).' #'.$activity->subject_id
                    : null,
                'properties' => $activity->properties->isNotEmpty()
                    ? $activity->properties->toArray()
                    : null,
                'created_at' => $activity->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/ActivityLog/Index', [
            'activities' => $activities->items(),
            'pagination' => [
                'links' => $activities->linkCollection(),
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    private function translateDescription(string $description): string
    {
        // Deskripsi auto daripada spatie/laravel-activitylog dalam BI;
        // log manual sudah pun ditulis dalam BM.
        return match ($description) {
            'created' => 'Rekod dicipta',
            'updated' => 'Rekod dikemas kini',
            'deleted' => 'Rekod dipadam',
            default => $description,
        };
    }
}
