<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Invoice;
use App\Models\ServiceOrder;
use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly ServiceOrder $order,
        public readonly Invoice $invoice,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tempahan Disahkan — '.$this->order->order_no,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.order-confirmed',
            with: [
                'name' => $this->order->client->name,
                'orderNo' => $this->order->order_no,
                'serviceName' => $this->order->service->name,
                'invoiceNo' => $this->invoice->invoice_no,
            ],
        );
    }

    public function attachments(): array
    {
        $contents = app(InvoiceService::class)->pdfContents($this->invoice->pdf_path);

        if ($contents === null) {
            return [];
        }

        return [
            Attachment::fromData(fn () => $contents, $this->invoice->invoice_no.'.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
