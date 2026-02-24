import React from "react";
import { useGearStore, EquippedItem } from "../store/useGearStore";
import { useUIStore } from "../store/useUIStore";
import { parseGearPath } from "@/lib/utils";

const SLOT_MAP: Record<string, string> = {
  main: "main", sub: "sub", range: "range", ammo: "ammo",
  head: "head", neck: "neck",
  ear1: "left_ear", ear2: "right_ear",
  body: "body", hands: "hands",
  ring1: "left_ring", ring2: "right_ring",
  back: "back", waist: "waist", legs: "legs", feet: "feet"
};

const SLOT_ORDER = [
  "main", "sub", "range", "ammo", "head", "body", "hands",
  "legs", "feet", "neck", "waist", "ear1", "ear2", "ring1", "ring2", "back"
];

export function LuaPreview() {
  const { allSets, activeTab } = useGearStore();
  const { theme } = useUIStore();

  const isLight = theme === 'light';
  const slotColor = theme === 'ffxi' ? 'text-white' : isLight ? 'text-blue-700' : 'text-sky-400';
  const cKeyword = isLight ? 'text-amber-700' : 'text-amber-500';
  const cVariant = isLight ? 'text-emerald-700' : 'text-emerald-500';
  const cString = isLight ? 'text-emerald-700' : 'text-emerald-400';
  const cVar = isLight ? 'text-orange-700' : 'text-amber-300';
  const cPunct = isLight ? 'text-slate-500' : 'text-zinc-400';
  const cProp = isLight ? 'text-blue-700' : 'text-sky-300';
  const cArray = isLight ? 'text-emerald-800' : 'text-emerald-200';

  const visibleSets = Object.entries(allSets).filter(([name]) => {
    return name === activeTab || name.startsWith(`${activeTab}.`);
  });

  return (
    <div className="flex-1 w-full h-full p-6 font-mono text-[13px] overflow-auto custom-scrollbar border-l border-white/10
                    bg-[#0a0a0c] light:bg-[#F8FAFC] ffxi:bg-[linear-gradient(180deg,#000080_0%,#000033_100%)]">

      {visibleSets.map(([setName, gear]) => {
        const { base, variant } = parseGearPath(setName);

        return (
          <div key={setName} className="mb-8 select-all leading-normal">
            <div className={cPunct}>
              {/* Always start with 'sets.' once, then add the components */}
              sets.<span className={cKeyword}>{base}</span>
              <span className={cVariant}>{variant}</span> = {" {"}
            </div>

            {SLOT_ORDER.map((slotKey) => {
              const itemData = gear[slotKey];
              const gearswapSlotName = SLOT_MAP[slotKey];

              if (!itemData || itemData === "None" || itemData === "empty" || itemData === "") return null;

              if (typeof itemData === 'string') {
                return (
                  <div key={slotKey} className="pl-4 whitespace-nowrap">
                    <span className={slotColor}>{gearswapSlotName}</span>
                    <span className={cPunct}>="</span>
                    <span className={cString}>{itemData}</span>
                    <span className={cPunct}>",</span>
                  </div>
                );
              }

              const item = itemData as EquippedItem;
              if (item.isVariable) {
                return (
                  <div key={slotKey} className="pl-4 whitespace-nowrap">
                    <span className={slotColor}>{gearswapSlotName}</span>
                    <span className={cPunct}>=</span>
                    <span className={cVar}>{item.name}</span>
                    <span className={cPunct}>,</span>
                  </div>
                );
              }

              const displayAugs: string[] = [];
              if (item.path) displayAugs.push(`Path: ${item.path}`);
              if (item.augments) displayAugs.push(...item.augments);

              // If it's a simple item with no special attributes, show as string
              if (displayAugs.length === 0 && !item.rank && !item.path) {
                return (
                  <div key={slotKey} className="pl-4 whitespace-nowrap">
                    <span className={slotColor}>{gearswapSlotName}</span>
                    <span className={cPunct}>="</span>
                    <span className={cString}>{item.name}</span>
                    <span className={cPunct}>",</span>
                  </div>
                );
              }

              return (
                <div key={slotKey} className="pl-4 whitespace-nowrap">
                  <span className={slotColor}>{gearswapSlotName}</span>
                  <span className={cPunct}>={"{"} </span>
                  <span className={cProp}>name</span>
                  <span className={cPunct}>="</span>
                  <span className={cString}>{item.name}</span>
                  <span className={cPunct}>", </span>

                  {displayAugs.length > 0 && (
                    <>
                      <span className={cProp}>augments</span>
                      <span className={cPunct}>={"{"}</span>
                      <span className={cArray}>
                        {displayAugs.map((a, i) => (
                          <React.Fragment key={i}>
                            '{a.trim()}'{i < displayAugs.length - 1 ? "," : ""}
                          </React.Fragment>
                        ))}
                      </span>
                      <span className={cPunct}>{"}"}</span>
                    </>
                  )}
                  <span className={cPunct}>{"},"}</span>
                </div>
              );
            })}

            <div className={cPunct}>{"}"}</div>
          </div>
        );
      })}
    </div>
  );
}