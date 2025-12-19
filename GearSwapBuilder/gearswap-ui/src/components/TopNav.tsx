import { useGearStore } from "@/store/useGearStore";
import { X, Plus } from "lucide-react";

export function TopNav() {
  const { allSets, activeTab, setActiveTab, addSet, removeSet } = useGearStore();

  const categories = Array.from(
    new Set(Object.keys(allSets).map((name) => name.split(".")[0]))
  );

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-zinc-800 bg-[#0a0a0b] shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">
            Gearswap
          </span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Studio
          </span>
        </div>

        <nav className="flex items-center gap-1 bg-zinc-900/40 p-1 rounded-xl border border-zinc-800/50">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            const isProtected = cat === "idle" || cat === "engaged";

            return (
              <div 
                key={cat} 
                onClick={() => setActiveTab(cat)}
                className={`
                  group relative flex items-center h-9 rounded-lg px-3 gap-2 cursor-pointer transition-all duration-200
                  ${isActive 
                    ? "bg-zinc-800 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-blue-400 hover:bg-blue-500/5"}
                `}
              >
                <span className="text-xs font-bold capitalize select-none">
                  {cat}
                </span>

                {/* The "X" inside the box */}
                {!isProtected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete entire "${cat}" category?`)) removeSet(cat);
                    }}
                    className={`
                      flex items-center justify-center w-5 h-5 rounded-md transition-all
                      ${isActive ? "hover:bg-zinc-700" : "hover:bg-blue-500/10"}
                      text-zinc-600 hover:text-red-500
                    `}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              const name = prompt("New category name:");
              if (name) addSet(name.trim());
            }}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-500/5 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}