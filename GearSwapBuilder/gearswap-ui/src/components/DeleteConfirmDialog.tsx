import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    itemName: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    itemName
}: DeleteConfirmDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[111] outline-none">
                    <div className="ff-window p-6 w-[350px] space-y-4 border-2 border-red-500/20">

                        {/* Header Section */}
                        <div className="flex justify-between items-center text-red-500">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {/* WRAP YOUR TITLE HERE:
                   This satisfies the Radix requirement without changing your UI 
                */}
                                <Dialog.Title className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {title}
                                </Dialog.Title>
                            </div>
                            <Dialog.Close className="ff-interactive text-operator hover:text-white">
                                <X className="w-4 h-4" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[11px] text-operator font-medium leading-relaxed">
                                Are you sure you want to delete <span className="text-brand font-bold">"{itemName}"</span>?
                            </p>
                            {/* Optional: Add Dialog.Description for full accessibility */}
                            <Dialog.Description className="text-[10px] text-red-400/80 uppercase tracking-tight">
                                All gear assignments for this set will be permanently removed.
                            </Dialog.Description>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="ff-interactive text-[10px] font-bold uppercase tracking-widest text-operator"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onConfirm();
                                    onOpenChange(false);
                                }}
                                className="ff-interactive px-6 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest border-none"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}