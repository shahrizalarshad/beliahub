import { Button } from '@/Components/ui/button';
import { forwardRef } from 'react';

export default forwardRef(function DangerButton(
    { className = '', children, ...props },
    ref,
) {
    return (
        <Button
            ref={ref}
            variant="destructive"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
});
