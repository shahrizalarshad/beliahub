import ConfirmDialog from '@/Components/ConfirmDialog';
import PrimaryButton from '@/Components/PrimaryButton';
import TableCard from '@/Components/TableCard';
import { Badge } from '@/Components/ui/badge';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ services = [] }) {
    const destroy = (service) =>
        router.delete(route('admin.services.destroy', service.id));

    return (
        <AdminLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Perkhidmatan
                    </h2>
                    <PrimaryButton asChild>
                        <Link href={route('admin.services.create')}>
                            Tambah Perkhidmatan
                        </Link>
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Pentadbir — Perkhidmatan" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TableCard>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Nama</TableHead>
                                <TableHead className="px-6">Harga</TableHead>
                                <TableHead className="px-6">Status</TableHead>
                                <TableHead className="px-6">Tempahan</TableHead>
                                <TableHead className="px-6 text-right">
                                    Tindakan
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada perkhidmatan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="px-6">
                                            <p className="font-medium">
                                                {service.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {service.slug}
                                            </p>
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {service.price_formatted}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <Badge
                                                className={
                                                    service.is_active
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted'
                                                }
                                            >
                                                {service.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {service.orders_count ?? 0}
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <Link
                                                href={route(
                                                    'admin.services.edit',
                                                    service.id,
                                                )}
                                                className="font-semibold text-primary hover:text-primary/80"
                                            >
                                                Edit
                                            </Link>
                                            {(service.orders_count ?? 0) ===
                                                0 && (
                                                <>
                                                    <span className="mx-2 text-muted-foreground/40">
                                                        |
                                                    </span>
                                                    <ConfirmDialog
                                                        trigger={
                                                            <button
                                                                type="button"
                                                                className="font-semibold text-destructive hover:text-destructive/80"
                                                            >
                                                                Padam
                                                            </button>
                                                        }
                                                        title={`Padam perkhidmatan "${service.name}"?`}
                                                        description="Tindakan ini tidak boleh dibatalkan."
                                                        confirmLabel="Padam"
                                                        destructive
                                                        onConfirm={() =>
                                                            destroy(service)
                                                        }
                                                    />
                                                </>
                                            )}
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
