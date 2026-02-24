import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGearStore } from "../store/useGearStore";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function AddVariantDialog() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const { activeTab, addSet, setActiveTab } = useGearStore();

    // Reset state and close
    const handleClose = () => {
        setValue("");
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { allSets } = useGearStore.getState();

        // Find the "True Base" of the active tab to append variant to
        const getBaseSetPath = (path: string) => {
            const cleanPath = path.startsWith('sets.') ? path : `sets.${path}`;
            const parts = cleanPath.split('.');
            // parts[0] is 'sets', parts[1] is the root category (e.g. 'midcast')
            // We want to find the shortest prefix that exists in allSets
            // but is at least 'sets.category'
            for (let i = 2; i <= parts.length; i++) {
                const potentialBase = parts.slice(0, i).join('.');
                if (allSets[potentialBase]) return potentialBase;
            }
            return cleanPath;
        };

        const basePath = getBaseSetPath(activeTab);

        if (value.trim()) {
            const newPath = `${basePath}.${value.trim()}`;
            addSet(newPath);
            setActiveTab(newPath);
            handleClose();
        }
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setValue(""); // Clears on click-away or ESC
                setOpen(isOpen);
            }}
        >
            <Dialog.Trigger asChild>
                <Button className="ff-window ff-interactive group flex items-center justify-center gap-2 px-4 py-2 h-auto border-dashed border-white/20 bg-transparent transition-all hover:border-brand/50 classic:rounded-none">
                    <Plus className="w-3 h-3 text-operator group-hover:text-brand transition-colors" />
                    <span className="text-[10px] font-bold text-operator uppercase tracking-[0.2em] group-hover:text-brand transition-colors">
                        Add Variant
                    </span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[400px] z-[101] focus:outline-none">
                    <div className={cn(
                        "ff-window p-6 space-y-4 border-2 border-white/10 bg-ui-window shadow-2xl transition-all",
                        "classic:rounded-none dark:rounded-2xl"
                    )}>
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                            <Dialog.Title className="text-[10px] font-bold text-white ffxi:text-white uppercase tracking-[0.2em]">
                                New Variant
                            </Dialog.Title>

                            {/* ACCESSIBILITY FIX: Hidden Description */}
                            <Dialog.Description className="sr-only">
                                Enter a suffix for your {activeTab} gear set variant.
                            </Dialog.Description>

                            <Dialog.Close className="ff-interactive text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </Dialog.Close>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-widest text-white/40 ffxi:text-white/60 font-bold">
                                    Variant Name (Suffix)
                                </label>
                                <input
                                    autoFocus
                                    className={cn(
                                        "w-full bg-black/40 border border-white/10 p-3 font-mono text-sm focus:border-brand/50 outline-none transition-all placeholder:text-white/10",
                                        "text-white ffxi:text-white",
                                        "classic:rounded-none dark:rounded-lg"
                                    )}
                                    placeholder="e.g. DT, Acc, Magic"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleClose}
                                    className={cn(
                                        "ff-interactive text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white",
                                        "classic:rounded-none rounded-lg"
                                    )}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className={cn(
                                        "ff-interactive px-8 bg-brand font-bold text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)] border-none",
                                        "ffxi:!text-black !text-white",
                                        "classic:rounded-none dark:rounded-lg"
                                    )}
                                >
                                    Create Set
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}