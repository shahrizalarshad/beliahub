import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

const defaultT = {
    nav: {
        brand: 'Belia Hub',
        services: 'Perkhidmatan',
        membership: 'Keahlian',
        login: 'Log Masuk',
        dashboard: 'Papan Pemuka',
    },
    hero: { cta_order: 'Order Sekarang' },
    footer: {
        tagline: 'Platform digital organisasi belia — keahlian, perkhidmatan, dan program.',
        terms: 'Terma & Syarat',
        privacy: 'Dasar Privasi',
        copyright: '© :year Belia Hub. Hak cipta terpelihara.',
    },
};

export default function Terms({ auth, translations }) {
    const t = translations ?? defaultT;

    return (
        <PublicLayout auth={auth} t={t}>
            <Head title="Terma & Syarat" />

            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Terma & Syarat
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Kemas kini terakhir: Julai 2026
                </p>

                <div className="prose prose-slate mt-10 max-w-none space-y-6 text-slate-700">
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            1. Penerimaan Terma
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Dengan mendaftar atau menggunakan platform Belia Hub, anda bersetuju dengan terma dan syarat ini. Jika anda tidak bersetuju, sila jangan gunakan perkhidmatan kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            2. Perkhidmatan Platform
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Belia Hub menyediakan marketplace perkhidmatan dan pengurusan keahlian organisasi belia. Tempahan perkhidmatan terbuka kepada pelanggan berdaftar. Keahlian organisasi memerlukan kelulusan pentadbir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            3. Tempahan & Pembayaran
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Deposit 50% diperlukan semasa membuat tempahan. Pembayaran direkodkan secara manual oleh pentadbir selepas bukti pembayaran dimuat naik. Harga perkhidmatan adalah seperti dipaparkan pada masa tempahan dibuat.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            4. Pembatalan & Bayaran Balik
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Pelanggan boleh membatalkan tempahan semasa status menunggu. Bayaran balik deposit tertakluk kepada dasar organisasi dan keputusan pentadbir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            5. Hubungi Kami
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Untuk pertanyaan mengenai terma ini, sila hubungi pentadbir organisasi melalui saluran rasmi.
                        </p>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
