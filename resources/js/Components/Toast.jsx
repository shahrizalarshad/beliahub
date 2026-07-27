import { Toaster } from '@/Components/ui/sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Membaca mesej flash Inertia dan memaparkannya melalui Sonner.
export default function Toast() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return <Toaster position="top-right" richColors closeButton />;
}
