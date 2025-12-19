import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGearStore } from "@/store/useGearStore";
import { X, Plus } from "lucide-react";

export function TopNav() {
  const { allSets, activeTab, setActiveTab, removeSet, addSet } = useGearStore();
  const categories = Array.from(new Set(Object.keys(allSets).map(n => n.split('.')[0])));

  return (
    <header className="flex items-center gap-8 px-6 h-14 border-b border-zinc-800 bg-background shrink-0">
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">Gearswap</span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Studio</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList className="bg-zinc-900/40 border-zinc-800 h-10 p-1">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="relative flex items-center gap-2 h-8 px-3 data-[state=active]:bg-zinc-800 data-[state=active]:text-white group transition-all"
            >
              <span className="text-xs font-bold capitalize">{cat}</span>
              {cat !== 'idle' && cat !== 'engaged' && (
                <button
                  onClick={(e) => { e.stopPropagation(); if(confirm(`Delete ${cat}?`)) removeSet(cat); }}
                  className="p-0.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </TabsTrigger>
          ))}
          <button 
            onClick={() => { const n = prompt("New category:"); if(n) addSet(n); }}
            className="px-3 text-zinc-500 hover:text-blue-400"
          >
            <Plus className="w-4 h-4" />
          </button>
        </TabsList>
      </Tabs>
    </header>
  );
}