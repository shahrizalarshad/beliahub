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

export default function Privacy({ auth, translations }) {
    const t = translations ?? defaultT;

    return (
        <PublicLayout auth={auth} t={t}>
            <Head title="Dasar Privasi" />

            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Dasar Privasi (PDPA)
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Kemas kini terakhir: Julai 2026
                </p>

                <div className="prose prose-slate mt-10 max-w-none space-y-6 text-slate-700">
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            1. Pengumpulan Data Peribadi
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Kami mengumpul maklumat peribadi yang anda berikan semasa pendaftaran dan penggunaan platform, termasuk nama, e-mel, nombor telefon, dan maklumat tempahan perkhidmatan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            2. Tujuan Penggunaan
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Data peribadi digunakan untuk mengurus keahlian, memproses tempahan perkhidmatan, komunikasi berkaitan pesanan, dan mematuhi obligasi undang-undang di bawah Akta Perlindungan Data Peribadi 2010 (PDPA).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            3. Penyimpanan & Keselamatan
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Data disimpan secara selamat pada infrastruktur awan dengan akses terhad mengikut peranan pengguna. Fail dimuat naik disimpan pada storan awan dengan URL muat turun bertandatangan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            4. Hak Anda
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Anda berhak meminta akses, pembetulan, atau pemadaman data peribadi anda tertakluk kepada keperluan operasi dan undang-undang. Hubungi pentadbir organisasi untuk permintaan berkaitan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            5. Persetujuan
                        </h2>
                        <p className="mt-2 leading-relaxed">
                            Dengan mendaftar, anda memberi persetujuan eksplisit untuk pemprosesan data peribadi anda seperti diterangkan dalam dasar ini.
                        </p>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
