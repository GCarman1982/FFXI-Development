import { create } from 'zustand';

interface GearStore {
  allSets: Record<string, Record<string, string>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  addSet: (name: string) => void;
  removeSet: (name: string) => void;
  updateSlot: (setName: string, slot: string, item: string) => void;
}

export const useGearStore = create<GearStore>((set) => ({
  allSets: { "idle": {}, "engaged": {} },
  activeTab: "idle",
  setActiveTab: (tab) => set({ activeTab: tab }),
  addSet: (name) => set((state) => {
    const parts = name.split('.');
    parts[0] = parts[0].toLowerCase();
    const finalName = parts.join('.');
    return { allSets: { ...state.allSets, [finalName]: {} }, activeTab: parts[0] };
  }),
  removeSet: (name) => set((state) => {
    const newSets = { ...state.allSets };
    if (!name.includes('.')) {
      Object.keys(newSets).forEach(k => { if (k === name || k.startsWith(`${name}.`)) delete newSets[k]; });
    } else { delete newSets[name]; }
    const remaining = Object.keys(newSets);
    return { 
      allSets: remaining.length > 0 ? newSets : { "idle": {} },
      activeTab: newSets[state.activeTab] ? state.activeTab : (remaining[0]?.split('.')[0] || "idle")
    };
  }),
  updateSlot: (setName, slot, item) => set((state) => ({
    allSets: { ...state.allSets, [setName]: { ...state.allSets[setName], [slot]: item } }
  })),
}));