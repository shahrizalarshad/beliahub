import ConfirmDialog from '@/Components/ConfirmDialog';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import MoneySummary from '@/Components/MoneySummary';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/StatusBadge';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function PayoutForm({ orderId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        method: 'transfer',
        reference_no: '',
        notes: '',
        paid_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.orders.payouts.store', orderId), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
            <h3 className="font-semibold text-amber-900">
                Rekod Payout Petugas
            </h3>
            <div className="mt-3 space-y-3">
                <div>
                    <InputLabel htmlFor="payout_amount" value="Jumlah (RM)" />
                    <TextInput
                        id="payout_amount"
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.amount} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="payout_method" value="Kaedah" />
                    <SelectInput
                        id="payout_method"
                        value={data.method}
                        onChange={(value) => setData('method', value)}
                        options={[
                            { value: 'transfer', label: 'Pindahan Bank' },
                            { value: 'cash', label: 'Tunai' },
                        ]}
                        className="mt-1 w-full"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="payout_ref" value="No. Rujukan" />
                    <TextInput
                        id="payout_ref"
                        value={data.reference_no}
                        onChange={(e) =>
                            setData('reference_no', e.target.value)
                        }
                        className="mt-1 block w-full"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="payout_paid_at" value="Tarikh" />
                    <TextInput
                        id="payout_paid_at"
                        type="date"
                        value={data.paid_at}
                        onChange={(e) => setData('paid_at', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.paid_at} className="mt-1" />
                </div>
                <PrimaryButton
                    disabled={processing}
                    className="!bg-amber-600 hover:!bg-amber-700 focus:!bg-amber-700 active:!bg-amber-800"
                >
                    Rekod Payout
                </PrimaryButton>
            </div>
        </form>
    );
}

function PaymentForm({ orderId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'deposit',
        amount: '',
        method: 'transfer',
        reference_no: '',
        paid_at: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.orders.payments.store', orderId), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-900">Rekod Bayaran</h4>
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="payment_type" value="Jenis" />
                    <SelectInput
                        id="payment_type"
                        value={data.type}
                        onChange={(value) => setData('type', value)}
                        options={[
                            { value: 'deposit', label: 'Deposit' },
                            { value: 'balance', label: 'Baki' },
                            { value: 'refund', label: 'Bayaran Balik' },
                        ]}
                        className="mt-1 w-full"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="payment_amount" value="Jumlah (RM)" />
                    <TextInput
                        id="payment_amount"
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.amount} className="mt-1" />
                </div>
                <div>
                    <InputLabel htmlFor="payment_method" value="Kaedah" />
                    <SelectInput
                        id="payment_method"
                        value={data.method}
                        onChange={(value) => setData('method', value)}
                        options={[
                            { value: 'transfer', label: 'Pindahan Bank' },
                            { value: 'cash', label: 'Tunai' },
                            { value: 'qr', label: 'DuitNow QR' },
                        ]}
                        className="mt-1 w-full"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="payment_ref" value="No. Rujukan" />
                    <TextInput
                        id="payment_ref"
                        value={data.reference_no}
                        onChange={(e) => setData('reference_no', e.target.value)}
                        className="mt-1 block w-full"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="paid_at" value="Tarikh Bayar" />
                    <TextInput
                        id="paid_at"
                        type="date"
                        value={data.paid_at}
                        onChange={(e) => setData('paid_at', e.target.value)}
                        className="mt-1 block w-full"
                    />
                </div>
            </div>
            <PrimaryButton disabled={processing}>
                Rekod Bayaran
            </PrimaryButton>
        </form>
    );
}

