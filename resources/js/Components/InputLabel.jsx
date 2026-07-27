import { Label } from '@/Components/ui/label';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <Label className={className} {...props}>
            {value ? value : children}
        </Label>
    );
}
