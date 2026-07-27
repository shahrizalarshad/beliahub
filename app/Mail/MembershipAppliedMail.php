<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MembershipAppliedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $applicant,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Permohonan Keahlian Baharu — '.$this->applicant->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.membership-applied',
            with: [
                'name' => $this->applicant->name,
                'email' => $this->applicant->email,
            ],
        );
    }
}
