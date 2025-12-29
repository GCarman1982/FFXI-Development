import { useEffect } from "react";
import { TopNav } from "./components/TopNav";
import { GearGrid } from "./components/GearGrid";
import { LuaPreview } from "./components/LuaPreview";
import { Sidebar } from "./components/Sidebar"; // FIXED: Correct import path
import { useGearStore } from "./store/useGearStore";
import ITEM_DATA from "@/data/items.json";

export default function App() {
  const theme = useGearStore((state) => state.theme);
  const initializeItems = useGearStore(s => s.initializeItems);

  useEffect(() => {
    initializeItems(ITEM_DATA);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <TopNav />
      
      {/* This container holds everything below the header */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: Navigation Tree */}
        <Sidebar />
        
        {/* CENTER: The Grid Area */}
        <main className="flex-1 overflow-y-auto bg-background/50 p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
             <GearGrid />
          </div>
        </main>

        {/* RIGHT: Code Preview */}
        <aside className="ff-window no-hand w-[420px] border-l border-white/10 flex flex-col overflow-hidden bg-black/20 backdrop-blur-sm">
          <LuaPreview />
        </aside>
        
      </div>
    </div>
  );
}