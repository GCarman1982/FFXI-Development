import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGearStore } from "../store/useGearStore";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";

export function AddVariantDialog() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const { activeTab, addSet } = useGearStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            addSet(`${activeTab}.${value.trim()}`);
            setValue("");
            setOpen(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="ff-window ff-interactive group flex items-center justify-center gap-2 w-full h-14 border-dashed border-operator/20 bg-transparent transition-all mt-4 hover:border-brand/50 px-4">
                    <Plus className="w-4 h-4 text-operator group-hover:text-brand transition-colors" />
                    <span className="text-[10px] font-bold text-operator uppercase tracking-[0.2em] group-hover:text-brand transition-colors">
                        Add Custom {activeTab} Variant
                    </span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[400px] z-50 focus:outline-none">
                    <div className="ff-window p-6 space-y-4 border-2 border-white/10">
                        <div className="flex justify-between items-center">
                            <Dialog.Title className="text-[10px] font-bold text-operator uppercase tracking-[0.2em]">
                                New <span className="text-lua-orange">{activeTab}</span> Variant
                            </Dialog.Title>

                            {/* ACCESSIBILITY FIX: Hidden Description */}
                            <Dialog.Description className="sr-only">
                                Enter a suffix for your {activeTab} gear set variant.
                            </Dialog.Description>

                            <Dialog.Close className="ff-interactive text-operator hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </Dialog.Close>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-tighter text-operator/60">Variant Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-black/40 border border-operator/20 p-3 text-white font-mono text-sm focus:border-brand outline-none transition-colors"
                                    placeholder="e.g. Sphere, DT, Refresh..."
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                    className="ff-interactive text-[10px] font-bold uppercase tracking-widest text-operator"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    className="ff-interactive px-8 bg-brand text-active-text text-[10px] font-bold uppercase tracking-widest border-none"
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