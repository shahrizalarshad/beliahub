import ApplicationLogo from '@/Components/ApplicationLogo';
import Avatar from '@/Components/Avatar';
import Toast from '@/Components/Toast';
import {
    BriefcaseIcon,
    CalendarIcon,
    ClipboardIcon,
    DocumentTextIcon,
    HomeIcon,
    LogoutIcon,
    MenuIcon,
    TagIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon,
} from '@/Components/Icons';
import { Separator } from '@/Components/ui/separator';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const adminNav = [
    { route: 'admin.dashboard', label: 'Papan Pemuka', icon: HomeIcon },
    { route: 'admin.users.index', label: 'Pengguna', icon: UsersIcon },
    {
        route: 'admin.services.index',
        label: 'Perkhidmatan',
        icon: BriefcaseIcon,
    },
    { route: 'admin.orders.index', label: 'Tempahan', icon: ClipboardIcon },
    { route: 'admin.events.index', label: 'Program', icon: CalendarIcon },
    { route: 'admin.skills.index', label: 'Skill', icon: TagIcon },
    {
        route: 'admin.activity.index',
        label: 'Log Aktiviti',
        icon: DocumentTextIcon,
    },
];

function SidebarContent({ onNavigate = () => {} }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
                <Link
                    href={route('admin.dashboard')}
                    className="flex items-center gap-2.5"
                    onClick={onNavigate}
                >
                    <ApplicationLogo className="h-8 w-8 text-emerald-500" />
                    <span className="text-base font-bold tracking-tight text-white">
                        Belia Hub
                        <span className="ms-2 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                            Admin
                        </span>
                    </span>
                </Link>
            </div>

            <nav className="mt-2 flex-1 space-y-1 px-3">
                {adminNav.map((item) => {
                    const active = route().current(
                        item.route.replace(/\.index$/, '.*'),
                    ) || route().current(item.route);

                    return (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            onClick={onNavigate}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                active
                                    ? 'bg-emerald-500/15 text-emerald-300'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon
                                className={`h-5 w-5 shrink-0 ${
                                    active
                                        ? 'text-emerald-400'
                                        : 'text-slate-400 group-hover:text-slate-200'
                                }`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <Separator className="mx-3 bg-white/10" />

            <div className="space-y-1 p-3">
                <Link
                    href={route('dashboard')}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                    <UserCircleIcon className="h-5 w-5 text-slate-400" />
                    Portal Pengguna
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                    <LogoutIcon className="h-5 w-5 text-slate-400" />
                    Log Keluar
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/40">
            <Toast />

            {/* Sidebar — desktop */}
            <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 bg-slate-900 lg:block">
                <SidebarContent />
            </aside>

            {/* Sidebar — mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/60"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="absolute inset-y-0 start-0 w-64 bg-slate-900 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute end-3 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            aria-label="Tutup menu"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        <SidebarContent
                            onNavigate={() => setSidebarOpen(false)}
                        />
                    </aside>
                </div>
            )}

            <div className="lg:ps-64">
                {/* Topbar */}
                <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
                        aria-label="Buka menu"
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>

                    <div className="min-w-0 flex-1">{header}</div>

                    <Link
                        href={route('profile.edit')}
                        className="flex shrink-0 items-center gap-2.5 rounded-full py-1 pe-3 ps-1 transition hover:bg-slate-100"
                    >
                        <Avatar
                            name={user.name}
                            url={user.avatar_url}
                            className="h-8 w-8 text-sm"
                        />
                        <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                            {user.name}
                        </span>
                    </Link>
                </div>

                <main>{children}</main>
            </div>
        </div>
    );
}
