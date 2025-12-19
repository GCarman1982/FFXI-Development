import { create } from 'zustand';

export const useGearStore = create((set) => ({
  allSets: { "idle": {}, "engaged": {} },
  activeTab: "idle",
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  addSet: (name) => set((state) => {
    const parts = name.split('.');
    parts[0] = parts[0].toLowerCase(); // Only first part lowercase
    const finalName = parts.join('.');
    return {
      allSets: { ...state.allSets, [finalName]: {} },
      activeTab: parts[0] // Switch to the category tab
    };
  }),

  removeSet: (name) => set((state) => {
    const newSets = { ...state.allSets };
    if (!name.includes('.')) {
      // Deleting a base tab: remove all associated variants
      Object.keys(newSets).forEach(k => {
        if (k === name || k.startsWith(`${name}.`)) delete newSets[k];
      });
    } else {
      delete newSets[name];
    }
    const keys = Object.keys(newSets);
    return {
      allSets: keys.length > 0 ? newSets : { "idle": {} },
      activeTab: newSets[state.activeTab] ? state.activeTab : (keys[0]?.split('.')[0] || "idle")
    };
  }),

  updateSlot: (setName, slot, item) => set((state) => ({
    allSets: {
      ...state.allSets,
      [setName]: { ...(state.allSets[setName] || {}), [slot]: item }
    }
  })),
}));