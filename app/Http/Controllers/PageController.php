<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('Pages/Terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('Pages/Privacy');
    }
}
