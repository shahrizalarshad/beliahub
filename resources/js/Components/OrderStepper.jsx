import { CheckIcon, XMarkIcon } from '@/Components/Icons';

const steps = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'in_progress', label: 'Dalam Proses' },
    { key: 'completed', label: 'Selesai' },
];

export default function OrderStepper({ status }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    <XMarkIcon className="h-5 w-5" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-red-900">
                        Tempahan Dibatalkan
                    </p>
                    <p className="text-xs text-red-700">
                        Hubungi pentadbir jika ada pertanyaan bayaran balik.
                    </p>
                </div>
            </div>
        );
    }

    const currentIndex = steps.findIndex((step) => step.key === status);

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
                                className={`text-center text-xs font-medium sm:text-sm ${
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
