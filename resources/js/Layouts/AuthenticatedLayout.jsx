import ApplicationLogo from '@/Components/ApplicationLogo';
import Avatar from '@/Components/Avatar';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

function navItemsFor(role) {
    if (role === 'provider') {
        return [
            { route: 'provider.dashboard', label: 'Papan Pemuka' },
            { route: 'provider.orders.index', label: 'Tempahan Ditugaskan' },
            { route: 'provider.earnings.index', label: 'Pendapatan' },
            { route: 'attendances.index', label: 'Kehadiran Saya' },
        ];
    }

    const items = [
        { route: 'dashboard', label: 'Papan Pemuka' },
        { route: 'orders.index', label: 'Tempahan Saya' },
        { route: 'services.catalog', label: 'Katalog' },
    ];

    if (role === 'member') {
        items.push({ route: 'member.card', label: 'Kad Ahli' });
        items.push({ route: 'attendances.index', label: 'Kehadiran Saya' });
    }

    if (role === 'superadmin') {
        items.push({ route: 'attendances.index', label: 'Kehadiran Saya' });
        items.push({ route: 'admin.dashboard', label: 'Panel Admin' });
    }

    return items;
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const navItems = navItemsFor(user.role);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-muted/40">
            <Toast />

            <nav className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link href="/" className="flex items-center gap-2">
                                    <ApplicationLogo className="block h-8 w-8 text-emerald-700" />
                                    <span className="hidden text-base font-bold tracking-tight text-slate-900 sm:inline">
                                        Belia Hub
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:ms-8 sm:flex">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.route}
                                        href={route(item.route)}
                                        active={route().current(item.route)}
                                        className={
                                            route().current(item.route)
                                                ? '!border-emerald-500 !text-emerald-700'
                                                : ''
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {user.membership_id && (
                                <span className="me-4 rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-800">
                                    {user.membership_id}
                                </span>
                            )}
                            <div className="relative ms-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-full py-1 pe-2 ps-1 text-sm font-medium text-slate-600 outline-none transition hover:bg-slate-100 data-[state=open]:bg-slate-100"
                                        >
                                            <Avatar
                                                name={user.name}
                                                url={user.avatar_url}
                                                className="h-8 w-8 text-sm"
                                            />
                                            {user.name}
                                            <ChevronDown className="-me-0.5 h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href={route('profile.edit')}>
                                                Profil
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full"
                                            >
                                                Log Keluar
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map((item) => (
                            <ResponsiveNavLink
                                key={item.route}
                                href={route(item.route)}
                                active={route().current(item.route)}
                            >
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Keluar
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-border bg-background">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
