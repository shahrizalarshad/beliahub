// Ringkasan kewangan tempahan — satu sumber kebenaran untuk jumlah, deposit, dibayar, dan baki.
export default function MoneySummary({
    total,
    deposit,
    paid,
    balance,
    className = '',
}) {
    const rows = [
        { label: 'Jumlah Tempahan', value: total, emphasis: false },
        { label: 'Deposit (50%)', value: deposit, emphasis: false },
        { label: 'Telah Dibayar', value: paid, tone: 'emerald' },
        { label: 'Baki Tertunggak', value: balance, tone: 'amber', emphasis: true },
    ];

    return (
        <div
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
        >
            <h3 className="text-sm font-semibold text-slate-900">
                Ringkasan Kewangan
            </h3>
            <dl className="mt-3 divide-y divide-slate-100">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between py-2.5"
                    >
                        <dt className="text-sm text-slate-500">
                            {row.label}
                        </dt>
                        <dd
                            className={`text-sm font-semibold ${
                                row.emphasis
                                    ? 'text-base text-amber-700'
                                    : row.tone === 'emerald'
                                      ? 'text-emerald-700'
                                      : 'text-slate-900'
                            }`}
                        >
                            {row.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
