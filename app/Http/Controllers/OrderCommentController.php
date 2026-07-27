<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderCommentRequest;
use App\Models\OrderComment;
use App\Models\ServiceOrder;
use Illuminate\Http\RedirectResponse;

class OrderCommentController extends Controller
{
    public function store(StoreOrderCommentRequest $request, ServiceOrder $order): RedirectResponse
    {
        abort_unless(
            $order->user_id === $request->user()->id
            || $request->user()->isSuperadmin()
            || $order->provider_id === $request->user()->id,
            403,
        );

        OrderComment::create([
            'service_order_id' => $order->id,
            'user_id' => $request->user()->id,
            'body' => $request->string('body')->toString(),
        ]);

        return back()->with('success', __('orders.comment_added'));
    }
}
