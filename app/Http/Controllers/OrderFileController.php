<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\FileCategory;
use App\Http\Requests\StoreOrderFileRequest;
use App\Models\ServiceOrder;
use App\Services\UploadService;
use Illuminate\Http\RedirectResponse;

class OrderFileController extends Controller
{
    public function __construct(private readonly UploadService $uploads) {}

    public function store(StoreOrderFileRequest $request, ServiceOrder $order): RedirectResponse
    {
        $this->uploads->storeOrderFile(
            $order,
            $request->user(),
            $request->file('file'),
            FileCategory::from($request->string('category')->toString()),
        );

        return back()->with('success', __('orders.file_uploaded'));
    }
}
