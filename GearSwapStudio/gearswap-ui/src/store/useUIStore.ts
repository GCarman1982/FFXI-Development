import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EquippedItem } from './useGearStore';

interface UIStore {
    theme: 'light' | 'dark' | 'ffxi';
    isAugmentModalOpen: boolean;
    modalTarget: { setName: string; slot: string; item: EquippedItem } | null;

    setTheme: (theme: 'light' | 'dark' | 'ffxi') => void;
    openAugmentModal: (setName: string, slot: string, item: EquippedItem) => void;
    closeAugmentModal: () => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            theme: 'dark',
            isAugmentModalOpen: false,
            modalTarget: null,

            setTheme: (theme) => set({ theme }),

            openAugmentModal: (setName, slot, item) => set({
                isAugmentModalOpen: true,
                modalTarget: { setName, slot, item }
            }),

            closeAugmentModal: () => set({
                isAugmentModalOpen: false,
                modalTarget: null
            }),
        }),
        {
            name: 'gearswap-ui-storage',
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);
