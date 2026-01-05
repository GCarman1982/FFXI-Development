import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ALL_PATH_ITEMS } from "@/lib/odyssey";

interface OdysseyPathPickerProps {
  itemName: string;
  value?: string;
  onValueChange: (path: string) => void;
  // New prop to trigger closing the parent UI
  onSelect?: () => void;
}

export function OdysseyPathPicker({
  itemName,
  value,
  onValueChange,
  onSelect,
}: OdysseyPathPickerProps) {
  const isOdyssey = ALL_PATH_ITEMS.some((item) =>
    itemName.toLowerCase().includes(item)
  );

  if (!isOdyssey) return null;

  const handlePathSelect = (val: string) => {
    if (val) {
      onValueChange(val);
      // Trigger the close logic if provided
      if (onSelect) onSelect();
    }
  };

  return (
    <div className="grid gap-3 pt-4 border-t border-white/10 mt-4">
      <div className="flex flex-col gap-1">
        <Label className="text-[10px] uppercase tracking-widest text-white/40 font-black">
          Odyssey Reinforcement Path
        </Label>
      </div>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handlePathSelect}
        className="grid grid-cols-4 gap-2 justify-stretch"
      >
        {["A", "B", "C", "D"].map((path) => (
          <ToggleGroupItem
            key={path}
            value={path}
            variant="outline"
            className="h-8 text-xs font-bold !rounded-none border-white/10 data-[state=on]:bg-lua-green data-[state=on]:text-black"
          >
            {path}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}