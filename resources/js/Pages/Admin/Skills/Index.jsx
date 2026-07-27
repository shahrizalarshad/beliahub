import ConfirmDialog from '@/Components/ConfirmDialog';
import InputError from '@/Components/InputError';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import TableCard from '@/Components/TableCard';
import TextInput from '@/Components/TextInput';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ skills = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.skills.store'), {
            onSuccess: () => reset(),
        });
    };

    const destroy = (skill) =>
        router.delete(route('admin.skills.destroy', skill.id));

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Pengurusan Skill
                </h2>
            }
        >
            <Head title="Pentadbir — Skill" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <PageCard contentClassName="pt-0">
                        <form
                            onSubmit={submit}
                            className="flex items-start gap-3"
                        >
                            <div className="flex-1">
                                <TextInput
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Nama skill baharu, cth. Jahitan"
                                    className="block w-full"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>
                            <PrimaryButton
                                disabled={processing || !data.name.trim()}
                            >
                                Tambah
                            </PrimaryButton>
                        </form>
                    </PageCard>

                    <TableCard>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="px-6">Skill</TableHead>
                                <TableHead className="px-6">Pengguna</TableHead>
                                <TableHead className="px-6 text-right">
                                    Tindakan
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {skills.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="px-6 py-10 text-center text-muted-foreground"
                                    >
                                        Tiada skill lagi. Tambah skill pertama
                                        di atas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                skills.map((skill) => (
                                    <TableRow key={skill.id}>
                                        <TableCell className="px-6 font-medium">
                                            {skill.name}
                                        </TableCell>
                                        <TableCell className="px-6 text-muted-foreground">
                                            {skill.users_count} pengguna
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <ConfirmDialog
                                                trigger={
                                                    <button
                                                        type="button"
                                                        className="text-sm font-semibold text-destructive transition hover:text-destructive/80"
                                                    >
                                                        Padam
                                                    </button>
                                                }
                                                title={`Padam skill "${skill.name}"?`}
                                                description="Tag skill ini pada semua pengguna akan turut dibuang."
                                                confirmLabel="Padam"
                                                destructive
                                                onConfirm={() =>
                                                    destroy(skill)
                                                }
                                            />
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
