import * as React from "react";
import { Plus, X, ChevronsUpDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import augmentData from "@/data/augments.json";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 1. Clean the list: Remove duplicates, junk text, and stats without placeholders
const ALL_STATS = Array.from(
  new Set(
    (Object.values(augmentData) as string[]).filter((stat) => {
      const text = stat.toLowerCase();
      const hasPlaceholder = text.includes("%");
      const isJunk =
        text.includes(":") ||
        text.includes("materials") ||
        text.includes("upgrade") ||
        text.includes("increases") ||
        text.length > 40;

      return hasPlaceholder && !isJunk;
    })
  )
).sort();

interface ManualAugmentPickerProps {
  currentAugments: string[];
  onUpdate: (augments: string[]) => void;
}

// --- SUB-COMPONENT: Sortable Augment Badge ---
function SortableAugment({ id, value, onRemove }: { id: string; value: string; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 bg-brand/10 border border-brand/30 px-2 py-1 text-[11px] text-brand font-bold touch-none transition-colors ${isDragging ? "opacity-50 border-brand shadow-lg bg-brand/20" : ""
        }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:text-white/80 mr-1">
        <GripVertical size={12} />
      </div>
      <span>{value}</span>
      <X
        size={12}
        className="cursor-pointer hover:text-white ml-1"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </div>
  );
}

// --- MAIN COMPONENT ---
export function ManualAugmentPicker({ currentAugments, onUpdate }: ManualAugmentPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [newValue, setNewValue] = React.useState("");
  const [selectedStat, setSelectedStat] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Setup Sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Auto-focus the search box when popover opens
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentAugments.indexOf(active.id as string);
      const newIndex = currentAugments.indexOf(over.id as string);
      onUpdate(arrayMove(currentAugments, oldIndex, newIndex));
    }
  };

  const addAugment = () => {
    if (!selectedStat || !newValue) return;

    const val = newValue.trim();

    // 2. Handle both %d (raw) and %+d (signed) placeholders
    let formattedStat = selectedStat;

    // Handle %+d: Force a sign (+ or -)
    formattedStat = formattedStat.replace(/%\+d/g, () => {
      // If user typed 10 -> +10. If user typed -5 -> -5.
      if (val.startsWith("+") || val.startsWith("-")) return val;
      return `+${val}`;
    });

    // Handle %d: Use raw value (usually stripped of leading +, but keeping -)
    formattedStat = formattedStat.replace(/%d/g, () => {
      // If template is just %d, we probably just want the number.
      // But if the user typed "-5", we keep "-5".
      return val;
    });

    // 3. Clean up double percent signs (escape sequence in C-style)
    formattedStat = formattedStat.replace(/%%/g, "%");

    const finalString = formattedStat.trim();

    // Prevent adding the exact same augment string twice
    if (!currentAugments.includes(finalString)) {
      onUpdate([...currentAugments, finalString]);
    }

    setSelectedStat("");
    setNewValue("");
  };

  return (
    <div className="space-y-4">
      <Label className="text-[10px] font-black uppercase text-white/40 tracking-widest">
        Manual Augments
      </Label>

      {/* DRAG AND DROP AREA */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
          <SortableContext items={currentAugments} strategy={horizontalListSortingStrategy}>
            {currentAugments.map((aug) => (
              <SortableAugment
                key={aug}
                id={aug}
                value={aug}
                onRemove={() => onUpdate(currentAugments.filter((a) => a !== aug))}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* SELECTION UI */}
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 justify-between ff-interactive !rounded-none border-white/10 text-xs text-left"
            >
              <span className="truncate">{selectedStat || "Select Stat..."}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-0 ff-window !rounded-none border-white/10 bg-zinc-950 z-[100]"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command className="bg-transparent flex flex-col h-[350px]">
              <div className="p-2 border-b border-white/10">
                <CommandInput ref={inputRef} placeholder="Search FFXI Stats..." className="h-8" />
              </div>

              <div
                className="flex-1 overflow-y-auto custom-scrollbar pointer-events-auto"
                onWheel={(e) => e.stopPropagation()}
              >
                <CommandList className="max-h-none overflow-visible">
                  <CommandEmpty className="p-4 text-[11px] text-white/40">No stat found.</CommandEmpty>
                  <CommandGroup>
                    {ALL_STATS.map((stat, index) => (
                      <CommandItem
                        key={`${stat}-${index}`}
                        onSelect={() => {
                          setSelectedStat(stat);
                          setOpen(false);
                        }}
                        className="text-[11px] py-2 px-3 ff-interactive hover:bg-white/5 cursor-pointer aria-selected:bg-white/10"
                      >
                        {stat}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Val"
          className="w-16 ff-interactive !rounded-none border-white/10 text-center"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAugment()}
        />

        <Button
          onClick={addAugment}
          className="bg-lua-green text-black hover:bg-lua-green/80 !rounded-none px-3 font-bold"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}