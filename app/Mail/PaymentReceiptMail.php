<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Payment;
use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentReceiptMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Payment $payment,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Resit Bayaran — '.$this->payment->receipt_no,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.payment-receipt',
            with: [
                'name' => $this->payment->order->client->name,
                'receiptNo' => $this->payment->receipt_no,
                'orderNo' => $this->payment->order->order_no,
                'amount' => 'RM'.number_format((float) $this->payment->amount, 2),
                'type' => $this->payment->type->label(),
            ],
        );
    }

    public function attachments(): array
    {
        if (! $this->payment->receipt_path) {
            return [];
        }

        $contents = app(InvoiceService::class)->pdfContents($this->payment->receipt_path);

        if ($contents === null) {
            return [];
        }

        return [
            Attachment::fromData(fn () => $contents, $this->payment->receipt_no.'.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
