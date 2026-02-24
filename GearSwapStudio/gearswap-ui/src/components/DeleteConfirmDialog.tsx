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
  const isPurge = title.toLowerCase().includes('purge');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* FIX: We move centering logic here using flex. 
          This keeps the content pixel-perfect and prevents the blur.
        */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">

          <Dialog.Content
            /* REMOVED: translate-x and translate-y (the cause of the blur)
               KEEP: ff-window and width constraints
            */
            className="relative ff-window p-6 w-full max-w-[350px] space-y-4 shadow-2xl outline-none"
            data-critical={isPurge}
            // Explicitly force hardware acceleration without translation to keep text sharp
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          >
            {/* Header Section */}
            <div className="flex justify-between items-center text-red-500">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <Dialog.Title className="text-[10px] font-bold uppercase tracking-[0.2em] text-inherit">
                  {title}
                </Dialog.Title>
              </div>
              <Dialog.Close className="ff-interactive text-operator hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-operator font-medium leading-relaxed">
                Are you sure you want to {isPurge ? "purge" : "delete"} <span className="text-brand font-bold">"{itemName}"</span>?
              </p>
              <Dialog.Description className="text-[10px] text-red-400/80 uppercase tracking-tight">
                {isPurge
                  ? "This will wipe every set. This action cannot be undone."
                  : "All gear assignments for this set will be permanently removed."
                }
              </Dialog.Description>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  className="ff-interactive text-[10px] font-bold uppercase tracking-widest text-operator cursor-pointer"
                >
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                /* 1. Removed 'ff-interactive' and 'dialog-submit-btn' which were likely carrying the blue CSS.
                   2. Added '!shadow-none' and '!ring-0' to suppress the blue glow.
                   3. Added a red glow 'hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]' to replace it.
                */
                className="relative px-6 !bg-red-600 hover:!bg-red-500 !text-white text-[10px] font-bold uppercase tracking-widest !border-none cursor-pointer transition-all duration-200 !shadow-none hover:!shadow-[0_0_15px_rgba(220,38,38,0.5)] !ring-0 !outline-none"
              >
                {isPurge ? "Confirm Purge" : "Delete"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}