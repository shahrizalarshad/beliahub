import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const variants = {
    active: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    inactive: 'bg-red-100 text-red-800 hover:bg-red-100',
    pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    unverified: 'bg-slate-100 text-slate-600 hover:bg-slate-100',
};

const labels = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    pending: 'Permohonan Keahlian',
    unverified: 'E-mel Belum Disahkan',
};

// Lencana status pengguna untuk direktori admin.
export default function UserStatusBadge({ user, className }) {
    let variant = 'active';

    if (user.membership_applied_at && user.role === 'client') {
        variant = 'pending';
    } else if (user.is_active === false) {
        variant = 'inactive';
    }

    return (
        <Badge className={cn(variants[variant], className)}>
            {labels[variant]}
        </Badge>
    );
}
