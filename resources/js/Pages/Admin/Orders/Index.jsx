import StatusBadge from '@/Components/StatusBadge';
import TableCard from '@/Components/TableCard';
import TableFilterBar from '@/Components/TableFilterBar';
import { Badge } from '@/Components/ui/badge';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({
    orders = { data: [], links: [] },
    filters = {},
    statuses = [],
}) {
    const rows = orders.data ?? [];

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Senarai Tempahan
                </h2>
            }
        >
            <Head title="Pentadbir — Tempahan" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TableFilterBar
                        endpoint={route('admin.orders.index')}
                        filters={filters}
                        searchPlaceholder="Cari no. tempahan, pelanggan atau perkhidmatan..."
                        selects={[
                            {
                                name: 'status',
                                placeholder: 'Semua status',
                                options: statuses,
                            },
                        ]}
                    />
                    <TableCard pagination={{ links: orders.links ?? [] }}>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">
                                    No. Tempahan
                                </TableHead>
                                <TableHead className="px-6">Pelanggan</TableHead>
                                <TableHead className="px-6">
                                    Perkhidmatan
                                </TableHead>
                                <TableHead className="px-6">Jumlah</TableHead>
                                <TableHead className="px-6">Status</TableHead>
                                <TableHead className="px-6">Tarikh</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada tempahan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="px-6">
                                            <Link
                                                href={route(
                                                    'admin.orders.show',
                                                    order.id,
                                                )}
                                                className="font-mono font-medium text-primary hover:text-primary/80"
                                            >
                                                {order.order_no}
                                            </Link>
                                            {order.is_stale && (
                                                <Badge className="ms-2 bg-red-100 text-red-700 hover:bg-red-100">
                                                    Tertunggak
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.client_name}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.service_name}
                                        </TableCell>
                                        <TableCell className="px-6 font-medium">
                                            {order.total_formatted}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <StatusBadge
                                                status={order.status}
                                            />
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {order.created_at}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </TableCard>
                </div>
            </div>
        </AdminLayout>
    );
}
