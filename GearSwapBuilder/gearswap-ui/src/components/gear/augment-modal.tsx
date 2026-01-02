import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { isOdysseyItem } from "@/lib/odyssey";
import { ManualAugmentPicker } from "./manual-augment-picker";
import { OdysseyPathPicker } from "./odyssey-path-picker"; // Import the component

interface AugmentModalProps {
    item: {
        name: string;
        path?: string;
        rank?: number;
        augments?: string[]
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (data: any) => void;
}

export function AugmentModal({ item, isOpen, onOpenChange, onUpdate }: AugmentModalProps) {
    const isOdyssey = isOdysseyItem(item.name);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="ff-window border-white/10 bg-zinc-950 text-white !rounded-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-brand font-black italic uppercase tracking-widest">
                        Modify {item.name}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Select an Odyssey path or manage manual augments.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isOdyssey ? (
                        /* Path Selection Only - Rank removed */
                        <div className="space-y-3">
                            <OdysseyPathPicker
                                itemName={item.name}
                                value={item.path}
                                onValueChange={(v) => onUpdate({ ...item, path: v })}
                                onSelect={() => onOpenChange(false)} 
                            />
                        </div>
                    ) : (
                        /* Manual Picker for non-Odyssey items */
                        <div className="space-y-6">
                            <ManualAugmentPicker
                                currentAugments={item.augments || []}
                                onUpdate={(newAugs) => onUpdate({ ...item, augments: newAugs })}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}