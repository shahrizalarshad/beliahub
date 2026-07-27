import ConfirmDialog from '@/Components/ConfirmDialog';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TableCard from '@/Components/TableCard';
import TableFilterBar from '@/Components/TableFilterBar';
import UserStatusBadge from '@/Components/UserStatusBadge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Textarea } from '@/Components/ui/textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const roleLabels = {
    superadmin: 'Pentadbir',
    provider: 'Petugas',
    member: 'Ahli',
    client: 'Pelanggan',
};

function RejectDialog({ user }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');

    const submit = () => {
        router.post(
            route('admin.users.membership.reject', user.id),
            { reason },
            { onSuccess: () => setOpen(false) },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DangerButton type="button" size="sm">
                    Tolak
                </DangerButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tolak permohonan keahlian?</DialogTitle>
                    <DialogDescription>
                        Permohonan {user.name} akan ditolak dan pemohon akan
                        dimaklumkan melalui e-mel.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Sebab penolakan (pilihan)..."
                    rows={3}
                />
                <DialogFooter>
                    <DangerButton type="button" onClick={submit}>
                        Tolak Permohonan
                    </DangerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Index({
    users = [],
    pagination = { links: [] },
    filters = {},
    roles = [],
    localities = [],
    skills = [],
}) {
    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-slate-900">
                    Pengurusan Pengguna
                </h2>
            }
        >
            <Head title="Pentadbir — Pengguna" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <TableFilterBar
                        endpoint={route('admin.users.index')}
                        filters={filters}
                        searchPlaceholder="Cari nama, e-mel atau ID ahli..."
                        selects={[
                            {
                                name: 'role',
                                placeholder: 'Semua peranan',
                                options: roles,
                            },
                            {
                                name: 'locality',
                                placeholder: 'Semua lokaliti',
                                options: localities.map((locality) => ({
                                    value: locality,
                                    label: locality,
                                })),
                            },
                            {
                                name: 'skill',
                                placeholder: 'Semua skill',
                                options: skills.map((skill) => ({
                                    value: skill.id,
                                    label: skill.name,
                                })),
                            },
                            {
                                name: 'status',
                                placeholder: 'Semua status',
                                options: [
                                    { value: 'active', label: 'Aktif' },
                                    { value: 'inactive', label: 'Tidak Aktif' },
                                    {
                                        value: 'pending',
                                        label: 'Permohonan Keahlian',
                                    },
                                    {
                                        value: 'unverified',
                                        label: 'E-mel Belum Disahkan',
                                    },
                                ],
                            },
                        ]}
                    />
                    <TableCard pagination={pagination}>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Nama</TableHead>
                                <TableHead className="px-6">E-mel</TableHead>
                                <TableHead className="px-6">Peranan</TableHead>
                                <TableHead className="px-6">ID Ahli</TableHead>
                                <TableHead className="px-6">Status</TableHead>
                                <TableHead className="px-6 text-right">
                                    Tindakan
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada pengguna dijumpai.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="px-6 font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {roleLabels[user.role] ?? user.role}
                                        </TableCell>
                                        <TableCell className="px-6 font-mono text-muted-foreground">
                                            {user.membership_id ?? '—'}
                                        </TableCell>
                                        <TableCell className="px-6">
                                            <UserStatusBadge user={user} />
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            {user.membership_applied_at &&
                                                user.role === 'client' && (
                                                    <div className="flex justify-end gap-2">
                                                        <ConfirmDialog
                                                            trigger={
                                                                <PrimaryButton
                                                                    type="button"
                                                                    size="sm"
                                                                >
                                                                    Lulus
                                                                </PrimaryButton>
                                                            }
                                                            title="Luluskan permohonan keahlian?"
                                                            description={`${user.name} akan menjadi ahli dan ID keahlian akan dijana secara automatik.`}
                                                            confirmLabel="Lulus"
                                                            onConfirm={() =>
                                                                router.post(
                                                                    route(
                                                                        'admin.users.membership.approve',
                                                                        user.id,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                        <RejectDialog
                                                            user={user}
                                                        />
                                                    </div>
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
