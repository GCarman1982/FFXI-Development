import React, { useState, useRef, useEffect } from "react";
import { useGearStore } from "@/store/useGearStore";
import { Search } from "lucide-react";
import { SLOT_ITEMS } from "@/data/items";

export function SlotPicker({ slot, setName }: { slot: string; setName: string }) {
  const { allSets, updateSlot } = useGearStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedValue = allSets[setName]?.[slot] || "";
  const options = SLOT_ITEMS[slot] || [];
  const filtered = options.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={wrapperRef}
      onClick={() => setIsOpen(!isOpen)}
      className="relative flex flex-col gap-1 p-3 rounded-xl bg-[#111113] border border-zinc-800/50 
                 hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all cursor-pointer group"
    >
      <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider group-hover:text-blue-400">
        {slot}
      </span>
      <div className={`text-[12px] font-medium h-5 truncate ${selectedValue ? 'text-zinc-100' : 'text-zinc-700 italic'}`}>
        {selectedValue || "None"}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-0 z-50 min-w-[220px] rounded-xl bg-[#0c0c0e] border border-zinc-800 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-2 border-b border-zinc-800 bg-[#111113]">
            <div className="relative flex items-center">
              <Search className="absolute left-2 w-3 h-3 text-zinc-500" />
              <input 
                autoFocus 
                className="w-full bg-zinc-900 text-[11px] text-zinc-200 pl-7 pr-2 py-1.5 rounded-md outline-none border border-zinc-800 focus:border-blue-500/50"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <div className="px-3 py-2 text-[11px] text-zinc-500 hover:bg-zinc-900 italic" onClick={() => { updateSlot(setName, slot, ""); setIsOpen(false); }}>Clear Slot</div>
            {filtered.map(item => (
              <div key={item} className="px-3 py-2 text-[12px] text-zinc-200 hover:bg-blue-600 cursor-pointer" onClick={() => { updateSlot(setName, slot, item); setIsOpen(false); setSearchTerm(""); }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}