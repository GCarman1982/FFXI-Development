import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGearStore } from "../store/useGearStore";
import { Button } from "./ui/button"; // Your themed button
import { Plus, X } from "lucide-react";

export function AddSetDialog() {
    const [open, setOpen] = useState(false);
    const [setName, setSetName] = useState("");
    const { addSet } = useGearStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (setName.trim()) {
            // Logic to create a top-level set (e.g., 'Idle')
            // Note: adjust 'addSet' parameters based on your store's structure
            addSet(setName.trim());
            setSetName("");
            setOpen(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    className="ff-interactive h-9 px-4 gap-2 border-brand/30 hover:border-brand"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Set</span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[400px] z-[101] focus:outline-none">
                    <div className="ff-window p-6 space-y-4 border-2 border-white/10">
                        <div className="flex justify-between items-center">
                            <Dialog.Title className="text-[10px] font-bold text-operator uppercase tracking-[0.2em]">
                                Create <span className="text-brand">New Gear Set</span>
                            </Dialog.Title>
                            <Dialog.Description className="sr-only">
                                Enter a name to create a new category for your gearswap sets.
                            </Dialog.Description>
                            <Dialog.Close className="ff-interactive text-operator hover:text-white">
                                <X className="w-4 h-4" />
                            </Dialog.Close>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-tighter text-operator/60">Set Category Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-black/40 border border-operator/20 p-3 text-white font-mono text-sm focus:border-brand outline-none transition-colors"
                                    placeholder="e.g. Idle, Engaged, Precast..."
                                    value={setName}
                                    onChange={(e) => setSetName(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
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
                                    className="ff-interactive px-8 bg-brand text-active-text text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Create
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}