import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ event = null }) {
    const isEdit = !!event?.id;
    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title ?? '',
        description: event?.description ?? '',
        location: event?.location ?? '',
        starts_at: event?.starts_at ?? '',
        ends_at: event?.ends_at ?? '',
        budget: event?.budget ?? 0,
        status: event?.status ?? 'draft',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.events.update', event.id));
        } else {
            post(route('admin.events.store'));
        }
    };

    return (
        <AdminLayout header={<h2 className="text-lg font-semibold text-foreground">{isEdit ? 'Edit Program' : 'Tambah Program'}</h2>}>
            <Head title={isEdit ? 'Edit Program' : 'Tambah Program'} />
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <PageCard contentClassName="pt-0">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Tajuk" />
                            <TextInput id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.title} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="location" value="Lokasi" />
                            <TextInput id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} className="mt-1 block w-full" required />
                            <InputError message={errors.location} className="mt-1" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="starts_at" value="Mula" />
                                <TextInput id="starts_at" type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                            <div>
                                <InputLabel htmlFor="ends_at" value="Tamat" />
                                <TextInput id="ends_at" type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <SelectInput
                                id="status"
                                value={data.status}
                                onChange={(value) => setData('status', value)}
                                options={[
                                    { value: 'draft', label: 'Draf' },
                                    { value: 'published', label: 'Diterbitkan' },
                                    { value: 'done', label: 'Selesai' },
                                ]}
                                className="mt-1 w-full"
                            />
                        </div>
                        <PrimaryButton disabled={processing}>{isEdit ? 'Kemas Kini' : 'Simpan'}</PrimaryButton>
                    </form>
                    </PageCard>
                </div>
            </div>
        </AdminLayout>
    );
}
