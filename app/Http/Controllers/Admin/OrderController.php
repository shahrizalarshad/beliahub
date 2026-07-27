<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\SequenceType;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmedMail;
use App\Mail\PaymentReceiptMail;
use App\Models\Payment;
use App\Models\Payout;
use App\Models\ServiceOrder;
use App\Models\Skill;
use App\Models\User;
use App\Services\InvoiceService;
use App\Services\OrderService;
use App\Services\SequenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly SequenceService $sequences,
    ) {}

    public function index(Request $request): Response
    {
        $orders = ServiceOrder::query()
            ->with(['service', 'client', 'provider'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('order_no', 'like', "%{$search}%")
                        ->orWhereHas('client', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('service', fn ($q) => $q->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (ServiceOrder $order) => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'client_name' => $order->client->name,
                'service_name' => $order->service->name,
                'status' => $order->status->value,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'is_stale' => $order->isStale(),
                'created_at' => $order->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'statuses' => collect(OrderStatus::cases())
                ->map(fn (OrderStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }

    public function show(ServiceOrder $order): Response
    {
        $order->load(['service', 'client', 'provider', 'payments']);

        $providers = User::query()
            ->with('skills:id,name')
            ->whereIn('role', [UserRole::Provider, UserRole::Member])
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'membership_id'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'membership_id' => $user->membership_id,
                'skill_ids' => $user->skills->pluck('id'),
                'skill_names' => $user->skills->pluck('name')->implode(', '),
            ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status->value,
                'client_name' => $order->client->name,
                'client_email' => $order->client->email,
                'service_name' => $order->service->name,
                'order_instructions' => $order->service->order_instructions,
                'provider_id' => $order->provider_id,
                'provider_name' => $order->provider?->name,
                'quantity' => $order->quantity,
                'total_formatted' => 'RM'.number_format((float) $order->total_amount, 2),
                'deposit_formatted' => 'RM'.number_format((float) $order->deposit_amount, 2),
                'paid_formatted' => 'RM'.number_format($order->paidAmount(), 2),
                'balance_formatted' => 'RM'.number_format($order->balanceDue(), 2),
                'requirements' => $order->requirements,
            ],
            'payments' => $order->payments->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'type_label' => $payment->type->label(),
                'amount_formatted' => 'RM'.number_format((float) $payment->amount, 2),
                'paid_at' => $payment->paid_at->format('d/m/Y'),
            ]),
            'providers' => $providers,
            'skills' => Skill::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function assign(Request $request, ServiceOrder $order): RedirectResponse
    {
        $request->validate(['provider_id' => ['required', 'exists:users,id']]);
        $provider = User::findOrFail($request->integer('provider_id'));

        $this->orders->assignProvider($order, $provider);

        return back()->with('success', __('orders.provider_assigned'));
    }

    public function confirm(Request $request, ServiceOrder $order): RedirectResponse
    {
        if (! $order->provider_id) {
            return back()->with('error', __('orders.confirm_requires_provider'));
        }

        $order = $this->orders->transition($order, OrderStatus::InProgress, $order->provider);

        $invoice = app(InvoiceService::class)->generateInvoice($order);

        $this->sendSafely(fn () => Mail::to($order->client->email)
            ->send(new OrderConfirmedMail($order, $invoice)));

        activity()->performedOn($order)->causedBy($request->user())
            ->log('Tempahan disahkan & petugas ditugaskan');

        return back()->with('success', __('orders.confirmed'));
    }

    public function cancel(Request $request, ServiceOrder $order): RedirectResponse
    {
        $this->orders->transition($order, OrderStatus::Cancelled);

        activity()->performedOn($order)->causedBy($request->user())->log('Tempahan dibatalkan');

        return back()->with('success', __('orders.cancelled'));
    }

    public function recordPayment(Request $request, ServiceOrder $order): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:deposit,balance,refund'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'string', 'max:50'],
            'reference_no' => ['nullable', 'string', 'max:100'],
            'paid_at' => ['required', 'date'],
        ]);

        $isReceiptable = in_array($data['type'], ['deposit', 'balance'], true);

        $payment = Payment::create([
            ...$data,
            'service_order_id' => $order->id,
            'recorded_by' => $request->user()->id,
            'receipt_no' => $isReceiptable ? $this->sequences->next(SequenceType::Receipt) : null,
        ]);

        if ($isReceiptable) {
            $payment = app(InvoiceService::class)->generateReceipt($payment);

            $this->sendSafely(fn () => Mail::to($order->client->email)
                ->send(new PaymentReceiptMail($payment)));
        }

        activity()->performedOn($order)->causedBy($request->user())
            ->withProperties(['type' => $data['type'], 'amount' => $data['amount']])
            ->log('Bayaran direkodkan');

        return back()->with('success', __('orders.payment_recorded'));
    }

    public function recordPayout(Request $request, ServiceOrder $order): RedirectResponse
    {
        if ($order->status !== OrderStatus::Completed) {
            return back()->with('error', __('orders.payout_requires_completed'));
        }

        if (! $order->provider_id) {
            return back()->with('error', __('orders.payout_requires_provider'));
        }

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'string', 'max:50'],
            'reference_no' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'paid_at' => ['required', 'date'],
        ]);

        Payout::create([
            ...$data,
            'service_order_id' => $order->id,
            'provider_id' => $order->provider_id,
            'recorded_by' => $request->user()->id,
        ]);

        activity()->performedOn($order)->causedBy($request->user())
            ->withProperties(['amount' => $data['amount']])
            ->log('Bayaran keluar (payout) direkodkan');

        return back()->with('success', __('orders.payout_recorded'));
    }

    private function sendSafely(callable $send): void
    {
        try {
            $send();
        } catch (\Throwable $e) {
            Log::warning('Mail delivery failed: '.$e->getMessage());
        }
    }
}
