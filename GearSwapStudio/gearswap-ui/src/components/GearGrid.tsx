import { useState } from "react";
import { useGearStore } from "@/store/useGearStore";
import { SlotPicker } from "./SlotPicker";
import { Button } from "@/components/ui/button";
import { Trash2, Eraser, Layers } from "lucide-react";
import { AddVariantDialog } from "./AddVariantDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { parseGearPath } from "@/lib/utils";

export function GearGrid() {
  const { activeTab, removeSet, clearSet } = useGearStore();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const SLOTS = [
    "main", "sub", "range", "ammo",
    "head", "neck", "ear1", "ear2",
    "body", "hands", "ring1", "ring2",
    "back", "waist", "legs", "feet"
  ];

  const renderFormattedPath = (path: string) => {
    const { base, variant } = parseGearPath(path);

    return (
      <span className="flex items-center">
        <span className="text-lua-orange light:text-orange-700">{base}</span>
        {variant && <span className="text-emerald-500 light:text-emerald-700">{variant}</span>}
      </span>
    );
  };

  return (
    <div className="flex-1 w-full overflow-y-auto custom-scrollbar bg-ui-window">
      <div className="flex flex-col gap-8 py-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="font-russo text-2xl font-black uppercase tracking-tighter italic">
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
            <h2 className="font-russo text-[11px] uppercase tracking-[0.3em] text-white/40">
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
        <div className="mt-8 border-t border-white/10 pt-8 px-4">
          <h3 className="font-russo text-[10px] text-white/40 uppercase tracking-widest mb-4">
            Manual Variants
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(() => {
              const { allSets, setActiveTab } = useGearStore();

              // 1. Find the "True Base" of the active tab
              const getBaseSetPath = (path: string) => {
                const parts = path.split('.');
                // Check prefixes to find the shortest path that exists in allSets
                // This handles both "sets.midcast.RA.Acc" and "midcast.RA.Acc"
                for (let i = 1; i <= parts.length; i++) {
                  const potentialBase = parts.slice(0, i).join('.');
                  if (allSets[potentialBase]) return potentialBase;
                }
                return path;
              };

              const basePath = getBaseSetPath(activeTab);

              // 2. Find all variants (including the base itself)
              const variants = Object.keys(allSets).filter(path =>
                path === basePath || path.startsWith(`${basePath}.`)
              ).sort();

              return variants.map(path => {
                const isActive = activeTab === path;
                const variantName = path === basePath
                  ? "Base"
                  : path.replace(`${basePath}.`, "");

                return (
                  <Button
                    key={path}
                    variant="ghost"
                    onClick={() => setActiveTab(path)}
                    className={`ff-interactive px-4 py-2 h-auto text-[10px] font-bold uppercase tracking-widest border-2 transition-all !rounded-none
                      ${isActive
                        ? "ff-window border-brand bg-white/[0.08] text-white"
                        : "border-white/10 text-white/40 hover:text-white hover:border-white/30"
                      }
                    `}
                  >
                    {variantName}
                  </Button>
                );
              });
            })()}
            <AddVariantDialog />
          </div>
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