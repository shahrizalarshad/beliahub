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
        th { background: #ecfdf5; text-align: left; padding: 8px; border-bottom: 2px solid #059669; }
        td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
        .totals td { border: none; padding: 4px 8px; }
        .totals .label { text-align: right; font-weight: bold; }
        .bank { margin-top: 24px; background: #f9fafb; padding: 12px; border-radius: 8px; }
        .footer { margin-top: 32px; font-size: 10px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">Belia Hub</div>
        <div class="title">INVOIS {{ $invoiceNo }}</div>
    </div>

    <table style="margin-top: 0;">
        <tr>
            <td style="border: none; padding: 0;">
                <strong>Kepada:</strong><br>
                {{ $order->client->name }}<br>
                {{ $order->client->email }}
            </td>
            <td style="border: none; padding: 0; text-align: right;">
                <strong>No. Tempahan:</strong> {{ $order->order_no }}<br>
                <strong>Tarikh:</strong> {{ $issuedAt->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>Perkhidmatan</th>
                <th style="text-align: right;">Harga Seunit</th>
                <th style="text-align: right;">Kuantiti</th>
                <th style="text-align: right;">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $order->service->name }}</td>
                <td style="text-align: right;">RM{{ number_format((float) $order->unit_price, 2) }}</td>
                <td style="text-align: right;">{{ $order->quantity }}</td>
                <td style="text-align: right;">RM{{ number_format((float) $order->total_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="label" style="width: 80%;">Jumlah Keseluruhan:</td>
            <td style="text-align: right;">RM{{ number_format((float) $order->total_amount, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Deposit (50%):</td>
            <td style="text-align: right;">RM{{ number_format((float) $order->deposit_amount, 2) }}</td>
        </tr>
    </table>

    @if (!empty($bank['name']))
    <div class="bank">
        <strong>Maklumat Pembayaran:</strong><br>
        Bank: {{ $bank['name'] }}<br>
        No. Akaun: {{ $bank['account_no'] }}<br>
        Nama Akaun: {{ $bank['account_name'] }}
    </div>
    @endif

    <div class="footer">
        Invois ini dijana secara automatik oleh sistem Belia Hub.
    </div>
</body>
</html>
