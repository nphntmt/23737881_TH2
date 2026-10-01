import { useEffect, useState } from 'react';

import { DEBOUNCE_MS } from '@constants/student';

export function useDebouncedValue<T>(
    value: T,
): T {
    const [debouncedValue, setDebouncedValue] =
        useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
        };
    }, [value]);

    return debouncedValue;
}