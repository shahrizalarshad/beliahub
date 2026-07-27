import { CopyIcon } from '@/Components/Icons';
import { useState } from 'react';

function CopyField({ label, value }) {
    const [copied, setCopied] = useState(false);

    if (!value) {
        return null;
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard unsupported — fail silently, value is still visible.
        }
    };

    return (
        <div>
            <dt className="text-xs font-medium text-emerald-700">{label}</dt>
            <dd className="mt-0.5 flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-emerald-900">
                    {value}
                </span>
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                    <CopyIcon className="h-3.5 w-3.5" />
                    {copied ? 'Disalin!' : 'Salin'}
                </button>
            </dd>
        </div>
    );
}

// Kad arahan bayaran manual — mudahkan client salin nombor akaun sebelum muat naik bukti.
export default function PaymentInstructionCard({ paymentInfo = {} }) {
    return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="font-semibold text-emerald-900">
                Arahan Bayaran
            </h3>
            <div className="mt-4 space-y-3">
                <CopyField label="Bank" value={paymentInfo.bank_name} />
                <CopyField
                    label="No. Akaun"
                    value={paymentInfo.account_no}
                />
                <CopyField
                    label="Nama Akaun"
                    value={paymentInfo.account_name}
                />
            </div>
            <ol className="mt-4 space-y-1.5 text-xs text-emerald-800">
                <li>1. Buat pindahan deposit 50% ke akaun di atas.</li>
                <li>2. Muat naik bukti bayaran di bahagian Fail.</li>
                <li>3. Pentadbir akan sahkan &amp; tugaskan petugas.</li>
            </ol>
        </div>
    );
}
