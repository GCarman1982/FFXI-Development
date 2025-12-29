import { useGearStore } from "../store/useGearStore";

const SLOT_ORDER = [
  "main", "sub", "range", "ammo",
  "head", "neck", "ear1", "ear2",
  "body", "hands", "ring1", "ring2",
  "back", "waist", "legs", "feet"
];

export function LuaPreview() {
  const { allSets, activeTab } = useGearStore();

  // Filter: Show the specific active set AND any nested children of that set
  const visibleSets = Object.entries(allSets).filter(([name]) => {
    return name === activeTab || name.startsWith(`${activeTab}.`);
  });

  return (
    <div className="flex-1 w-full h-full p-6 font-mono text-[13px] overflow-auto custom-scrollbar border-l border-white/10
                    bg-[#0a0a0c] 
                    [[data-theme='ffxi']_&]:bg-[linear-gradient(180deg,#000080_0%,#000033_100%)]">
      
      <div className="mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
        -- LUA OUTPUT ({activeTab})
      </div>

      {visibleSets.length > 0 ? (
        visibleSets.map(([setName, gear]) => {
          const [base, ...vParts] = setName.split('.');
          const variant = vParts.length > 0 ? `.${vParts.join('.')}` : "";

          return (
            <div key={setName} className="mb-8 select-all leading-tight">
              {/* Header: sets.precast.WS = { */}
              <div className="text-zinc-400">
                sets.<span className="text-amber-500">{base}</span>
                <span className="text-emerald-500">{variant}</span> = {"{"}
              </div>

              {/* Items: Preserved original pl-4 flex gap-1 spacing for both modes */}
              {SLOT_ORDER.map((slot) => {
  // Only get the item if it explicitly exists in the gear object
  const item = gear[slot] || (slot === 'range' ? gear['ranged'] : null);
  
  // If the item is missing, null, or empty string, don't render the line
  if (!item || item === "None" || item === "empty" || item === "") return null;

  return (
    <div key={slot} className="pl-4 flex gap-1 items-baseline">
      <span className="text-sky-400">{slot}</span>
      <span className="text-zinc-400">=</span>
      <span className="text-emerald-400">"{item}"</span>
      <span className="text-zinc-400">,</span>
    </div>
  );
})}

              <div className="text-zinc-400">{"}"}</div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center text-zinc-700 italic text-xs">
          No sets found for "{activeTab}"
        </div>
      )}
    </div>
  );
}