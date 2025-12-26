import { useState } from "react";
import { useGearStore } from "@/store/useGearStore";
import { SlotPicker } from "./SlotPicker";
import { Button } from "@/components/ui/button";
import { Trash2, Eraser } from "lucide-react"; 
import { AddVariantDialog } from "./AddVariantDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function GearGrid() {
  const { allSets, activeTab, removeSet, clearSet } = useGearStore();
  
  // Only need state for the Delete dialog now
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const SLOTS = [
    "main", "sub", "range", "ammo",
    "head", "neck", "ear1", "ear2",
    "body", "hands", "ring1", "ring2",
    "back", "waist", "legs", "feet"
  ];

  const variants = Object.keys(allSets)
    .filter(name => name.split('.')[0] === activeTab)
    .sort();

  return (
    <div className="flex flex-col gap-12 py-10 max-w-5xl mx-auto px-6">
      {variants.map((setName) => {
        const [base, ...vParts] = setName.split('.');
        const variantSuffix = vParts.length > 0 ? `.${vParts.join('.')}` : "";

        return (
          <div key={setName} className="space-y-4 group/section">
            <div className="flex items-center gap-3">
              <div className="ff-interactive flex items-center gap-1 cursor-pointer">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] select-none">
                  <span className="text-operator">sets.</span>
                  <span className="text-lua-orange">{base}</span>
                  <span className="text-lua-green">{variantSuffix}</span>
                </h2>
              </div>

              <div className="h-[1px] flex-1 bg-operator/10" />

              <div className="flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-all">
                
                {/* One-click Clear Gear Set */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearSet(setName)} // Direct call, no dialog
                  className="w-8 h-8 text-operator hover:text-brand hover:bg-brand/10 transition-colors"
                  title="Clear all slots"
                >
                  <Eraser className="w-4 h-4" />
                </Button>

                {/* Themed Delete Trigger */}
                {setName.includes('.') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(setName)} 
                    className="w-8 h-8 text-operator hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SLOTS.map(slot => (
                <SlotPicker key={slot} slot={slot} setName={setName} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-4">
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
        title="Delete Set Variant"
        itemName={deleteTarget || ""}
      />
    </div>
  );
}