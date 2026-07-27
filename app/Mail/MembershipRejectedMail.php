<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MembershipRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly ?string $reason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Permohonan Keahlian Belia Hub',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.membership-rejected',
            with: [
                'name' => $this->user->name,
                'reason' => $this->reason,
            ],
        );
    }
}
