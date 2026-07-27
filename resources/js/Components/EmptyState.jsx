import { InboxIcon } from '@/Components/Icons';
import { Card, CardContent } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

export default function EmptyState({
    icon: Icon = InboxIcon,
    title,
    description,
    action = null,
    className,
}) {
    return (
        <Card
            className={cn(
                'border-dashed bg-muted/30 shadow-none',
                className,
            )}
        >
            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
                {action && <div className="mt-5">{action}</div>}
            </CardContent>
        </Card>
    );
}
