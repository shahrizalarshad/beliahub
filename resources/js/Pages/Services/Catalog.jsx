import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

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

export default function Catalog({
    auth,
    services = [],
    translations,
}) {
    const t = translations ?? defaultT;
    const orderHref = auth?.user
        ? route('orders.create')
        : route('register');

    return (
        <PublicLayout auth={auth} t={t}>
            <Head title="Katalog Perkhidmatan" />

            <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 py-16 text-white">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Katalog Perkhidmatan
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-emerald-50">
                        Layari senarai perkhidmatan digital dan fizikal yang ditawarkan oleh organisasi belia. Deposit 50% diperlukan semasa tempahan.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {services.length === 0 ? (
                        <p className="text-center text-slate-600">
                            Tiada perkhidmatan aktif buat masa ini.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <article
                                    key={service.id ?? service.slug}
                                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        {service.name}
                                    </h2>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                                        {service.description}
                                    </p>
                                    <div className="mt-6 space-y-1 border-t border-slate-100 pt-4">
                                        <p className="flex justify-between text-sm">
                                            <span className="text-slate-500">Harga</span>
                                            <span className="font-semibold text-slate-900">
                                                {service.price_formatted}
                                            </span>
                                        </p>
                                        <p className="flex justify-between text-sm">
                                            <span className="text-slate-500">Deposit (50%)</span>
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
        </PublicLayout>
    );
}
