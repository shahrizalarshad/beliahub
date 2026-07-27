import { DownloadIcon } from '@/Components/Icons';
import SecondaryButton from '@/Components/SecondaryButton';
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
import { useEffect, useRef } from 'react';

export default function Attendances({ event, attendances = [] }) {
    const refreshTimer = useRef(null);

    useEffect(() => {
        if (event.status !== 'published') return undefined;

        refreshTimer.current = setInterval(() => {
            router.reload({ only: ['attendances'] });
        }, 15000);

        return () => clearInterval(refreshTimer.current);
    }, [event.status]);

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Kehadiran — {event.title}
                </h2>
            }
        >
            <Head title={`Kehadiran — ${event.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            {event.starts_at} ·{' '}
                            <span className="font-semibold text-foreground">
                                {attendances.length}
                            </span>{' '}
                            kehadiran
                            {event.status === 'published' && (
                                <Badge className="ms-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                    <span className="me-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                    Langsung
                                </Badge>
                            )}
                        </p>
                        <div className="flex gap-2">
                            <SecondaryButton asChild>
                                <Link href={route('admin.events.index')}>
                                    Kembali
                                </Link>
                            </SecondaryButton>
                            <SecondaryButton asChild>
                                <a
                                    href={route(
                                        'admin.events.attendances.export',
                                        event.id,
                                    )}
                                >
                                    <DownloadIcon className="me-2 h-4 w-4" />
                                    Eksport CSV
                                </a>
                            </SecondaryButton>
                        </div>
                    </div>

                    <TableCard>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Nama</TableHead>
                                <TableHead className="px-6">ID Ahli</TableHead>
                                <TableHead className="px-6">Lokaliti</TableHead>
                                <TableHead className="px-6">
                                    Masa Imbas
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendances.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada kehadiran direkodkan lagi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendances.map((attendance) => (
                                    <TableRow key={attendance.id}>
                                        <TableCell className="px-6 font-medium">
                                            {attendance.name}
                                        </TableCell>
                                        <TableCell className="px-6 font-mono text-muted-foreground">
                                            {attendance.membership_id ?? '—'}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {attendance.locality ?? '—'}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {attendance.scanned_at}
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
