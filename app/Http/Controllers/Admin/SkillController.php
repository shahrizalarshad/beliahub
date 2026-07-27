<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        $skills = Skill::query()
            ->withCount('users')
            ->orderBy('name')
            ->get()
            ->map(fn (Skill $skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
                'users_count' => $skill->users_count,
            ]);

        return Inertia::render('Admin/Skills/Index', ['skills' => $skills]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:skills,name'],
        ]);

        Skill::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        return back()->with('success', __('admin.skill_created'));
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->users()->detach();
        $skill->delete();

        return back()->with('success', __('admin.skill_deleted'));
    }
}
