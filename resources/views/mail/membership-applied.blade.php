<x-mail::message>
# Permohonan Keahlian Baharu

Terdapat permohonan keahlian baharu yang menunggu kelulusan:

- **Nama:** {{ $name }}
- **Emel:** {{ $email }}

<x-mail::button :url="route('admin.users.index')">
Semak Permohonan
</x-mail::button>

{{ config('app.name') }}
</x-mail::message>
