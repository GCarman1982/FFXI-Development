import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGearStore } from "../store/useGearStore";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddSetDialog() {
    const [open, setOpen] = useState(false);
    const [setName, setSetName] = useState("");
    const { addSet, setActiveTab } = useGearStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (setName.trim()) {
            const formattedName = setName.trim().startsWith('sets.')
                ? setName.trim()
                : `sets.${setName.trim()}`;

            addSet(formattedName);
            setActiveTab(formattedName);
            setSetName("");
            setOpen(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "ff-window ff-interactive w-full border-dashed border-white/20 bg-white/[0.05] text-white hover:text-brand transition-all h-12 flex items-center justify-center gap-2 group",
                        "classic:rounded-none dark:rounded-xl"
                    )}
                >
                    <Plus className="w-4 h-4 text-brand transition-transform group-hover:rotate-90" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Add New Set
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
                            <Dialog.Title className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                                Create <span className="text-brand">New Gear Set</span>
                            </Dialog.Title>
                            <Dialog.Close className="ff-interactive text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </Dialog.Close>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold">
                                    Set Path Name
                                </label>
                                <Input
                                    autoFocus
                                    className={cn(
                                        "w-full bg-black/40 border border-white/10 p-3 font-mono text-sm focus:border-brand/50 outline-none transition-all placeholder:text-white/10",
                                        "text-[var(--active-text)]", // Keeps text readable in both themes
                                        "classic:rounded-none dark:rounded-lg"
                                    )}
                                    placeholder="e.g. idle.town"
                                    value={setName}
                                    onChange={(e) => setSetName(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
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
                                        // Logic: 
                                        // 1. "text-[var(--active-text)]" uses your CSS variables:
                                        //    Dark mode -> #ffffff (White)
                                        //    FFXI mode -> #000000 (Black)
                                        // 2. We use "!" to override the hover logic in index.css
                                        "!text-[var(--active-text)]",

                                        // Rounding logic (kept exactly as you requested)
                                        "classic:rounded-none dark:rounded-lg"
                                    )}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}