import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
);

function KpiCard({ label, value, sublabel, accent = 'emerald' }) {
    const accents = {
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        blue: 'border-blue-200 bg-blue-50 text-blue-800',
        amber: 'border-amber-200 bg-amber-50 text-amber-800',
        slate: 'border-slate-200 bg-white text-slate-800',
    };

    return (
        <div className={`rounded-2xl border p-6 shadow-sm ${accents[accent]}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            {sublabel && (
                <p className="mt-1 text-xs opacity-70">{sublabel}</p>
            )}
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">
                {title}
            </h3>
            {children}
        </div>
    );
}

export default function Dashboard({ stats = {}, charts = null }) {
    const cards = [
        {
            label: 'Ahli Aktif',
            value: stats.active_members ?? 0,
            accent: 'emerald',
        },
        {
            label: 'Pelanggan Berdaftar',
            value: stats.clients ?? 0,
            sublabel: stats.pending_applications
                ? `${stats.pending_applications} permohonan keahlian menunggu`
                : null,
            accent: 'blue',
        },
        {
            label: 'Kutipan Kasar',
            value: stats.gross_collection_formatted ?? 'RM 0.00',
            accent: 'emerald',
        },
        {
            label: 'Jumlah Bayaran Keluar',
            value: stats.total_payouts_formatted ?? 'RM 0.00',
            accent: 'amber',
        },
        {
            label: 'Hasil Bersih',
            value: stats.net_revenue_formatted ?? 'RM 0.00',
            accent: 'emerald',
        },
        {
            label: 'Baki Tertunggak',
            value: stats.outstanding_balance_formatted ?? 'RM 0.00',
            accent: 'amber',
        },
        {
            label: 'Tempahan Aktif',
            value: stats.active_orders ?? 0,
            sublabel: 'Menunggu + dalam proses',
            accent: 'slate',
        },
    ];

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-slate-900">
                    Papan Pemuka Pentadbir
                </h2>
            }
        >
            <Head title="Pentadbir — Papan Pemuka" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cards.map((card) => (
                            <KpiCard key={card.label} {...card} />
                        ))}
                    </div>

                    {charts && (
                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <ChartCard title="Trend Pendaftaran Bulanan (12 bulan)">
                                <Line
                                    data={{
                                        labels: charts.labels,
                                        datasets: [
                                            {
                                                label: 'Pendaftaran',
                                                data: charts.registrations,
                                                borderColor: '#059669',
                                                backgroundColor:
                                                    'rgba(5, 150, 105, 0.1)',
                                                fill: true,
                                                tension: 0.3,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { precision: 0 },
                                            },
                                        },
                                    }}
                                />
                            </ChartCard>

                            <ChartCard title="Kutipan vs Payout Bulanan (RM)">
                                <Bar
                                    data={{
                                        labels: charts.labels,
                                        datasets: [
                                            {
                                                label: 'Kutipan',
                                                data: charts.collections,
                                                backgroundColor: '#059669',
                                            },
                                            {
                                                label: 'Payout',
                                                data: charts.payouts,
                                                backgroundColor: '#f59e0b',
                                            },
                                        ],
                                    }}
                                    options={{
                                        scales: { y: { beginAtZero: true } },
                                    }}
                                />
                            </ChartCard>

                            <ChartCard title="Tempahan Mengikut Perkhidmatan">
                                {charts.orders_by_service.data.length > 0 ? (
                                    <div className="mx-auto max-w-xs">
                                        <Doughnut
                                            data={{
                                                labels: charts.orders_by_service
                                                    .labels,
                                                datasets: [
                                                    {
                                                        data: charts
                                                            .orders_by_service
                                                            .data,
                                                        backgroundColor: [
                                                            '#059669',
                                                            '#0ea5e9',
                                                            '#f59e0b',
                                                            '#8b5cf6',
                                                            '#ef4444',
                                                            '#14b8a6',
                                                        ],
                                                    },
                                                ],
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p className="py-8 text-center text-sm text-slate-500">
                                        Tiada tempahan lagi.
                                    </p>
                                )}
                            </ChartCard>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
