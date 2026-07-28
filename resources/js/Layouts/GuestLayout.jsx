import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '@/Components/Toast';
import { Card, CardContent } from '@/Components/ui/card';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-muted/40 pt-6 sm:justify-center sm:pt-0">
            <Toast />

            <div>
                <Link href="/" className="flex flex-col items-center gap-2">
                    <ApplicationLogo className="h-16 w-16 text-emerald-600" />
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Belia Hub
                    </span>
                </Link>
            </div>

            <Card className="mt-6 w-full sm:max-w-md">
                <CardContent className="pt-6">{children}</CardContent>
            </Card>
        </div>
    );
}
