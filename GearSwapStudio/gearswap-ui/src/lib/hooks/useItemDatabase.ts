import { useState, useEffect } from 'react';
import { useGearStore } from '@/store/useGearStore';

export function useItemDatabase() {
    const [error, setError] = useState<Error | null>(null);
    const { initializeItems, setIsLoadingItems } = useGearStore();

    useEffect(() => {
        let isMounted = true;

        async function loadItems() {
            setIsLoadingItems(true);
            setError(null);

            try {
                // Dynamic import of the item database
                const ITEM_DATA = await import('@/data/items.json');

                if (isMounted) {
                    initializeItems(ITEM_DATA.default);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Failed to load items database:", err);
                    setError(err instanceof Error ? err : new Error('Unknown error loading items'));
                    setIsLoadingItems(false);
                }
            }
        }

        loadItems();

        return () => {
            isMounted = false;
        };
    }, [initializeItems, setIsLoadingItems]);

    return { error };
}
