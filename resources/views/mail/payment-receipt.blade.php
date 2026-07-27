<x-mail::message>
# Resit Bayaran

Salam {{ $name }},

Bayaran anda telah direkodkan:

- **No. Resit:** {{ $receiptNo }}
- **No. Tempahan:** {{ $orderNo }}
- **Jenis:** {{ $type }}
- **Jumlah:** {{ $amount }}

Resit PDF dilampirkan bersama emel ini.

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
