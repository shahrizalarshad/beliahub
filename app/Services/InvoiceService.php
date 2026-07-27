<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\SequenceType;
use App\Support\StorageDisk;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\ServiceOrder;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class InvoiceService
{
    public function __construct(
        private readonly SequenceService $sequences,
    ) {}

    public function generateInvoice(ServiceOrder $order): Invoice
    {
        $order->loadMissing(['service', 'client']);

        $invoiceNo = $this->sequences->next(SequenceType::Invoice);
        $path = "invoices/{$order->id}/{$invoiceNo}.pdf";

        $pdf = Pdf::loadView('pdf.invoice', [
            'order' => $order,
            'invoiceNo' => $invoiceNo,
            'issuedAt' => now(),
            'bank' => config('beliahub.bank'),
        ]);

        Storage::disk(StorageDisk::uploads())->put($path, $pdf->output());

        return Invoice::create([
            'service_order_id' => $order->id,
            'invoice_no' => $invoiceNo,
            'pdf_path' => $path,
            'issued_at' => now(),
        ]);
    }

    public function generateReceipt(Payment $payment): Payment
    {
        $payment->loadMissing(['order.service', 'order.client']);

        $path = "receipts/{$payment->service_order_id}/{$payment->receipt_no}.pdf";

        $pdf = Pdf::loadView('pdf.receipt', [
            'payment' => $payment,
            'order' => $payment->order,
        ]);

        Storage::disk(StorageDisk::uploads())->put($path, $pdf->output());

        $payment->update(['receipt_path' => $path]);

        return $payment->fresh();
    }

    public function pdfContents(string $path): ?string
    {
        $disk = Storage::disk(StorageDisk::uploads());

        return $disk->exists($path) ? $disk->get($path) : null;
    }
}
