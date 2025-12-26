import { useEffect } from "react";
import { TopNav } from "./components/TopNav";
import { GearGrid } from "./components/GearGrid";
import { LuaPreview } from "./components/LuaPreview";
import { useGearStore } from "./store/useGearStore";

import ITEM_DATA from "@/data/items.json";

export default function App() {
  const theme = useGearStore((state) => state.theme);
  const initializeItems = useGearStore(s => s.initializeItems);

  useEffect(() => {
    initializeItems(ITEM_DATA);
  }, []);

  // Sync the Zustand theme state with the HTML data-attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    /* Using bg-background and text-foreground ensures 
       the theme switch actually changes the visual colors.
    */
    <div className="flex flex-col h-screen w-full bg-background text-zinc-200 transition-colors duration-300">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-8">
            <GearGrid />
          </div>
        </main>

        <aside className="ff-window no-hand w-[420px] border-l border-border flex flex-col overflow-hidden">
          <LuaPreview />
        </aside>
      </div>
    </div>
  );
}