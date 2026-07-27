import { Button } from '@/Components/ui/button';
import { forwardRef } from 'react';

export default forwardRef(function PrimaryButton(
    { className = '', children, ...props },
    ref,
) {
    return (
        <Button ref={ref} className={className} {...props}>
            {children}
        </Button>
    );
});
