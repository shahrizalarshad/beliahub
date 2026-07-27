<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MembershipApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Keahlian Belia Hub Diluluskan — '.$this->user->membership_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.membership-approved',
            with: [
                'name' => $this->user->name,
                'membershipId' => $this->user->membership_id,
            ],
        );
    }
}
