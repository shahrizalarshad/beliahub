import { CheckIcon } from '@/Components/Icons';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const steps = [
    { key: 'service', label: 'Pilih Perkhidmatan' },
    { key: 'details', label: 'Butiran Tempahan' },
    { key: 'review', label: 'Semak & Hantar' },
];

function formatRm(amount) {
    return `RM ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function WizardSteps({ currentIndex }) {
    return (
        <ol className="flex items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {steps.map((step, index) => {
                const isDone = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <li
                        key={step.key}
                        className={`flex items-center ${index > 0 ? 'flex-1' : ''}`}
                    >
                        {index > 0 && (
                            <span
                                className={`mx-2 h-0.5 flex-1 rounded sm:mx-3 ${
                                    index <= currentIndex
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-200'
                                }`}
                            />
                        )}
                        <span className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                            <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    isDone
                                        ? 'bg-emerald-600 text-white'
                                        : isCurrent
                                          ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700'
                                          : 'border-2 border-slate-200 bg-white text-slate-400'
                                }`}
                            >
                                {isDone ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span
                                className={`hidden text-center text-xs font-medium sm:block sm:text-sm ${
                                    isCurrent
                                        ? 'text-emerald-700'
                                        : isDone
                                          ? 'text-slate-700'
                                          : 'text-slate-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default function Create({ services = [], selectedServiceId = null }) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            service_id: selectedServiceId ?? '',
            quantity: 1,
            requirements: '',
        });

    const [stepIndex, setStepIndex] = useState(0);

    const selectedService = useMemo(
        () => services.find((s) => String(s.id) === String(data.service_id)),
        [services, data.service_id],
    );

    const total = selectedService
        ? (parseFloat(selectedService.price) || 0) *
          (parseInt(data.quantity, 10) || 1)
        : 0;
    const deposit = total * 0.5;

    const goNext = () => {
        if (stepIndex === 0 && !data.service_id) {
            setError('service_id', 'Sila pilih satu perkhidmatan.');
            return;
        }

        clearErrors();
        setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    };

    const goBack = () => {
        clearErrors();
        setStepIndex((index) => Math.max(index - 1, 0));
    };

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
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <WizardSteps currentIndex={stepIndex} />

                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        {/* Step 1 — Pilih Perkhidmatan */}
                        {stepIndex === 0 && (
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Pilih perkhidmatan yang anda mahu tempah
                                </h3>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {services.map((service) => {
                                        const isSelected =
                                            String(service.id) ===
                                            String(data.service_id);

                                        return (
                                            <button
                                                type="button"
                                                key={service.id}
                                                onClick={() => {
                                                    setData(
                                                        'service_id',
                                                        service.id,
                                                    );
                                                    clearErrors(
                                                        'service_id',
                                                    );
                                                }}
                                                className={`rounded-xl border p-4 text-left transition ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-semibold text-slate-900">
                                                        {service.name}
                                                    </p>
                                                    {isSelected && (
                                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                                                            <CheckIcon className="h-3 w-3" />
                                                        </span>
                                                    )}
                                                </div>
                                                {service.description && (
                                                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                                        {service.description}
                                                    </p>
                                                )}
                                                <p className="mt-3 text-sm font-semibold text-emerald-700">
                                                    {service.price_formatted}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError
                                    message={errors.service_id}
                                    className="mt-3"
                                />

                                {selectedService && (
                                    <div className="mt-6">
                                        <InputLabel
                                            htmlFor="quantity"
                                            value="Kuantiti"
                                        />
                                        <div className="mt-1 flex w-fit items-center rounded-lg border border-slate-300">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'quantity',
                                                        Math.max(
                                                            1,
                                                            (parseInt(
                                                                data.quantity,
                                                                10,
                                                            ) || 1) - 1,
                                                        ),
                                                    )
                                                }
                                                className="px-3 py-2 text-slate-600 hover:bg-slate-100"
                                                aria-label="Kurangkan kuantiti"
                                            >
                                                −
                                            </button>
                                            <input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                max="999"
                                                value={data.quantity}
                                                onChange={(e) =>
                                                    setData(
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-16 border-x border-slate-300 py-2 text-center text-sm focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'quantity',
                                                        Math.min(
                                                            999,
                                                            (parseInt(
                                                                data.quantity,
                                                                10,
                                                            ) || 1) + 1,
                                                        ),
                                                    )
                                                }
                                                className="px-3 py-2 text-slate-600 hover:bg-slate-100"
                                                aria-label="Tambah kuantiti"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <InputError
                                            message={errors.quantity}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2 — Butiran Tempahan */}
                        {stepIndex === 1 && (
                            <div className="space-y-5">
                                {selectedService?.order_instructions && (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                        <p className="text-sm font-semibold text-emerald-900">
                                            Arahan Tempahan
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-800">
                                            {
                                                selectedService.order_instructions
                                            }
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <InputLabel
                                        htmlFor="requirements"
                                        value="Keperluan / Brief"
                                    />
                                    <textarea
                                        id="requirements"
                                        value={data.requirements}
                                        onChange={(e) =>
                                            setData(
                                                'requirements',
                                                e.target.value,
                                            )
                                        }
                                        rows={6}
                                        placeholder="Nyatakan keperluan projek, saiz, alamat penghantaran, dll."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    <InputError
                                        message={errors.requirements}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Semak & Hantar */}
                        {stepIndex === 2 && selectedService && (
                            <div className="space-y-5">
                                <h3 className="font-semibold text-slate-900">
                                    Semak tempahan anda sebelum hantar
                                </h3>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <dl className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-xs text-slate-500">
                                                Perkhidmatan
                                            </dt>
                                            <dd className="text-sm font-medium text-slate-900">
                                                {selectedService.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-slate-500">
                                                Kuantiti
                                            </dt>
                                            <dd className="text-sm text-slate-900">
                                                {data.quantity}
                                            </dd>
                                        </div>
                                    </dl>
                                    {data.requirements && (
                                        <div className="mt-4 border-t border-slate-200 pt-4">
                                            <p className="text-xs text-slate-500">
                                                Keperluan
                                            </p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                {data.requirements}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-800">
                                            Jumlah
                                        </span>
                                        <span className="font-semibold text-emerald-900">
                                            {formatRm(total)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-emerald-800">
                                            Deposit (50%) — dibayar dahulu
                                        </span>
                                        <span className="font-semibold text-emerald-900">
                                            {formatRm(deposit)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500">
                                    Selepas hantar, anda akan diberi arahan
                                    bayaran deposit dan ruang untuk muat naik
                                    bukti bayaran pada halaman tempahan.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                            <div>
                                {stepIndex > 0 ? (
                                    <SecondaryButton
                                        type="button"
                                        onClick={goBack}
                                    >
                                        Kembali
                                    </SecondaryButton>
                                ) : (
                                    <Link
                                        href={route('orders.index')}
                                        className="text-sm text-slate-600 hover:text-slate-900"
                                    >
                                        Batal
                                    </Link>
                                )}
                            </div>

                            {stepIndex < steps.length - 1 ? (
                                <PrimaryButton type="button" onClick={goNext}>
                                    Seterusnya
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton disabled={processing}>
                                    Hantar Tempahan
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
