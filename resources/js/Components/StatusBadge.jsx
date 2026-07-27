import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
    pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    completed: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    cancelled: 'bg-slate-100 text-slate-600 hover:bg-slate-100',
};

const statusLabels = {
    pending: 'Menunggu',
    in_progress: 'Dalam Proses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

export default function StatusBadge({ status, className }) {
    return (
        <Badge
            className={cn(
                statusStyles[status] ?? 'bg-slate-100 text-slate-600 hover:bg-slate-100',
                className,
            )}
        >
            {statusLabels[status] ?? status}
        </Badge>
    );
}
