import Pagination from '@/Components/Pagination';
import { Card, CardContent } from '@/Components/ui/card';
import { Table } from '@/Components/ui/table';
import { cn } from '@/lib/utils';

// Pembungkus jadual dalam kad — gaya seragam untuk semua senarai admin/user.
export default function TableCard({
    children,
    pagination,
    className,
    tableClassName,
}) {
    const showPagination = pagination?.links?.length > 3;

    return (
        <Card className={cn('gap-0 overflow-hidden py-0', className)}>
            <CardContent className="p-0">
                <Table className={tableClassName}>{children}</Table>
            </CardContent>
            {showPagination && (
                <div className="border-t border-border">
                    <Pagination links={pagination.links} />
                </div>
            )}
        </Card>
    );
}
