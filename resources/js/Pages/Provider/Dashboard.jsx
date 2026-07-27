import ConfirmDialog from '@/Components/ConfirmDialog';
import EmptyState from '@/Components/EmptyState';
import { BanknotesIcon, CheckIcon, ClipboardIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function completeOrder(orderId) {
    router.post(route('provider.orders.complete', orderId));
}

function KpiCard({ label, value, accent = 'emerald' }) {
    const accents = {
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        blue: 'border-blue-200 bg-blue-50 text-blue-800',
        slate: 'border-slate-200 bg-white text-slate-800',
    };

    return (
        <div className={`rounded-2xl border p-6 shadow-sm ${accents[accent]}`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
    );
}

export default function Dashboard({
    stats = {},
    needsAction = [],
    recentPayouts = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Papan Pemuka Petugas
                </h2>
            }
        >
            <Head title="Papan Pemuka" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <KpiCard
                            label="Tempahan Ditugaskan"
                            value={stats.assigned ?? 0}
                            accent="slate"
                        />
                        <KpiCard
                            label="Dalam Proses"
                            value={stats.in_progress ?? 0}
                            accent="blue"
                        />
                        <KpiCard
                            label="Selesai"
                            value={stats.completed ?? 0}
                            accent="emerald"
                        />
                        <KpiCard
                            label="Jumlah Pendapatan"
                            value={stats.earnings_formatted ?? 'RM 0.00'}
                            accent="emerald"
                        />
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Perlu Tindakan
                            </h3>
                            <Link
                                href={route('provider.orders.index')}
                                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                Lihat Semua Tempahan →
                            </Link>
                        </div>

                        {needsAction.length === 0 ? (
                            <EmptyState
                                icon={ClipboardIcon}
                                title="Tiada tindakan tertunggak"
                                description="Semua tempahan dalam proses telah ditanda selesai. Tempahan baharu akan dipaparkan di sini."
                            />
                        ) : (
                            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                {needsAction.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                                    >
                                        <div className="min-w-0">
                                            <Link
                                                href={route(
                                                    'orders.show',
                                                    order.id,
                                                )}
                                                className="font-mono text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                            >
                                                {order.order_no}
                                            </Link>
                                            <p className="mt-0.5 text-sm text-slate-600">
                                                {order.service_name} —{' '}
                                                {order.client_name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <ConfirmDialog
                                            trigger={
                                                <PrimaryButton
                                                    type="button"
                                                    size="sm"
                                                >
                                                    <CheckIcon className="h-4 w-4" />
                                                    Tanda Selesai
                                                </PrimaryButton>
                                            }
                                            title="Tanda tempahan sebagai selesai?"
                                            description="Pastikan fail penghantaran telah dimuat naik. Pelanggan akan dimaklumkan melalui e-mel."
                                            confirmLabel="Tanda Selesai"
                                            onConfirm={() =>
                                                completeOrder(order.id)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Pendapatan Terkini
                            </h3>
                            <Link
                                href={route('provider.earnings.index')}
                                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                                Lihat Semua Pendapatan →
                            </Link>
                        </div>

                        {recentPayouts.length === 0 ? (
                            <EmptyState
                                icon={BanknotesIcon}
                                title="Tiada pendapatan lagi"
                                description="Bayaran akan dipaparkan di sini apabila pentadbir merekodkan payout untuk tempahan yang anda selesaikan."
                            />
                        ) : (
                            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                {recentPayouts.map((payout) => (
                                    <div
                                        key={payout.id}
                                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                                    >
                                        <div>
                                            <p className="font-mono text-sm font-medium text-slate-700">
                                                {payout.order_no}
                                            </p>
                                            <p className="mt-0.5 text-sm text-slate-500">
                                                {payout.service_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-emerald-700">
                                                {payout.amount_formatted}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {payout.paid_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