export default function Show({
    order,
    providers = [],
    payments = [],
    skills = [],
}) {
    const assignForm = useForm({ provider_id: order.provider_id ?? '' });
    const [skillFilter, setSkillFilter] = useState('');

    const filteredProviders = skillFilter
        ? providers.filter((provider) =>
              provider.skill_ids.includes(Number(skillFilter)),
          )
        : providers;

    const confirmOrder = () =>
        router.post(route('admin.orders.confirm', order.id));

    const cancel = () => router.post(route('admin.orders.cancel', order.id));

    const assignProvider = (e) => {
        e.preventDefault();
        assignForm.post(route('admin.orders.assign', order.id));
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Tempahan {order.order_no}
                    </h2>
                    <StatusBadge status={order.status} />
                </div>
            }
        >
            <Head title={`Pentadbir — ${order.order_no}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-900">
                                    Butiran Tempahan
                                </h3>
                                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs text-slate-500">Pelanggan</dt>
                                        <dd className="text-sm font-medium text-slate-900">
                                            {order.client_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Perkhidmatan</dt>
                                        <dd className="text-sm font-medium text-slate-900">
                                            {order.service_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Kuantiti</dt>
                                        <dd className="text-sm text-slate-900">{order.quantity}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Petugas</dt>
                                        <dd className="text-sm text-slate-900">
                                            {order.provider_name ?? 'Belum ditugaskan'}
                                        </dd>
                                    </div>
                                </dl>
                                {order.requirements && (
                                    <div className="mt-4 border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-500">Keperluan</p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                            {order.requirements}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-900">
                                    Sejarah Bayaran
                                </h3>
                                {payments.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-500">
                                        Tiada bayaran direkodkan.
                                    </p>
                                ) : (
                                    <ul className="mt-3 divide-y divide-slate-100">
                                        {payments.map((payment) => (
                                            <li
                                                key={payment.id}
                                                className="flex justify-between py-3 text-sm"
                                            >
                                                <span>
                                                    {payment.type_label} · {payment.paid_at}
                                                </span>
                                                <span className="font-medium">
                                                    {payment.amount_formatted}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <PaymentForm orderId={order.id} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <MoneySummary
                                total={order.total_formatted}
                                deposit={order.deposit_formatted}
                                paid={order.paid_formatted}
                                balance={order.balance_formatted}
                            />

                            {order.status === 'pending' && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                    <h3 className="font-semibold text-emerald-900">Tindakan</h3>
                                    <div className="mt-3 space-y-2">
                                        <ConfirmDialog
                                            trigger={
                                                <PrimaryButton
                                                    type="button"
                                                    className="w-full justify-center"
                                                >
                                                    Sahkan Tempahan
                                                </PrimaryButton>
                                            }
                                            title="Sahkan tempahan ini?"
                                            description="Status bertukar kepada Dalam Proses, invois dijana, dan pelanggan dimaklumkan melalui e-mel."
                                            confirmLabel="Sahkan"
                                            onConfirm={confirmOrder}
                                        />
                                        <ConfirmDialog
                                            trigger={
                                                <SecondaryButton
                                                    type="button"
                                                    className="w-full justify-center"
                                                >
                                                    Batalkan
                                                </SecondaryButton>
                                            }
                                            title="Batalkan tempahan ini?"
                                            description="Tindakan ini tidak boleh diundur."
                                            confirmLabel="Batalkan Tempahan"
                                            destructive
                                            onConfirm={cancel}
                                        />
                                    </div>
                                </div>
                            )}

                            {(order.status === 'pending' ||
                                order.status === 'in_progress') && (
                                <form
                                    onSubmit={assignProvider}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        Tugaskan Petugas
                                    </h3>
                                    {skills.length > 0 && (
                                        <SelectInput
                                            value={skillFilter}
                                            onChange={setSkillFilter}
                                            placeholder="Tapis ikut skill..."
                                            options={skills.map((skill) => ({
                                                value: skill.id,
                                                label: skill.name,
                                            }))}
                                            allowClear
                                            clearLabel="Semua skill"
                                            className="mt-3 w-full"
                                        />
                                    )}
                                    <SelectInput
                                        value={assignForm.data.provider_id}
                                        onChange={(value) =>
                                            assignForm.setData(
                                                'provider_id',
                                                value,
                                            )
                                        }
                                        placeholder={
                                            skillFilter
                                                ? `Pilih petugas... (${filteredProviders.length} padan)`
                                                : 'Pilih petugas...'
                                        }
                                        options={filteredProviders.map(
                                            (provider) => ({
                                                value: provider.id,
                                                label: provider.skill_names
                                                    ? `${provider.name} — ${provider.skill_names}`
                                                    : provider.name,
                                            }),
                                        )}
                                        className="mt-3 w-full"
                                    />
                                    <InputError
                                        message={assignForm.errors.provider_id}
                                        className="mt-2"
                                    />
                                    <PrimaryButton
                                        disabled={assignForm.processing}
                                        className="mt-3"
                                    >
                                        Tugaskan
                                    </PrimaryButton>
                                </form>
                            )}

                            {order.status === 'in_progress' && (
                                <ConfirmDialog
                                    trigger={
                                        <SecondaryButton
                                            type="button"
                                            className="w-full justify-center"
                                        >
                                            Batalkan Tempahan
                                        </SecondaryButton>
                                    }
                                    title="Batalkan tempahan ini?"
                                    description="Tempahan sedang dalam proses. Tindakan ini tidak boleh diundur."
                                    confirmLabel="Batalkan Tempahan"
                                    destructive
                                    onConfirm={cancel}
                                />
                            )}

                            {order.status === 'completed' && (
                                <PayoutForm orderId={order.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
