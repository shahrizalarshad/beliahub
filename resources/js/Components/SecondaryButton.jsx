import { Button } from '@/Components/ui/button';
import { forwardRef } from 'react';

export default forwardRef(function SecondaryButton(
    { type = 'button', className = '', children, ...props },
    ref,
) {
    return (
        <Button
            ref={ref}
            type={type}
            variant="outline"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
});
