import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create({ services = [], selectedServiceId = null }) {
    const { data, setData, post, processing, errors } = useForm({
        service_id: selectedServiceId ?? services[0]?.id ?? '',
        quantity: 1,
        requirements: '',
    });

    const selectedService = useMemo(
        () => services.find((s) => String(s.id) === String(data.service_id)),
        [services, data.service_id],
    );

    const total = selectedService
        ? (parseFloat(selectedService.price) || 0) * (parseInt(data.quantity, 10) || 1)
        : 0;
    const deposit = total * 0.5;

    const formatRm = (amount) =>
        `RM ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tempahan Baru
                </h2>
            }
        >
            <Head title="Tempahan Baru" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div>
                            <InputLabel htmlFor="service_id" value="Perkhidmatan" />
                            <SelectInput
                                id="service_id"
                                value={data.service_id}
                                onChange={(value) =>
                                    setData('service_id', value)
                                }
                                placeholder="Pilih perkhidmatan..."
                                options={services.map((service) => ({
                                    value: service.id,
                                    label: `${service.name} — ${service.price_formatted}`,
                                }))}
                                className="mt-1 w-full"
                            />
                            <InputError message={errors.service_id} className="mt-2" />
                        </div>

                        {selectedService?.order_instructions && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="text-sm font-semibold text-emerald-900">
                                    Arahan Tempahan
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-800">
                                    {selectedService.order_instructions}
                                </p>
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="quantity" value="Kuantiti" />
                            <TextInput
                                id="quantity"
                                type="number"
                                min="1"
                                value={data.quantity}
                                onChange={(e) =>
                                    setData('quantity', e.target.value)
                                }
                                className="mt-1 block w-full max-w-xs"
                                required
                            />
                            <InputError message={errors.quantity} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="requirements"
                                value="Keperluan / Brief"
                            />
                            <textarea
                                id="requirements"
                                value={data.requirements}
                                onChange={(e) =>
                                    setData('requirements', e.target.value)
                                }
                                rows={5}
                                placeholder="Nyatakan keperluan projek, saiz, alamat penghantaran, dll."
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            <InputError message={errors.requirements} className="mt-2" />
                        </div>

                        {selectedService && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Jumlah</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatRm(total)}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-slate-600">Deposit (50%)</span>
                                    <span className="font-semibold text-emerald-700">
                                        {formatRm(deposit)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <PrimaryButton
                                disabled={processing}
                                className=""
                            >
                                Hantar Tempahan
                            </PrimaryButton>
                            <Link
                                href={route('orders.index')}
                                className="text-sm text-slate-600 hover:text-slate-900"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
