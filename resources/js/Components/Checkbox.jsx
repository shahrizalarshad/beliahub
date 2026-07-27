import { Checkbox as ShadcnCheckbox } from '@/Components/ui/checkbox';
import { cn } from '@/lib/utils';

// Pembalut shadcn Checkbox — kekalkan API onChange native untuk keserasian.
export default function Checkbox({
    className = '',
    checked,
    onChange,
    ...props
}) {
    return (
        <ShadcnCheckbox
            checked={checked}
            onCheckedChange={(value) =>
                onChange?.({ target: { checked: value === true } })
            }
            className={cn(className)}
            {...props}
        />
    );
}
