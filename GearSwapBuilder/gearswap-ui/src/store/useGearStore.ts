import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GearStore {
  // Using any here prevents the "items not loading" issue caused by strict typing
  allSets: Record<string, Record<string, any>>; 
  activeTab: string;
  theme: 'dark' | 'ffxi';
  searchableItems: Record<string, string[]>;

  setTheme: (theme: 'dark' | 'ffxi') => void;
  setActiveTab: (tab: string) => void;
  addSet: (name: string) => void;
  removeSet: (name: string) => void;
  updateSlot: (setName: string, slot: string, item: string) => void;
  clearSet: (setName: string) => void;
  initializeItems: (data: Record<string, string[]>) => void;
}

export const useGearStore = create<GearStore>()(
  persist(
    (set) => ({
      allSets: { "idle": {}, "engaged": {} },
      activeTab: "idle",
      theme: 'dark',
      searchableItems: {},

      initializeItems: (data) => set({ searchableItems: data }),
      setTheme: (theme) => set({ theme }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addSet: (name) => set((state) => {
        const parts = name.split('.');
        parts[0] = parts[0].toLowerCase();
        const finalName = parts.join('.');
        return {
          allSets: { ...state.allSets, [finalName]: {} },
          activeTab: parts[0]
        };
      }),

      clearSet: (setName) => set((state) => ({
        allSets: { ...state.allSets, [setName]: {} }
      })),

      removeSet: (setKey) => set((state) => {
        const newSets = { ...state.allSets };
        const categoryOfDeletedSet = setKey.split('.')[0];
        const isCategory = !setKey.includes('.');

          if (isCategory) {
            Object.keys(newSets).forEach(key => {
              if (key.split('.')[0] === setKey) delete newSets[key];
            });
          } else {
            delete newSets[setKey];
          }

          const remainingInCategory = Object.keys(newSets).filter(
            (key) => key.split('.')[0] === categoryOfDeletedSet
          );

          let nextActiveTab = state.activeTab;
          if ((isCategory && state.activeTab.startsWith(`${setKey}.`)) || remainingInCategory.length === 0) {
            nextActiveTab = 'idle';
          } else if (state.activeTab === setKey) {
            nextActiveTab = remainingInCategory[0];
          }

          return { allSets: newSets, activeTab: nextActiveTab };
        }),

      updateSlot: (setName, slot, item) => set((state) => ({
        allSets: {
          ...state.allSets,
          [setName]: {
            ...state.allSets[setName],
            [slot]: item,
          }
        }
      })),
    }),
    {
      name: 'gearswap-studio-storage',
      partialize: (state) => {
        const { searchableItems, ...rest } = state;
        return rest as GearStore;
      },
    }
  )
);