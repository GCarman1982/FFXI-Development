import React, { useState } from "react";
import { useGearStore } from "@/store/useGearStore";
import { ChevronRight, ChevronDown, Folder, Box } from "lucide-react";
import { AddSetDialog } from "./AddSetDialog";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { allSets, activeTab, setActiveTab } = useGearStore();
  
  // Folders that are open by default
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    precast: true,
    engaged: true,
    idle: true
  });

  const toggleExpand = (cat: string) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Logic: Groups paths by the ROOT (e.g., 'precast')
  // Then identifies 'Group Paths' (e.g., 'precast.WS.Fudo') 
  // which will act as the clickable items for the GearGrid
  const structuredGroups = Object.keys(allSets).reduce((acc, path) => {
    const parts = path.split('.');
    const root = parts[0];
    const groupKey = parts.length > 1 ? parts.slice(0, -1).join('.') : parts[0];

    if (!acc[root]) acc[root] = new Set();
    acc[root].add(groupKey);
    return acc;
  }, {} as Record<string, Set<string>>);

  const roots = Object.keys(structuredGroups).sort();

  return (
    <aside className="w-[280px] h-[calc(100vh-64px)] border-r border-white/10 bg-black/40 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Set Categories
        </span>
        <AddSetDialog />
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {roots.map(root => (
          <div key={root} className="space-y-0.5">
            {/* Folder Row */}
            <Button
              variant="ghost"
              onClick={() => toggleExpand(root)}
              className="w-full flex items-center justify-start gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors h-auto"
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {expanded[root] ? (
                  <ChevronDown className="w-3 h-3 text-brand" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-zinc-600" />
                )}
              </div>
              <Folder className={`w-4 h-4 shrink-0 ${expanded[root] ? 'text-brand' : 'text-zinc-600'}`} />
              <span className={`text-[11px] font-black uppercase tracking-wider truncate ${expanded[root] ? 'text-white' : 'text-zinc-500'}`}>
                {root}
              </span>
            </Button>

            {/* Nested Items Row */}
            {expanded[root] && (
              <div className="ml-[18px] border-l border-white/5 space-y-0.5 mt-0.5">
                {Array.from(structuredGroups[root]).sort().map(groupPath => {
                  const displayName = groupPath.includes('.') 
                    ? groupPath.split('.').slice(1).join('.') 
                    : 'BASE';

                  const isActive = activeTab === groupPath;

                  return (
                    <Button
                      key={groupPath}
                      onClick={() => setActiveTab(groupPath)}
                      className={`
                        w-full flex items-center justify-start gap-3 pl-4 pr-2 py-2 rounded-sm text-left transition-all
                        ${isActive 
                          ? "bg-brand text-black font-bold shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]" 
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"}
                      `}
                    >
                      <Box className={`w-3 h-3 shrink-0 ${isActive ? 'text-black' : 'text-zinc-600'}`} />
                      <span className="text-[10px] truncate uppercase font-bold tracking-tight">
                        {displayName}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}