import { Link } from '@inertiajs/react';

const toneStyles = {
    amber: {
        border: 'border-amber-200',
        bg: 'bg-amber-50',
        badge: 'bg-amber-600',
        text: 'text-amber-900',
        sub: 'text-amber-700',
    },
    red: {
        border: 'border-red-200',
        bg: 'bg-red-50',
        badge: 'bg-red-600',
        text: 'text-red-900',
        sub: 'text-red-700',
    },
    blue: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        badge: 'bg-blue-600',
        text: 'text-blue-900',
        sub: 'text-blue-700',
    },
};

// Kad tindakan untuk dashboard admin — tumpukan perhatian pada apa yang perlu diuruskan segera.
export default function ActionQueueCard({
    icon: Icon,
    title,
    count,
    description,
    href,
    tone = 'amber',
}) {
    const styles = toneStyles[tone] ?? toneStyles.amber;

    return (
        <Link
            href={href}
            className={`group flex items-start gap-4 rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${styles.border} ${styles.bg}`}
        >
            {Icon && (
                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${styles.badge}`}
                >
                    <Icon className="h-5 w-5" />
                </span>
            )}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${styles.text}`}>
                        {count}
                    </p>
                    <p className={`text-sm font-semibold ${styles.text}`}>
                        {title}
                    </p>
                </div>
                <p className={`mt-1 text-xs ${styles.sub}`}>{description}</p>
            </div>
        </Link>
    );
}
