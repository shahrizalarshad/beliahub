import TableCard from '@/Components/TableCard';
import { Card, CardContent } from '@/Components/ui/card';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({
    payouts = [],
    total_formatted = 'RM 0.00',
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Pendapatan Saya
                </h2>
            }
        >
            <Head title="Pendapatan Saya" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <Card className="border-emerald-200 bg-emerald-50/50 shadow-none">
                        <CardContent className="pt-6">
                            <p className="text-sm font-medium text-emerald-800">
                                Jumlah Pendapatan
                            </p>
                            <p className="mt-2 text-3xl font-bold text-emerald-900">
                                {total_formatted}
                            </p>
                        </CardContent>
                    </Card>

                    <TableCard>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Tempahan</TableHead>
                                <TableHead className="px-6">
                                    Perkhidmatan
                                </TableHead>
                                <TableHead className="px-6">Jumlah</TableHead>
                                <TableHead className="px-6">Kaedah</TableHead>
                                <TableHead className="px-6">Tarikh</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada rekod bayaran keluar lagi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payouts.map((payout) => (
                                    <TableRow key={payout.id}>
                                        <TableCell className="px-6 font-mono text-muted-foreground">
                                            {payout.order_no}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {payout.service_name}
                                        </TableCell>
                                        <TableCell className="px-6 font-semibold text-primary">
                                            {payout.amount_formatted}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {payout.method_label ??
                                                payout.method}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {payout.paid_at}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </TableCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
