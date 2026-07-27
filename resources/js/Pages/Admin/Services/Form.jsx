import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PageCard from '@/Components/PageCard';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@/Components/ui/textarea';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ service = null }) {
    const isEditing = Boolean(service?.id);

    const { data, setData, post, put, processing, errors } = useForm({
        name: service?.name ?? '',
        price: service?.price ?? '',
        description: service?.description ?? '',
        order_instructions: service?.order_instructions ?? '',
        is_active: service?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('admin.services.update', service.id));
        } else {
            post(route('admin.services.store'));
        }
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    {isEditing ? 'Edit Perkhidmatan' : 'Tambah Perkhidmatan'}
                </h2>
            }
        >
            <Head
                title={
                    isEditing
                        ? 'Pentadbir — Edit Perkhidmatan'
                        : 'Pentadbir — Tambah Perkhidmatan'
                }
            />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <PageCard contentClassName="pt-0">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Perkhidmatan" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="price"
                                value="Harga Seunit (RM)"
                            />
                            <TextInput
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Penerangan" />
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={4}
                                className="mt-1"
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="order_instructions"
                                value="Arahan Tempahan"
                            />
                            <Textarea
                                id="order_instructions"
                                value={data.order_instructions}
                                onChange={(e) =>
                                    setData('order_instructions', e.target.value)
                                }
                                rows={4}
                                placeholder="Contoh: Saiz baju, alamat penghantaran, pilihan ambil sendiri..."
                                className="mt-1"
                            />
                            <InputError
                                message={errors.order_instructions}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                            />
                            <InputLabel
                                htmlFor="is_active"
                                value="Aktif (papar dalam katalog)"
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <PrimaryButton
                                disabled={processing}
                                className=""
                            >
                                {isEditing ? 'Simpan Perubahan' : 'Cipta Perkhidmatan'}
                            </PrimaryButton>
                            <Link
                                href={route('admin.services.index')}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                    </PageCard>
                </div>
            </div>
        </AdminLayout>
    );
}
