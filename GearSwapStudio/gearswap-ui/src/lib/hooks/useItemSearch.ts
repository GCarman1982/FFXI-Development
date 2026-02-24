import { useState, useMemo } from 'react';
import { useGearStore } from '@/store/useGearStore';

export function useItemSearch(slot: string) {
    const [search, setSearch] = useState("");
    const searchableItems = useGearStore((state) => state.searchableItems);

    const itemsForSlot = searchableItems[slot] || [];

    const filteredItems = useMemo(() => {
        if (!search) return itemsForSlot.slice(0, 80);

        const lowerSearch = search.toLowerCase();
        return itemsForSlot
            .filter(item => item.toLowerCase().includes(lowerSearch))
            .slice(0, 80);
    }, [itemsForSlot, search]);

    return {
        search,
        setSearch,
        filteredItems,
        hasItems: itemsForSlot.length > 0
    };
}
