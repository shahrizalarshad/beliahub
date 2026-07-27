import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { cn } from '@/lib/utils';

// Kad halaman seragam — pengganti div bg-white shadow sm:rounded-lg.
export default function PageCard({
    title,
    description,
    children,
    className,
    contentClassName,
    headerClassName,
}) {
    return (
        <Card className={className}>
            {(title || description) && (
                <CardHeader className={headerClassName}>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                </CardHeader>
            )}
            <CardContent className={cn('pt-6', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
