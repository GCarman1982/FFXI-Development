import { useEffect } from "react";
import { TopNav } from "./components/TopNav";
import { GearGrid } from "./components/GearGrid";
import { LuaPreview } from "./components/LuaPreview";
import { Sidebar } from "./components/Sidebar";
import { useGearStore } from "./store/useGearStore";
import { useUIStore } from "./store/useUIStore";
import { useItemDatabase } from "./lib/hooks/useItemDatabase";
import { AugmentModal } from "./components/gear/augment-modal";
import { UpdateProgress } from "./components/UpdateProgress";

export default function App() {
  const { theme, isAugmentModalOpen, closeAugmentModal, modalTarget } = useUIStore();
  const { updateSlot, allSets } = useGearStore();

  useItemDatabase();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground relative">
      <TopNav />

      {/* This container holds everything below the header */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Navigation Tree (Fixed width) */}
        <Sidebar />

        {/* CENTER: The Grid Area - Using flex-[1.4] to give more weight to center than sidebar */}
        <main className="flex-[1.4] min-w-[600px] overflow-y-auto bg-background/50 p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <GearGrid />
          </div>
        </main>

        {/* RIGHT: Code Preview - Using flex-1 to make it grow/shrink proportionally */}
        {/* Removed fixed 420px, added min-width to prevent squishing */}
        <aside className="ff-window no-hand flex-1 min-w-[480px] border-l border-white/10 flex flex-col overflow-hidden bg-black/20 backdrop-blur-sm">
          <LuaPreview />
        </aside>
      </div>
      {
        (() => {
          if (!modalTarget) return null;

          // Get the "live" item from the store so that updates (add/remove augments)
          // are reflected immediately without closing/reopening the modal.
          // We also handle the case where the slot might have been cleared or changed.
          const currentItemData = allSets[modalTarget.setName]?.[modalTarget.slot];

          // If the item was removed from the set while modal was open, fallback or close
          // For now, we'll try to maintain valid object structure
          const liveItem = typeof currentItemData === 'string'
            ? { name: currentItemData }
            : (currentItemData || modalTarget.item);

          return (
            <AugmentModal
              item={liveItem}
              isOpen={isAugmentModalOpen}
              onOpenChange={closeAugmentModal}
              onUpdate={(newData) => updateSlot(modalTarget.setName, modalTarget.slot, newData)}
            />
          );
        })()
      }
      <UpdateProgress />
    </div >
  );
}