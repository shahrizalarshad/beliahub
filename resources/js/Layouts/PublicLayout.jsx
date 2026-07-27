import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function PublicLayout({ auth, t, children }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="h-9 w-9" />
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            {t.nav.brand}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href={`${route('services.catalog')}#servis`}
                            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                        >
                            {t.nav.services}
                        </Link>
                        <Link
                            href={`${route('services.catalog')}#keahlian`}
                            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                        >
                            {t.nav.membership}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                                {t.nav.dashboard}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    {t.nav.login}
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    {t.hero.cta_order}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-md">
                            <div className="flex items-center gap-3">
                                <ApplicationLogo className="h-8 w-8" />
                                <span className="text-lg font-bold text-white">
                                    {t.nav.brand}
                                </span>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-slate-400">
                                {t.footer.tagline}
                            </p>
                        </div>
                        <div className="flex gap-8 text-sm">
                            <Link
                                href="/terma"
                                className="transition hover:text-white"
                            >
                                {t.footer.terms}
                            </Link>
                            <Link
                                href="/privasi"
                                className="transition hover:text-white"
                            >
                                {t.footer.privacy}
                            </Link>
                        </div>
                    </div>
                    <p className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                        {t.footer.copyright.replace(
                            ':year',
                            new Date().getFullYear(),
                        )}
                    </p>
                </div>
            </footer>
        </div>
    );
}
