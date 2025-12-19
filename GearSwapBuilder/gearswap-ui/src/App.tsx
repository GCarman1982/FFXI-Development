import { TopNav } from "./components/TopNav";
import { GearGrid } from "./components/GearGrid";
import { LuaPreview } from "./components/LuaPreview";

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0b] text-zinc-200">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8">
            <GearGrid />
          </div>
        </main>
        <aside className="w-[420px] border-l border-zinc-800 bg-black/30">
          <LuaPreview />
        </aside>
      </div>
    </div>
  );
}