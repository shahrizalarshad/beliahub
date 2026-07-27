<x-mail::message>
# Permohonan Keahlian

Salam {{ $name }},

Dukacita dimaklumkan permohonan keahlian anda **tidak diluluskan** buat masa ini.

@if ($reason)
**Sebab:** {{ $reason }}
@endif

Anda masih boleh menempah perkhidmatan seperti biasa dan memohon semula pada masa hadapan.

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
