<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\MembershipService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function apply(Request $request): RedirectResponse
    {
        app(MembershipService::class)->apply($request->user());

        return back()->with('success', __('membership.applied'));
    }
}
