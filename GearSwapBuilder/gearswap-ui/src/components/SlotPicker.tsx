import React, { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useGearStore } from "@/store/useGearStore";

export function SlotPicker({ slot, setName }: { slot: string; setName: string }) {
  const { allSets, updateSlot, searchableItems } = useGearStore();
  const [search, setSearch] = useState("");

  const selected = allSets[setName]?.[slot] || "";
  const isEquipped = !!selected;

  const allItemsForSlot = useMemo(() => {
    return searchableItems[slot] || searchableItems[slot.toLowerCase()] || [];
  }, [searchableItems, slot]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();
    return allItemsForSlot
      .filter(item => !search || item.toLowerCase().includes(query))
      .slice(0, 100);
  }, [search, allItemsForSlot]);

  return (
    <div className="w-full h-full">
      <Popover>
        <PopoverTrigger asChild>
          {/* REMOVED 'relative' and 'z-index' here. 
              The .ff-window and .ff-interactive from your CSS handle the positioning 
          */}
          <div className={`
            ff-window ff-interactive flex flex-col p-3 min-h-[85px] h-full cursor-pointer transition-all duration-300
            ${isEquipped 
              ? "border-brand bg-brand/10 scale-[1.02]" 
              : "border-white/5 bg-black/40"}
          `}>
            <span className="text-[10px] font-black uppercase tracking-widest text-operator/60 transition-colors">
              {slot}
            </span>

            <div className="flex-1 flex flex-col items-center justify-center w-full py-1">
              <div className={`text-[12px] leading-tight text-center break-words px-1 line-clamp-2 ${isEquipped ? 'text-white font-bold' : 'text-operator/30 italic uppercase'}`}>
                {selected || "None"}
              </div>
            </div>

            {/* Restored the simple gold accent bar for equipped items */}
            {isEquipped && <div className="absolute inset-y-0 left-0 w-1 bg-brand" />}
          </div>
        </PopoverTrigger>

        {/* Z-INDEX HERE IS OK: This is for the dropdown menu only 
        */}
        <PopoverContent className="w-[240px] p-0 ff-window border-none shadow-2xl z-50" align="start" sideOffset={8}>
          <Command shouldFilter={false} className="bg-transparent">
            <CommandInput 
              placeholder={`Search ${slot}...`} 
              value={search} 
              onValueChange={setSearch}
              className="h-9 text-xs border-none focus:ring-0" 
            />
            <CommandList className="max-h-64 custom-scrollbar overflow-y-auto">
              <CommandEmpty className="p-4 text-xs text-center text-white/50">No items found.</CommandEmpty>
              <CommandGroup>
                <CommandItem 
                  onSelect={() => { updateSlot(setName, slot, ""); setSearch(""); }}
                  className="text-xs py-2 px-3 cursor-pointer"
                >
                  [ Clear Slot ]
                </CommandItem>
                {filteredItems.map((item) => (
                  <CommandItem 
                    key={item} 
                    onSelect={() => { updateSlot(setName, slot, item); setSearch(""); }}
                    className="text-xs py-2 px-3 cursor-pointer"
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}