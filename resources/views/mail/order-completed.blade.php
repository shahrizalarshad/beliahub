<x-mail::message>
# Tempahan Selesai

Salam {{ $name }},

Tempahan anda telah **selesai**:

- **No. Tempahan:** {{ $orderNo }}
- **Perkhidmatan:** {{ $serviceName }}

Fail penghantaran boleh dimuat turun dari halaman tempahan anda.

<x-mail::button :url="$orderUrl">
Lihat Tempahan
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
