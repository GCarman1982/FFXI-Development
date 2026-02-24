import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useGearStore } from '@/store/useGearStore';
import { Button } from './ui/button';

export function ClearAllDialog() {
  const clearSets = useGearStore((state) => state);
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="ff-interactive flex items-center gap-2 px-3 py-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer rounded-md">
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Clear All</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[400px] ff-window bg-ui-window border border-red-900/50 p-6 shadow-2xl z-50">

          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-black uppercase tracking-tighter text-zinc-100 light:text-slate-800">
                Purge All Sets?
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-zinc-400 light:text-slate-600 leading-relaxed">
                This will delete <span className="text-red-400 font-bold">every gear set</span> currently in your studio.
                Unless you have a backup of your .lua file, this action is permanent.
              </Dialog.Description>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Dialog.Close asChild>
              <button className="ff-interactive px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 light:text-slate-500 light:hover:text-black transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={() => {
                setOpen(false);
              }}
              className="ff-interactive px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-lg shadow-red-900/20 transition-all active:scale-95"
            >
              Confirm Purge
            </button>
          </div>

          <Dialog.Close asChild>
            <Button variant="ghost" className="absolute top-4 right-4 h-6 w-6 p-0 text-zinc-600 hover:text-zinc-400 light:text-slate-400 light:hover:text-black">
              <X size={16} />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}