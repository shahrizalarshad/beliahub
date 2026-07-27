import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

function FeatureIcon({ type }) {
    const icons = {
        marketplace: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
        ),
        membership: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
        ),
        events: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
        ),
    };

    return (
        <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            {icons[type]}
        </svg>
    );
}

function formatStat(value) {
    return value >= 50 ? `${Math.floor(value / 10) * 10}+` : `${value ?? 0}`;
}

export default function Landing({
    auth,
    services,
    translations: t,
    heroImageUrl = null,
    heroOverlay = 0.55,
    stats = {},
}) {
    const orderHref = auth?.user ? route('dashboard') : route('register');
    const membershipHref = auth?.user ? route('dashboard') : route('register');
    const catalogHref = route('services.catalog');

    const features = [
        { key: 'marketplace', ...t.features.marketplace },
        { key: 'membership', ...t.features.membership },
        { key: 'events', ...t.features.events },
    ];

    // Bar statistik cuma bermakna sebagai bukti sosial selepas ada tempahan
    // sebenar yang selesai — elak tunjuk "0 Tempahan Selesai" pada organisasi baharu.
    const showStats = (stats.completed_orders ?? 0) > 0;

    const statItems = [
        { key: 'members', value: formatStat(stats.members) },
        { key: 'services', value: formatStat(stats.services) },
        {
            key: 'completed_orders',
            value: formatStat(stats.completed_orders),
        },
    ];

    const hasHeroImage = Boolean(heroImageUrl);

    return (
        <PublicLayout auth={auth} t={t}>
            <Head title={t.meta.title}>
                <meta name="description" content={t.meta.description} />
            </Head>

            {/* Hero — full-bleed background image when configured */}
            <section
                className={
                    hasHeroImage
                        ? 'relative min-h-[70vh] overflow-hidden text-white sm:min-h-[75vh]'
                        : 'relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white'
                }
            >
                {hasHeroImage ? (
                    <>
                        <img
                            src={heroImageUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-slate-950"
                            style={{ opacity: heroOverlay }}
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20"
                            aria-hidden="true"
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
                )}

                <div className="relative mx-auto flex min-h-[inherit] max-w-6xl flex-col justify-end px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
                    <span className="inline-flex w-fit rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                        {t.hero.badge}
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        {t.hero.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
                        {t.hero.subtitle}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link
                            href={orderHref}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
                        >
                            {auth?.user
                                ? t.hero.cta_dashboard
                                : t.hero.cta_order}
                        </Link>
                        <Link
                            href={membershipHref}
                            className="rounded-xl border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            {t.hero.cta_membership}
                        </Link>
                        <Link
                            href={catalogHref}
                            className="text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition hover:text-white hover:decoration-white"
                        >
                            {t.hero.cta_catalog} →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats — bukti sosial, hanya bermakna selepas ada tempahan selesai */}
            {showStats && (
                <section className="relative z-10 -mt-8 sm:-mt-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-xl">
                            {statItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="px-3 py-5 text-center sm:py-6"
                                >
                                    <p className="text-2xl font-extrabold text-emerald-700 sm:text-3xl">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                                        {t.stats[item.key]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {t.features.title}
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            {t.features.subtitle}
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.key}
                                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <FeatureIcon type={feature.key} />
                                </div>
                                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="servis" className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {t.services.title}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                            {t.services.subtitle}
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <article
                                key={service.slug}
                                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
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
                                            {t.services.price_label}
                                        </span>
                                        <span className="font-semibold text-slate-900">
                                            {service.price_formatted}
                                        </span>
                                    </p>
                                    <p className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            {t.services.deposit_label}
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
                                    {t.services.order_cta}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership pitch */}
            <section id="keahlian" className="py-16 sm:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-slate-900 text-white">
                        <div className="grid lg:grid-cols-2">
                            <div className="p-8 sm:p-12 lg:p-14">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {t.membership_pitch.title}
                                </h2>
                                <p className="mt-4 text-slate-300 leading-relaxed">
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
                                <div className="mt-10 flex flex-wrap gap-4">
                                    <Link
                                        href={membershipHref}
                                        className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
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

            {/* Final CTA */}
            <section className="pb-16 sm:pb-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl bg-emerald-600 px-8 py-12 text-center text-white sm:px-12">
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {t.cta.title}
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-emerald-50">
                            {t.cta.description}
                        </p>
                        <Link
                            href={orderHref}
                            className="mt-8 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
                        >
                            {t.cta.button}
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
