import { useState } from "react";
import { useGearStore } from "@/store/useGearStore";
import { SlotPicker } from "./SlotPicker";
import { Button } from "@/components/ui/button";
import { Trash2, Eraser, Layers } from "lucide-react";
import { AddVariantDialog } from "./AddVariantDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function GearGrid() {
  const { activeTab, removeSet, clearSet } = useGearStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const SLOTS = [
    "main", "sub", "range", "ammo",
    "head", "neck", "ear1", "ear2",
    "body", "hands", "ring1", "ring2",
    "back", "waist", "legs", "feet"
  ];

  // Logic to parse the path: sets.Primary.SubCategory
  const renderFormattedPath = (path: string) => {
    // Expected input: "midcast['Dark Magic']" or "idle.town"
    const parts = path.split('.'); 
    
    return (
      <span className="flex items-center">
        {/* 1. The Primary Category (e.g., precast, midcast, idle) - Always Orange */}
        <span className="text-lua-orange">{parts[0]}</span>
        
        {/* 2. All Sub-Categories (e.g., ['Dark Magic'], town, weapon) - Always Emerald */}
        {parts.slice(1).map((part, i) => (
          <span key={i} className="flex items-center">
            <span className="text-white/40">.</span>
            <span className="text-emerald-500">{part}</span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="flex-1 w-full overflow-y-auto custom-scrollbar bg-ui-window">
      <div className="flex flex-col gap-8 py-10 max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">
              {renderFormattedPath(activeTab)}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Layers className="w-3 h-3 text-white/40" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                Current Path: {renderFormattedPath(activeTab)}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(activeTab)}
            className="ff-interactive text-red-400 border-red-400/20 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest !rounded-none"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Delete Set
          </Button>
        </div>

        {/* The Set Grid */}
        <div className="space-y-4 group/section">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
              Gear Configuration
            </h2>
            <div className="h-[1px] flex-1 bg-white/10" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearSet(activeTab)}
              className="w-8 h-8 text-white/40 hover:text-brand hover:bg-brand/10"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-black/20 border border-white/10 shadow-2xl ff-window !rounded-none">
            {SLOTS.map(slot => (
              <SlotPicker 
                key={`${activeTab}-${slot}`} 
                slot={slot} 
                setName={activeTab} 
              />
            ))}
          </div>
        </div>

        {/* Global Variants Section */}
        <div className="mt-8 border-t border-white/10 pt-8">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Manual Variants</h3>
          <AddVariantDialog />
        </div>

        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              removeSet(deleteTarget);
              setDeleteTarget(null);
            }
          }}
          title="Delete Set"
          itemName={deleteTarget || ""}
        />
      </div>
    </div>
  );
}