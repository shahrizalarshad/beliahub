import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@/Components/Icons';
import SelectInput from '@/Components/SelectInput';
import { Input } from '@/Components/ui/input';

// Search box + optional select filters that reload the current page
// with query-string params (debounced for typing).
export default function TableFilterBar({
    endpoint,
    filters = {},
    searchPlaceholder = 'Cari...',
    selects = [],
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isFirstRender = useRef(true);

    const apply = (params) => {
        router.get(
            endpoint,
            Object.fromEntries(
                Object.entries({ ...filters, search, ...params }).filter(
                    ([, value]) => value !== '' && value != null,
                ),
            ),
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return undefined;
        }

        const timer = setTimeout(() => apply({ search }), 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
                <SearchIcon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="rounded-xl ps-9"
                />
            </div>
            {selects.map((select) => (
                <SelectInput
                    key={select.name}
                    value={filters[select.name] ?? ''}
                    onChange={(value) => apply({ [select.name]: value })}
                    placeholder={select.placeholder}
                    options={select.options}
                    allowClear
                    className="rounded-xl bg-white"
                />
            ))}
        </div>
    );
}
