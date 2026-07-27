import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function QrDisplay({ event, qrSvg, expiresAt }) {
    useEffect(() => {
        // Refresh the signed URL/QR just before the 5-minute token expires.
        const timer = setInterval(
            () => router.reload({ only: ['qrSvg', 'expiresAt'] }),
            4 * 60 * 1000,
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <AdminLayout
            header={
                <h2 className="text-lg font-semibold text-slate-900">
                    QR Kehadiran — {event.title}
                </h2>
            }
        >
            <Head title="Papar QR" />
            <div className="flex flex-col items-center py-12">
                <p className="mb-4 text-slate-600">
                    Imbas QR ini untuk rekod kehadiran (ahli sahaja)
                </p>
                <div
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <p className="mt-4 text-sm text-slate-500">
                    QR diperbaharui secara automatik. Token tamat:{' '}
                    {new Date(expiresAt).toLocaleTimeString('ms-MY')}
                </p>
            </div>
        </AdminLayout>
    );
}
