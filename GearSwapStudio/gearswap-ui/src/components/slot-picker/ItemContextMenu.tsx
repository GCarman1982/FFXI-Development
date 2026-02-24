import React from "react";
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Edit3, Trash2, Copy } from "lucide-react";
import { EquippedItem } from "@/store/useGearStore";

interface ItemContextMenuProps {
    setName: string;
    slot: string;
    displayName: string;
    typedItem: EquippedItem | null;
    openAugmentModal: (setName: string, slot: string, item: EquippedItem) => void;
    updateSlot: (setName: string, slot: string, item: string) => void;
}

export function ItemContextMenu({
    setName, slot, displayName, typedItem, openAugmentModal, updateSlot
}: ItemContextMenuProps) {
    return (
        <ContextMenuContent className="ff-window bg-[#0a0a0c] light:!bg-[#F8FAFC] border-white/10 min-w-[180px] !rounded-none p-1 shadow-3xl">
            <div className="px-2 py-1.5 text-[10px] font-black text-white/30 light:text-slate-400 uppercase tracking-tighter">
                Item Options
            </div>
            <ContextMenuItem
                className="text-xs text-white/80 light:text-slate-700 outline-none focus:bg-brand/30 focus:text-white light:focus:text-black cursor-pointer gap-2 py-2"
                onSelect={() => openAugmentModal(setName, slot, typedItem || { name: displayName })}
            >
                <Edit3 size={14} className="text-lua-green" />
                Edit Augments
            </ContextMenuItem>

            <ContextMenuItem
                className="text-xs text-white/80 light:text-slate-700 outline-none focus:bg-brand/30 focus:text-white light:focus:text-black cursor-pointer gap-2 py-2"
                onSelect={() => navigator.clipboard.writeText(displayName)}
            >
                <Copy size={14} className="text-sky-400" />
                Copy Name
            </ContextMenuItem>

            <ContextMenuSeparator className="bg-white/10 my-1" />

            <ContextMenuItem
                className="text-xs text-red-400 light:text-red-600 outline-none focus:bg-red-500/20 focus:text-red-400 light:focus:text-red-700 cursor-pointer gap-2 py-2"
                onSelect={() => updateSlot(setName, slot, "")}
            >
                <Trash2 size={14} />
                Unequip Item
            </ContextMenuItem>
        </ContextMenuContent>
    );
}
