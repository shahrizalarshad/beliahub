<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\StoreOrderRequest;
use App\Models\OrderFile;
use App\Models\Service;
use App\Models\ServiceOrder;
use App\Services\OrderService;
use App\Services\UploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly UploadService $uploads,
    ) {}

    public function index(Request $request): Response
    {
        $orders = ServiceOrder::query()
            ->with('service')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get()
            ->map(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'service_name' => $order->service->name,
                'status' => $order->status->value,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function create(Request $request): Response
    {
        $serviceId = $request->query('service');

        return Inertia::render('Orders/Create', [
            'services' => Service::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn (Service $service) => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'price' => (float) $service->price,
                    'price_formatted' => 'RM'.number_format((float) $service->price, 2),
                    'description' => $service->description,
                    'order_instructions' => $service->order_instructions,
                ]),
            'selectedServiceId' => $serviceId ? (int) $serviceId : null,
        ]);
    }

    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $service = Service::findOrFail($request->integer('service_id'));
        $order = $this->orders->create(
            $request->user(),
            $service,
            $request->integer('quantity'),
            $request->string('requirements')->toString() ?: null,
        );

        return redirect()->route('orders.show', $order)->with('success', __('orders.created'));
    }

    public function show(Request $request, ServiceOrder $order): Response
    {
        abort_unless(
            $order->user_id === $request->user()->id
            || $order->provider_id === $request->user()->id
            || $request->user()->isSuperadmin(),
            403,
        );

        $order->load(['service', 'files', 'comments.author']);

        $files = $order->files
            ->groupBy(fn (OrderFile $file) => $file->category->value)
            ->map(fn ($group) => $group->map(fn (OrderFile $file) => [
                'id' => $file->id,
                'original_name' => $file->original_name,
                'download_url' => $this->uploads->temporaryUrl($file->path),
            ])->values());

        $bank = config('beliahub.bank');

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status->value,
                'service_name' => $order->service->name,
                'order_instructions' => $order->service->order_instructions,
                'quantity' => $order->quantity,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'deposit_formatted' => 'RM'.number_format((float) $order->deposit_amount, 2),
                'paid_formatted' => 'RM'.number_format($order->paidAmount(), 2),
                'balance_formatted' => 'RM'.number_format($order->balanceDue(), 2),
                'requirements' => $order->requirements,
            ],
            'comments' => $order->comments->map(fn ($comment) => [
                'id' => $comment->id,
                'author_name' => $comment->author->name,
                'body' => $comment->body,
                'created_at' => $comment->created_at->diffForHumans(),
            ]),
            'paymentInfo' => [
                'bank_name' => $bank['name'] ?: null,
                'account_no' => $bank['account_no'] ?: null,
                'account_name' => $bank['account_name'] ?: null,
            ],
            'files' => $files,
        ]);
    }

    public function cancel(Request $request, ServiceOrder $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->status !== OrderStatus::Pending) {
            return back()->with('error', __('orders.invalid_transition'));
        }

        $this->orders->transition($order, OrderStatus::Cancelled);

        return back()->with('success', __('orders.cancelled'));
    }
}
