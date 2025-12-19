import { useGearStore } from "@/store/useGearStore";
import { SlotPicker } from "./SlotPicker";
import { Plus, Trash2 } from "lucide-react";

export function GearGrid() {
  const { allSets, activeTab, addSet, removeSet } = useGearStore();
  const SLOTS = ["main","sub","ranged","ammo","head","neck","ear1","ear2","body","hands","ring1","ring2","back","waist","legs","feet"];

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
              <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                sets.<span style={{ color: "var(--color-blue-500)" }}>{base}</span>
                <span style={{ color: "var(--color-green-500)" }}>{variantSuffix}</span>
              </h2>
              <div className="h-[1px] flex-1 bg-zinc-800/30" />
              {setName.includes('.') && (
                <Trash2 onClick={() => removeSet(setName)} className="w-4 h-4 text-zinc-600 hover:text-red-500 cursor-pointer opacity-0 group-hover/section:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {SLOTS.map(slot => <SlotPicker key={slot} slot={slot} setName={setName} />)}
            </div>
          </div>
        );
      })}

      <button 
        onClick={() => { const sub = prompt("Variant name:"); if(sub) addSet(`${activeTab}.${sub}`); }}
        className="group flex items-center justify-center gap-3 w-full h-14 rounded-xl border border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/[0.03] transition-all"
      >
        <Plus className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
        <span className="text-[10px] font-bold text-zinc-500 group-hover:text-blue-400 uppercase tracking-widest">Add {activeTab} Variant</span>
      </button>
    </div>
  );
}