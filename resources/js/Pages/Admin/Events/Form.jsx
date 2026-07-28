import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Form({ event = null }) {
    const isEdit = !!event?.id;
    const [posterPreview, setPosterPreview] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title ?? '',
        description: event?.description ?? '',
        location: event?.location ?? '',
        starts_at: event?.starts_at ?? '',
        ends_at: event?.ends_at ?? '',
        budget: event?.budget ?? '',
        actual_spend: event?.actual_spend ?? '',
        status: event?.status ?? 'draft',
        poster: null,
        remove_poster: false,
    });

    useEffect(() => {
        if (!data.poster) {
            setPosterPreview(null);
            return;
        }

        const url = URL.createObjectURL(data.poster);
        setPosterPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [data.poster]);

    const currentPosterUrl =
        posterPreview ??
        (!data.remove_poster ? event?.poster_url ?? null : null);

    const submit = (e) => {
        e.preventDefault();

        const options = { forceFormData: true, preserveScroll: true };

        if (isEdit) {
            put(route('admin.events.update', event.id), options);
        } else {
            post(route('admin.events.store'), options);
        }
    };

    const removePoster = () => {
        setData((current) => ({
            ...current,
            poster: null,
            remove_poster: true,
        }));
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    {isEdit ? 'Edit Program' : 'Tambah Program'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Edit Program' : 'Tambah Program'} />
            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <PageCard contentClassName="pt-0">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="title" value="Tajuk" />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Penerangan"
                                />
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    className="mt-1"
                                    placeholder="Ringkasan program, agenda, atau nota penting..."
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="Lokasi" />
                                <TextInput
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="starts_at"
                                        value="Mula"
                                    />
                                    <TextInput
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) =>
                                            setData('starts_at', e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.starts_at}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="ends_at" value="Tamat" />
                                    <TextInput
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) =>
                                            setData('ends_at', e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.ends_at}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="budget"
                                        value="Bajet (RM)"
                                    />
                                    <TextInput
                                        id="budget"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.budget}
                                        onChange={(e) =>
                                            setData('budget', e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                    />
                                    <InputError
                                        message={errors.budget}
                                        className="mt-1"
                                    />
                                </div>
                                {isEdit && (
                                    <div>
                                        <InputLabel
                                            htmlFor="actual_spend"
                                            value="Perbelanjaan Sebenar (RM)"
                                        />
                                        <TextInput
                                            id="actual_spend"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.actual_spend}
                                            onChange={(e) =>
                                                setData(
                                                    'actual_spend',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full"
                                        />
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Isi selepas program tamat untuk
                                            rekod perbelanjaan sebenar.
                                        </p>
                                        <InputError
                                            message={errors.actual_spend}
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <InputLabel htmlFor="poster" value="Poster" />
                                {currentPosterUrl && (
                                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                                        <img
                                            src={currentPosterUrl}
                                            alt="Pratonton poster program"
                                            className="max-h-64 w-full object-cover"
                                        />
                                    </div>
                                )}
                                <input
                                    id="poster"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                    onChange={(e) =>
                                        setData('poster', e.target.files[0])
                                    }
                                    className="mt-2 block w-full text-sm text-slate-600"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    JPG, PNG atau WebP. Maksimum 5MB.
                                </p>
                                {isEdit && event?.poster_url && !data.poster && (
                                    <SecondaryButton
                                        type="button"
                                        className="mt-2"
                                        onClick={removePoster}
                                    >
                                        Buang Poster
                                    </SecondaryButton>
                                )}
                                <InputError
                                    message={errors.poster}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(value) =>
                                        setData('status', value)
                                    }
                                    options={[
                                        { value: 'draft', label: 'Draf' },
                                        {
                                            value: 'published',
                                            label: 'Diterbitkan',
                                        },
                                        { value: 'done', label: 'Selesai' },
                                    ]}
                                    className="mt-1 w-full"
                                />
                                <InputError
                                    message={errors.status}
                                    className="mt-1"
                                />
                            </div>

                            <PrimaryButton disabled={processing}>
                                {isEdit ? 'Kemas Kini' : 'Simpan'}
                            </PrimaryButton>
                        </form>
                    </PageCard>
                </div>
            </div>
        </AdminLayout>
    );
}
