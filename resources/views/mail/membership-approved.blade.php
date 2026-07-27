<x-mail::message>
# Tahniah, {{ $name }}!

Permohonan keahlian anda telah **diluluskan**. Anda kini ahli rasmi organisasi Belia Hub.

**ID Ahli anda:** `{{ $membershipId }}`

Sebagai ahli, anda boleh:
- Menyertai program & event organisasi (kehadiran QR)
- Menambah tag kemahiran pada profil
- Berpeluang menjadi petugas dan menerima upah

<x-mail::button :url="route('dashboard')">
Ke Papan Pemuka
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
