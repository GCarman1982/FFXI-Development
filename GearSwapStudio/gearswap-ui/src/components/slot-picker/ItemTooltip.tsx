import React from "react";
import { TooltipContent } from "@/components/ui/tooltip";
import { EquippedItem } from "@/store/useGearStore";

interface ItemTooltipProps {
    displayName: string;
    typedItem: EquippedItem | null;
    augments: string[];
    hasAugments: boolean;
}

export function ItemTooltip({ displayName, typedItem, augments, hasAugments }: ItemTooltipProps) {
    return (
        <TooltipContent side="right" className="ff-tooltip !rounded-none z-[100]">
            <div className="tooltip-title">{displayName}</div>

            <div className="space-y-1 mt-2">
                {typedItem?.path && (
                    <p className="text-lua-orange text-[12px] font-bold">Path: {typedItem.path}</p>
                )}
                {typedItem?.rank && (
                    <p className="text-amber-400 text-[12px] font-bold">Rank: {typedItem.rank}</p>
                )}
                {augments.length > 0 ? (
                    augments.map((aug, i) => (
                        <p key={i} className="tooltip-aug">• {aug}</p>
                    ))
                ) : !hasAugments && (
                    <p className="text-white/40 italic text-[11px]">No additional stats</p>
                )}
            </div>
        </TooltipContent>
    );
}
