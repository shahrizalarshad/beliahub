import { Link } from '@inertiajs/react';

// Renders Laravel's paginator linkCollection() output.
export default function Pagination({ links = [] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1 py-4">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`min-w-9 rounded-lg px-3 py-1.5 text-center text-sm transition ${
                            link.active
                                ? 'bg-emerald-600 font-semibold text-white'
                                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="min-w-9 px-3 py-1.5 text-center text-sm text-slate-300"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
