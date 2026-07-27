import EmptyState from '@/Components/EmptyState';
import { ShoppingBagIcon } from '@/Components/Icons';
import MemberCard from '@/Components/MemberCard';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/StatusBadge';
import { Card, CardContent } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function StatChip({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm sm:text-left">
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
        </div>
    );
}

function MembershipCard({ membership, memberCard, canApplyMembership }) {
    const apply = () => router.post(route('membership.apply'));

    if (membership.is_member) {
        return (
            <div className="space-y-3">
                <div className="mx-auto w-full max-w-md">
                    <MemberCard member={memberCard} />
                </div>
                <div className="text-center">
                    <Link
                        href={route('member.card')}
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Lihat Kad Penuh &amp; Kod QR →
                    </Link>
                </div>
            </div>
        );
    }

    if (membership.is_pending) {
        return (
            <Card className="border-amber-200 bg-amber-50/50 shadow-none">
                <CardContent className="pt-6">
                    <p className="text-sm font-medium text-amber-800">
                        Status Keahlian
                    </p>
                    <p className="mt-2 text-xl font-bold text-amber-900">
                        Permohonan Dalam Semakan
                    </p>
                    <p className="mt-2 text-sm text-amber-700">
                        Pentadbir sedang menyemak permohonan keahlian anda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <PageCard
            title="Status Keahlian"
            description="Anda belum ahli organisasi. Mohon keahlian untuk akses program dan event."
            contentClassName="pt-0"
        >
            <p className="text-xl font-bold text-foreground">Pelanggan</p>
            {canApplyMembership && (
                <PrimaryButton
                    type="button"
                    onClick={apply}
                    className="mt-4"
                >
                    Mohon Keahlian
                </PrimaryButton>
            )}
        </PageCard>
    );
}

export default function Dashboard({
    membership = {},
    memberCard = null,
    recentOrders = [],
    stats = {},
    canApplyMembership = false,
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Papan Pemuka
                </h2>
            }
        >
            <Head title="Papan Pemuka" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <MembershipCard
                        membership={membership}
                        memberCard={memberCard}
                        canApplyMembership={canApplyMembership}
                    />

                    <div className="grid grid-cols-3 gap-3">
                        <StatChip
                            label="Jumlah Tempahan"
                            value={stats.total_orders ?? 0}
                        />
                        <StatChip
                            label="Aktif"
                            value={stats.active_orders ?? 0}
                        />
                        <StatChip
                            label="Selesai"
                            value={stats.completed_orders ?? 0}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-foreground">
                            Tempahan Terkini
                        </h3>
                        <Link
                            href={route('orders.index')}
                            className="text-sm font-semibold text-primary transition hover:text-primary/80"
                        >
                            Lihat Semua Tempahan →
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <EmptyState
                            icon={ShoppingBagIcon}
                            title="Tiada tempahan lagi"
                            description="Terokai katalog perkhidmatan kami dan buat tempahan pertama anda."
                            action={
                                <PrimaryButton asChild>
                                    <Link href={route('orders.create')}>
                                        Buat Tempahan Baru
                                    </Link>
                                </PrimaryButton>
                            }
                        />
                    ) : (
                        <Card className="gap-0 overflow-hidden py-0">
                            <CardContent className="divide-y divide-border p-0">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('orders.show', order.id)}
                                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {order.service_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.order_no} ·{' '}
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-foreground">
                                                {order.total_formatted}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <PrimaryButton asChild>
                            <Link href={route('orders.create')}>
                                Tempah Perkhidmatan
                            </Link>
                        </PrimaryButton>
                        <SecondaryButton asChild>
                            <Link href={route('services.catalog')}>
                                Lihat Katalog
                            </Link>
                        </SecondaryButton>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
