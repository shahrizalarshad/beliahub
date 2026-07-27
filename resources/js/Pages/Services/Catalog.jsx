import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const defaultT = {
    nav: {
        brand: 'Belia Hub',
        services: 'Perkhidmatan',
        membership: 'Keahlian',
        login: 'Log Masuk',
        register: 'Daftar',
        dashboard: 'Papan Pemuka',
    },
    hero: { cta_order: 'Order Sekarang' },
    services: {
        title: 'Senarai Perkhidmatan',
        subtitle:
            'Harga permulaan — katalog penuh dikemas kini oleh pentadbir. Deposit 50% diperlukan semasa tempahan.',
    },
    membership_pitch: {
        title: 'Sertai sebagai ahli belia',
        description:
            'Sesiapa boleh daftar dan terus menempah perkhidmatan. Mahu sertai organisasi? Mohon keahlian — pentadbir akan luluskan dan ID ahli BH- akan dijana automatik.',
        benefits: [
            'ID ahli rasmi organisasi (BH-YYYY-NNNN)',
            'Akses event dan kehadiran QR',
            'Peluang jadi petugas & terima upah',
            'Tag kemahiran pada profil',
        ],
        cta_register: 'Daftar Sekarang',
    },
    footer: {
        tagline:
            'Platform digital organisasi belia — keahlian, perkhidmatan, dan program.',
        terms: 'Terma & Syarat',
        privacy: 'Dasar Privasi',
        copyright: '© :year Belia Hub. Hak cipta terpelihara.',
    },
};

function scrollToHash(hash) {
    if (!hash) {
        return;
    }

    requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    });
}

export default function Catalog({ auth, services = [], translations }) {
    const t = translations ?? defaultT;
    const orderHref = auth?.user ? route('orders.create') : route('register');
    const membershipHref = auth?.user ? route('dashboard') : route('register');
    const [activeSection, setActiveSection] = useState('servis');

    useEffect(() => {
        const syncHash = () => {
            const hash = window.location.hash.replace('#', '') || 'servis';
            const section = hash === 'keahlian' ? 'keahlian' : 'servis';
            setActiveSection(section);
            scrollToHash(section);
        };

        syncHash();
        window.addEventListener('hashchange', syncHash);

        return () => window.removeEventListener('hashchange', syncHash);
    }, []);

    const hero =
        activeSection === 'keahlian'
            ? {
                  title: t.membership_pitch.title,
                  subtitle: t.membership_pitch.description,
              }
            : {
                  title: 'Katalog Perkhidmatan',
                  subtitle:
                      'Layari senarai perkhidmatan digital dan fizikal yang ditawarkan oleh organisasi belia. Deposit 50% diperlukan semasa tempahan.',
              };

    return (
        <PublicLayout auth={auth} t={t}>
            <Head
                title={
                    activeSection === 'keahlian'
                        ? t.membership_pitch.title
                        : 'Katalog Perkhidmatan'
                }
            />

            <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 py-16 text-white">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {hero.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-emerald-50">
                        {hero.subtitle}
                    </p>
                </div>
            </section>

            <section id="servis" className="scroll-mt-24 bg-white py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                            {t.services.title}
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                            {t.services.subtitle}
                        </p>
                    </div>

                    {services.length === 0 ? (
                        <p className="text-center text-slate-600">
                            Tiada perkhidmatan aktif buat masa ini.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <article
                                    key={service.id ?? service.slug}
                                    className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {service.name}
                                    </h3>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                                        {service.description}
                                    </p>
                                    <div className="mt-6 space-y-1 border-t border-slate-200 pt-4">
                                        <p className="flex justify-between text-sm">
                                            <span className="text-slate-500">
                                                Harga
                                            </span>
                                            <span className="font-semibold text-slate-900">
                                                {service.price_formatted}
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-sm">
                                            <span className="text-slate-500">
                                                Deposit (50%)
                                            </span>
                                            <span className="font-medium text-emerald-700">
                                                {service.deposit_formatted}
                                            </span>
                                        </p>
                                    </div>
                                    <Link
                                        href={orderHref}
                                        className="mt-5 block rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Tempah Sekarang
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section id="keahlian" className="scroll-mt-24 py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-slate-900 text-white">
                        <div className="grid lg:grid-cols-2">
                            <div className="p-8 sm:p-12 lg:p-14">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {t.membership_pitch.title}
                                </h2>
                                <p className="mt-4 leading-relaxed text-slate-300">
                                    {t.membership_pitch.description}
                                </p>
                                <ul className="mt-8 space-y-3">
                                    {t.membership_pitch.benefits.map(
                                        (benefit, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 text-sm text-slate-200"
                                            >
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                                    ✓
                                                </span>
                                                {benefit}
                                            </li>
                                        ),
                                    )}
                                </ul>
                                <div className="mt-10">
                                    <Link
                                        href={membershipHref}
                                        className="inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                                    >
                                        {t.membership_pitch.cta_register}
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden bg-gradient-to-br from-emerald-600/30 to-teal-600/20 lg:block" />
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
