import ConfirmDialog from '@/Components/ConfirmDialog';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import MoneySummary from '@/Components/MoneySummary';
import OrderStepper from '@/Components/OrderStepper';
import PaymentInstructionCard from '@/Components/PaymentInstructionCard';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

function FileList({ files, title }) {
    if (!files?.length) {
        return null;
    }

    return (
        <div className="mt-3">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <ul className="mt-2 space-y-1">
                {files.map((file) => (
                    <li key={file.id}>
                        <a
                            href={file.download_url}
                            className="text-sm text-emerald-700 hover:text-emerald-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {file.original_name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FileUpload({ orderId, category, label }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        category,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.files.store', orderId), {
            forceFormData: true,
            onSuccess: () => reset('file'),
        });
    };

    return (
        <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-3">
            <div className="flex-1">
                <InputLabel value={label} />
                <input
                    type="file"
                    onChange={(e) => setData('file', e.target.files[0])}
                    className="mt-1 block w-full text-sm text-slate-600"
                    accept=".jpg,.jpeg,.png,.pdf,.zip,.docx"
                />
                <InputError message={errors.file} className="mt-1" />
            </div>
            <PrimaryButton disabled={processing || !data.file}>
                Muat Naik
            </PrimaryButton>
        </form>
    );
}

export default function Show({
    order,
    comments = [],
    paymentInfo = {},
    files = {},
    canUpload = {},
    showPaymentInstructions = false,
    viewer = {},
}) {
    const commentForm = useForm({ body: '' });

    const submitComment = (e) => {
        e.preventDefault();
        commentForm.post(route('orders.comments.store', order.id), {
            onSuccess: () => commentForm.reset('body'),
        });
    };

    const cancelOrder = () => router.post(route('orders.cancel', order.id));

    const referenceTitle = viewer.is_client
        ? 'Rujukan (anda)'
        : 'Rujukan (pelanggan)';
    const deliveryTitle = viewer.is_provider
        ? 'Penghantaran (anda)'
        : 'Penghantaran (petugas)';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tempahan {order.order_no}
                    </h2>
                    <StatusBadge status={order.status} />
                </div>
            }
        >
            <Head title={`Tempahan ${order.order_no}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <OrderStepper status={order.status} />

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-900">
                                    Butiran Tempahan
                                </h3>
                                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
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
                                <h3 className="font-semibold text-slate-900">Fail</h3>
                                {(canUpload.reference ||
                                    files.reference?.length > 0) && (
                                    <>
                                        <FileList
                                            files={files.reference}
                                            title={referenceTitle}
                                        />
                                        {canUpload.reference && (
                                            <FileUpload
                                                orderId={order.id}
                                                category="reference"
                                                label="Muat naik fail rujukan"
                                            />
                                        )}
                                    </>
                                )}
                                {(canUpload.payment_proof ||
                                    files.payment_proof?.length > 0) && (
                                    <>
                                        <FileList
                                            files={files.payment_proof}
                                            title="Bukti Bayaran"
                                        />
                                        {canUpload.payment_proof && (
                                            <FileUpload
                                                orderId={order.id}
                                                category="payment_proof"
                                                label="Muat naik bukti bayaran"
                                            />
                                        )}
                                    </>
                                )}
                                {(canUpload.delivery ||
                                    files.delivery?.length > 0) && (
                                    <>
                                        <FileList
                                            files={files.delivery}
                                            title={deliveryTitle}
                                        />
                                        {canUpload.delivery && (
                                            <FileUpload
                                                orderId={order.id}
                                                category="delivery"
                                                label="Muat naik fail penghantaran"
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-slate-900">Komen</h3>
                                {comments.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-500">
                                        Tiada komen lagi.
                                    </p>
                                ) : (
                                    <ul className="mt-4 space-y-4">
                                        {comments.map((comment) => (
                                            <li
                                                key={comment.id}
                                                className="rounded-xl bg-slate-50 p-4"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {comment.author_name}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {comment.created_at}
                                                    </span>
                                                </div>
                                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                                    {comment.body}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <form onSubmit={submitComment} className="mt-4">
                                    <InputLabel htmlFor="body" value="Tambah komen" />
                                    <textarea
                                        id="body"
                                        value={commentForm.data.body}
                                        onChange={(e) =>
                                            commentForm.setData('body', e.target.value)
                                        }
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                    <InputError
                                        message={commentForm.errors.body}
                                        className="mt-2"
                                    />
                                    <PrimaryButton
                                        disabled={commentForm.processing}
                                        className="mt-3"
                                    >
                                        Hantar Komen
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <MoneySummary
                                total={order.total_formatted}
                                deposit={order.deposit_formatted}
                                paid={order.paid_formatted ?? 'RM 0.00'}
                                balance={
                                    order.balance_formatted ??
                                    order.total_formatted
                                }
                            />

                            {showPaymentInstructions && (
                                <PaymentInstructionCard
                                    paymentInfo={paymentInfo}
                                />
                            )}

                            {order.can_cancel && (
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
                                    description="Tindakan ini tidak boleh diundur. Jika deposit sudah dibayar, hubungi pihak organisasi untuk bayaran balik."
                                    confirmLabel="Batalkan Tempahan"
                                    destructive
                                    onConfirm={cancelOrder}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
