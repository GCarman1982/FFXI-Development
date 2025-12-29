import React, { useMemo, useState } from "react";
import { useGearStore } from "@/store/useGearStore";
import { Button } from "@/components/ui/button";
import {
    Shield, Swords, Zap, Activity,
    Sparkles, Circle, Box, Folder,
    ChevronDown
} from "lucide-react";
import { AddSetDialog } from "./AddSetDialog";

export function Sidebar() {
    const { allSets, activeTab, setActiveTab, searchTerm } = useGearStore();
    const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

    const toggleCategory = (id: string) => {
        setExpandedCats(prev => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id]
        }));
    };

    const filteredSets = useMemo(() => {
        const query = (searchTerm || "").toLowerCase();
        return Object.fromEntries(
            Object.entries(allSets).filter(([path]) => 
                path.toLowerCase().includes(query)
            )
        );
    }, [allSets, searchTerm]);

    const derivedCategories = useMemo(() => {
        const categories: Record<string, { label: string; icon: any; color: string }> = {};
        const iconMap: Record<string, { icon: any; color: string }> = {
            engaged: { icon: Swords, color: 'text-red-400' },
            weapons: { icon: Box, color: 'text-orange-400' },
            precast: { icon: Zap, color: 'text-yellow-400' },
            midcast: { icon: Sparkles, color: 'text-sky-400' },
            idle: { icon: Shield, color: 'text-blue-400' },
            utility: { icon: Activity, color: 'text-emerald-400' },
        };

        Object.keys(filteredSets).forEach(path => {
            const cleanPath = path.startsWith('sets.') ? path.replace('sets.', '') : path;
            const root = cleanPath.split(/[.[]/)[0];
            if (!categories[root] && root !== "") {
                const config = iconMap[root] || { icon: Folder, color: 'text-zinc-500' };
                categories[root] = { label: root.toUpperCase(), ...config };
            }
        });
        return categories;
    }, [filteredSets]);

    // Custom sort to force IDLE to the top
    const sortedCategories = useMemo(() => {
        return Object.entries(derivedCategories).sort(([a], [b]) => {
            if (a === 'idle') return -1;
            if (b === 'idle') return 1;
            return a.localeCompare(b);
        });
    }, [derivedCategories]);

    return (
        <aside className="w-[340px] h-full border-r border-white/10 flex flex-col shrink-0 overflow-hidden
            bg-ui-window 
            [[data-theme='ffxi']_&]:bg-[linear-gradient(180deg,#000080_0%,#000033_100%)]">
            
            {/* STICKY HEADER - Transparent in FFXI mode to allow the gradient to flow behind it */}
            <div className="sticky top-0 z-20 px-5 pt-5 pb-4 border-b border-black/60 shadow-lg 
                bg-ui-window 
                [[data-theme='ffxi']_&]:bg-transparent [[data-theme='ffxi']_&]:shadow-none">
                <AddSetDialog />
            </div>

            <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-4 custom-scrollbar">
                
                {sortedCategories.map(([catId, config]) => {
                    const setsInCategory = Object.keys(filteredSets).filter(path => {
                        const clean = path.startsWith('sets.') ? path.replace('sets.', '') : path;
                        return clean === catId || clean.startsWith(`${catId}.`) || clean.startsWith(`${catId}[`);
                    });

                    const isExpanded = searchTerm ? true : (expandedCats[catId] !== false);

                    return (
                        <div key={catId} className="border-b border-white/5 pb-2">
                            <Button
                                variant="ghost"
                                onClick={() => toggleCategory(catId)}
                                className="ff-interactive w-full flex items-center justify-between px-2 py-6 h-auto text-white hover:bg-white/[0.05] group transition-all !rounded-none"
                            >
                                <div className="flex items-center gap-3">
                                    <config.icon className={`w-5 h-5 ${config.color}`} />
                                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">
                                        {config.label}
                                    </span>
                                    <span className="text-[10px] text-white/40 font-mono">
                                        ({setsInCategory.length})
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                            </Button>

                            {isExpanded && (
                                <div className="mt-1 space-y-1 border-l-2 border-white/5 ml-4 pl-3">
                                    {setsInCategory.sort().map(path => {
                                        const isActive = activeTab === path;
                                        return (
                                            <Button
                                                key={path}
                                                variant="ghost"
                                                onClick={() => setActiveTab(path)}
                                                className={`ff-interactive w-full justify-start h-auto py-2.5 px-4 transition-all relative rounded-none border-2
                                                    ${isActive 
                                                        ? "ff-window border-brand bg-white/[0.08] text-white" 
                                                        : "border-transparent text-white/50 hover:text-white hover:bg-white/[0.03]"
                                                    }
                                                `}
                                            >
                                                <Circle className={`w-2 h-2 mr-3 transition-all ${
                                                    isActive 
                                                    ? 'text-brand drop-shadow-[0_0_5px_rgba(var(--brand-rgb),0.8)]' 
                                                    : 'text-white/10'
                                                }`} />
                                                
                                                <span className={`text-[11px] font-mono truncate tracking-tight uppercase ${isActive ? 'font-black' : 'font-medium'}`}>
                                                    {path.replace('sets.', '')}
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}