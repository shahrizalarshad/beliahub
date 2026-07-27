import EmptyState from '@/Components/EmptyState';
import { CalendarIcon } from '@/Components/Icons';
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
import { Head, Link } from '@inertiajs/react';

const eventStatusLabels = {
    draft: 'Draf',
    published: 'Diterbitkan',
    done: 'Selesai',
};

export default function Index({ events = { data: [], links: [] } }) {
    const rows = events.data ?? [];

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Program & Event
                </h2>
            }
        >
            <Head title="Pentadbir — Program" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-end">
                        <PrimaryButton asChild>
                            <Link href={route('admin.events.create')}>
                                Tambah Program
                            </Link>
                        </PrimaryButton>
                    </div>

                    {rows.length === 0 ? (
                        <EmptyState
                            icon={CalendarIcon}
                            title="Tiada program lagi"
                            description="Cipta program pertama untuk mula merekod kehadiran ahli melalui QR."
                        />
                    ) : (
                        <TableCard pagination={{ links: events.links ?? [] }}>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-6">Tajuk</TableHead>
                                    <TableHead className="px-6">Lokasi</TableHead>
                                    <TableHead className="px-6">Masa</TableHead>
                                    <TableHead className="px-6">Status</TableHead>
                                    <TableHead className="px-6">
                                        Kehadiran
                                    </TableHead>
                                    <TableHead className="px-6 text-right">
                                        Tindakan
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="px-6 font-medium">
                                            {event.title}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {event.location}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {event.starts_at}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <Badge variant="secondary">
                                                {eventStatusLabels[
                                                    event.status
                                                ] ?? event.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <Link
                                                href={route(
                                                    'admin.events.attendances',
                                                    event.id,
                                                )}
                                                className="font-semibold text-primary hover:text-primary/80"
                                            >
                                                {event.attendances_count}{' '}
                                                kehadiran
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <Link
                                                href={route(
                                                    'admin.events.qr',
                                                    event.id,
                                                )}
                                                className="font-semibold text-primary hover:text-primary/80"
                                            >
                                                Papar QR
                                            </Link>
                                            <span className="mx-2 text-muted-foreground/40">
                                                |
                                            </span>
                                            <Link
                                                href={route(
                                                    'admin.events.edit',
                                                    event.id,
                                                )}
                                                className="font-semibold text-primary hover:text-primary/80"
                                            >
                                                Edit
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableCard>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
