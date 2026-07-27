<x-mail::message>
# Tempahan Disahkan

Salam {{ $name }},

Tempahan anda telah **disahkan** dan kini dalam proses:

- **No. Tempahan:** {{ $orderNo }}
- **Perkhidmatan:** {{ $serviceName }}
- **No. Invois:** {{ $invoiceNo }}

Invois PDF dilampirkan bersama emel ini.

<x-mail::button :url="route('orders.index')">
Jejak Tempahan
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
