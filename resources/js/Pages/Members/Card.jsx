import MemberCard from '@/Components/MemberCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Card({ member, qrSvg, verifyUrl }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Kad Ahli Digital
                </h2>
            }
        >
            <Head title="Kad Ahli Digital" />

            <div className="py-10">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 sm:px-6 lg:px-8">
                    <div id="member-card" className="w-full max-w-xl">
                        <MemberCard member={member} qrSvg={qrSvg} />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Cetak / Simpan PDF
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                navigator.clipboard.writeText(verifyUrl)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Salin Pautan Semakan
                        </button>
                    </div>

                    <p className="max-w-md text-center text-sm text-slate-500 print:hidden">
                        Tunjukkan kad ini semasa program organisasi. Imbas kod
                        QR untuk mengesahkan status keahlian secara langsung.
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    nav, header { display: none !important; }
                    #member-card { max-width: 100% !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
