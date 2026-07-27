<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\ServiceOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly ServiceOrder $order,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tempahan Selesai — '.$this->order->order_no,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.order-completed',
            with: [
                'name' => $this->order->client->name,
                'orderNo' => $this->order->order_no,
                'serviceName' => $this->order->service->name,
                'orderUrl' => route('orders.show', $this->order),
            ],
        );
    }
}
