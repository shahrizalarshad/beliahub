import TableCard from '@/Components/TableCard';
import TableFilterBar from '@/Components/TableFilterBar';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

function propertiesSummary(properties) {
    if (!properties) return null;

    const flat = { ...(properties.attributes ?? {}), ...properties };
    delete flat.attributes;
    delete flat.old;

    const parts = Object.entries(flat)
        .filter(([, value]) => typeof value !== 'object')
        .map(([key, value]) => `${key}: ${value}`);

    return parts.length > 0 ? parts.join(' · ') : null;
}

export default function Index({
    activities = [],
    pagination = { links: [] },
    filters = {},
}) {
    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Log Aktiviti
                </h2>
            }
        >
            <Head title="Pentadbir — Log Aktiviti" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TableFilterBar
                        endpoint={route('admin.activity.index')}
                        filters={filters}
                        searchPlaceholder="Cari dalam log..."
                    />
                    <TableCard pagination={pagination}>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Masa</TableHead>
                                <TableHead className="px-6">Oleh</TableHead>
                                <TableHead className="px-6">Aktiviti</TableHead>
                                <TableHead className="px-6">Subjek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada aktiviti direkodkan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                activities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {activity.created_at}
                                        </TableCell>
                                        <TableCell className="px-6 font-medium">
                                            {activity.causer_name}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            {activity.description}
                                            {propertiesSummary(
                                                activity.properties,
                                            ) && (
                                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                                    {propertiesSummary(
                                                        activity.properties,
                                                    )}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 font-mono text-xs text-muted-foreground">
                                            {activity.subject_type ?? '—'}
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
