import EmptyState from '@/Components/EmptyState';
import { CalendarIcon } from '@/Components/Icons';
import TableCard from '@/Components/TableCard';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ attendances = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Kehadiran Saya
                </h2>
            }
        >
            <Head title="Kehadiran Saya" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {attendances.length === 0 ? (
                        <EmptyState
                            icon={CalendarIcon}
                            title="Tiada rekod kehadiran lagi"
                            description="Imbas kod QR yang dipaparkan oleh pentadbir semasa program organisasi untuk merekod kehadiran anda."
                        />
                    ) : (
                        <TableCard>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-6">
                                        Program
                                    </TableHead>
                                    <TableHead className="px-6">
                                        Lokasi
                                    </TableHead>
                                    <TableHead className="px-6">
                                        Masa Imbas
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendances.map((attendance) => (
                                    <TableRow key={attendance.id}>
                                        <TableCell className="px-6 font-medium">
                                            {attendance.event_title}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {attendance.event_location ?? '—'}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {attendance.scanned_at}
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
