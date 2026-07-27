import ConfirmDialog from '@/Components/ConfirmDialog';
import EmptyState from '@/Components/EmptyState';
import { ClipboardIcon } from '@/Components/Icons';
import PrimaryButton from '@/Components/PrimaryButton';
import StatusBadge from '@/Components/StatusBadge';
import TableCard from '@/Components/TableCard';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function completeOrder(orderId) {
    router.post(route('provider.orders.complete', orderId));
}

export default function Index({ orders = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Tempahan Ditugaskan
                </h2>
            }
        >
            <Head title="Tempahan Petugas" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {orders.length === 0 ? (
                        <EmptyState
                            icon={ClipboardIcon}
                            title="Tiada tempahan ditugaskan"
                            description="Apabila pentadbir menugaskan tempahan kepada anda, ia akan dipaparkan di sini."
                        />
                    ) : (
                        <TableCard>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-6">
                                        No. Tempahan
                                    </TableHead>
                                    <TableHead className="px-6">
                                        Perkhidmatan
                                    </TableHead>
                                    <TableHead className="px-6">Pelanggan</TableHead>
                                    <TableHead className="px-6">Status</TableHead>
                                    <TableHead className="px-6">Tarikh</TableHead>
                                    <TableHead className="px-6 text-right">
                                        Tindakan
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="px-6">
                                            <Link
                                                href={route(
                                                    'orders.show',
                                                    order.id,
                                                )}
                                                className="font-mono font-medium text-primary hover:text-primary/80"
                                            >
                                                {order.order_no}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.service_name}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.client_name}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.created_at}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            {order.status === 'in_progress' && (
                                                <ConfirmDialog
                                                    trigger={
                                                        <PrimaryButton
                                                            type="button"
                                                            size="sm"
                                                        >
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
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableCard>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
