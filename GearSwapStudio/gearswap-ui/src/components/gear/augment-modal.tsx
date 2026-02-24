import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isOdysseyItem } from "@/lib/odyssey";
import { ManualAugmentPicker } from "./manual-augment-picker";
import { OdysseyPathPicker } from "./odyssey-path-picker";

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
            <DialogContent className="ff-window text-white light:text-slate-800 border-white/10 bg-ui-window !rounded-none shadow-2xl">
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

                <DialogFooter className="mt-2">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-lua-green text-black hover:bg-lua-green/80 active:scale-95 transition-all duration-200 !rounded-none font-bold px-8"
                    >
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}