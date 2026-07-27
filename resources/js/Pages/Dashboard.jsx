import EmptyState from '@/Components/EmptyState';
import { ShoppingBagIcon } from '@/Components/Icons';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/StatusBadge';
import { Card, CardContent } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function MembershipCard({ membership, canApplyMembership }) {
    const apply = () => router.post(route('membership.apply'));

    if (membership.is_member) {
        return (
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-none">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                    <div>
                        <p className="text-sm font-medium text-emerald-800">
                            Status Keahlian
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-900">
                            Ahli Aktif
                        </p>
                        {membership.membership_id && (
                            <p className="mt-1 font-mono text-sm text-emerald-700">
                                {membership.membership_id}
                            </p>
                        )}
                    </div>
                    <PrimaryButton asChild>
                        <Link href={route('member.card')}>
                            Lihat Kad Ahli Digital
                        </Link>
                    </PrimaryButton>
                </CardContent>
            </Card>
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
    recentOrders = [],
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
                        canApplyMembership={canApplyMembership}
                    />

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
