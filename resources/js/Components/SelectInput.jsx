import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

// Radix Select tidak membenarkan item bernilai string kosong,
// jadi item "kosongkan" menggunakan nilai sentinel ini.
const CLEAR_VALUE = '__clear__';

// Pembalut shadcn Select dengan API ringkas: value string,
// onChange menerima nilai terus ('' apabila dikosongkan).
export default function SelectInput({
    value,
    onChange,
    placeholder = 'Pilih...',
    options = [],
    allowClear = false,
    clearLabel,
    className = '',
    disabled = false,
    id,
}) {
    const current =
        value === '' || value == null ? undefined : String(value);

    return (
        <Select
            value={current ?? ''}
            onValueChange={(v) => onChange(v === CLEAR_VALUE ? '' : v)}
            disabled={disabled}
        >
            <SelectTrigger id={id} className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {allowClear && (
                    <SelectItem value={CLEAR_VALUE}>
                        {clearLabel ?? placeholder}
                    </SelectItem>
                )}
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={String(option.value)}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
