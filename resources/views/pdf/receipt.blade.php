<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #1f2937; }
        .header { border-bottom: 3px solid #059669; padding-bottom: 12px; margin-bottom: 24px; }
        .brand { font-size: 22px; font-weight: bold; color: #059669; }
        .title { font-size: 16px; font-weight: bold; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
        td.label { font-weight: bold; width: 40%; }
        .amount { margin-top: 24px; background: #ecfdf5; padding: 16px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; color: #059669; }
        .footer { margin-top: 32px; font-size: 10px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">Belia Hub</div>
        <div class="title">RESIT RASMI {{ $payment->receipt_no }}</div>
    </div>

    <table>
        <tr><td class="label">Diterima daripada</td><td>{{ $order->client->name }}</td></tr>
        <tr><td class="label">No. Tempahan</td><td>{{ $order->order_no }}</td></tr>
        <tr><td class="label">Perkhidmatan</td><td>{{ $order->service->name }}</td></tr>
        <tr><td class="label">Jenis Bayaran</td><td>{{ $payment->type->label() }}</td></tr>
        <tr><td class="label">Kaedah</td><td>{{ ucfirst($payment->method) }}</td></tr>
        @if ($payment->reference_no)
        <tr><td class="label">No. Rujukan</td><td>{{ $payment->reference_no }}</td></tr>
        @endif
        <tr><td class="label">Tarikh Bayaran</td><td>{{ $payment->paid_at->format('d/m/Y') }}</td></tr>
    </table>

    <div class="amount">
        RM{{ number_format((float) $payment->amount, 2) }}
    </div>

    <div class="footer">
        Resit ini dijana secara automatik oleh sistem Belia Hub dan sah tanpa tandatangan.
    </div>
</body>
</html>
