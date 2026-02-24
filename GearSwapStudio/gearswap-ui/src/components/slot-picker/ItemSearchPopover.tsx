import React from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";

interface ItemSearchPopoverProps {
    slot: string;
    setName: string;
    search: string;
    setSearch: (val: string) => void;
    filteredItems: string[];
    isLoadingItems: boolean;
    updateSlot: (setName: string, slot: string, item: string) => void;
    setOpen: (open: boolean) => void;
}

export function ItemSearchPopover({
    slot, setName, search, setSearch, filteredItems, isLoadingItems, updateSlot, setOpen
}: ItemSearchPopoverProps) {
    return (
        <PopoverContent className="w-[260px] p-0 ff-window bg-ui-window backdrop-blur-xl border-white/20 shadow-2xl z-50 overflow-hidden !rounded-none">
            <Command shouldFilter={false} className="bg-transparent text-white light:text-slate-800">
                <CommandInput
                    placeholder={`Search ${slot}...`}
                    value={search}
                    onValueChange={setSearch}
                    className="h-11 text-sm border-none bg-white/5 light:bg-slate-100 text-white light:text-slate-800 placeholder:text-white/20 light:placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                />
                <CommandList className="max-h-72 custom-scrollbar">
                    {isLoadingItems ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-2 text-white/40">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Loading Database...</span>
                        </div>
                    ) : (
                        <>
                            <CommandEmpty className="p-6 text-xs italic text-white/40 light:text-slate-500 text-center">No results in database.</CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map(item => (
                                    <CommandItem
                                        key={item}
                                        onSelect={() => {
                                            updateSlot(setName, slot, item);
                                            setSearch("");
                                            setOpen(false);
                                        }}
                                        className="ff-interactive text-xs py-3 px-8 text-white/70 hover:bg-brand/20 hover:text-white border-b border-white/5 last:border-0 outline-none focus:outline-none"
                                    >
                                        {item}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </Command>
        </PopoverContent>
    );
}
