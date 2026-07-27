import EmptyState from '@/Components/EmptyState';
import { ShoppingBagIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/StatusBadge';
import { Card, CardContent } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ orders = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Tempahan Saya
                    </h2>
                    <PrimaryButton asChild>
                        <Link href={route('orders.create')}>
                            Tempahan Baru
                        </Link>
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Tempahan Saya" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {orders.length === 0 ? (
                        <EmptyState
                            icon={ShoppingBagIcon}
                            title="Belum ada tempahan"
                            description="Lihat katalog perkhidmatan kami dan buat tempahan pertama anda — deposit hanya 50%."
                            action={
                                <PrimaryButton asChild>
                                    <Link href={route('orders.create')}>
                                        Buat Tempahan Pertama
                                    </Link>
                                </PrimaryButton>
                            }
                        />
                    ) : (
                        <Card className="gap-0 overflow-hidden py-0">
                            <CardContent className="divide-y divide-border p-0">
                                {orders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={route('orders.show', order.id)}
                                        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-mono text-sm text-muted-foreground">
                                                {order.order_no}
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {order.service_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.created_at}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-foreground">
                                                {order.total_formatted}
                                            </span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
