import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGearStore } from "@/store/useGearStore";
import { X, Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AddSetDialog } from "./AddSetDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export function TopNav() {
  const { allSets, activeTab, setActiveTab, removeSet } = useGearStore();

  // State to track which category we are currently asking to delete
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Generate unique categories only if they have associated sets
  const categories = Array.from(
    new Set(
      Object.keys(allSets)
        .map((n) => n.split(".")[0])
        .filter((cat) => {
          // Ensure there is at least one key that starts with this category
          return Object.keys(allSets).some(key => key.split('.')[0] === cat);
        })
    )
  );

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-border bg-panel shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4 pr-6 border-r border-border/50 mr-4">
          <div className="flex flex-col leading-[0.75]">
            <h1 className="app-title text-xl font-black tracking-tighter uppercase transition-colors">
              Gearswap
            </h1>
            <span className="text-[11px] font-black text-operator uppercase tracking-[0.38em] mt-0.5">
              STUDIO
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={activeTab.split('.')[0]}
          onValueChange={setActiveTab}
          className="w-auto"
        >
          <TabsList className="bg-background/40 border border-border h-11 p-1 gap-1 overflow-visible">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                asChild
              >
                <div className="ff-interactive relative flex items-center gap-3 h-9 px-4 cursor-pointer rounded-md transition-all 
                text-operator 
                data-[state=active]:bg-brand 
                data-[state=active]:text-black 
                group"
                >
                  <span className="text-xs font-bold capitalize select-none drop-shadow-none">
                    {cat}
                  </span>

                  {/* Delete Category Trigger */}
                  {cat !== 'idle' && cat !== 'engaged' && (
                    <Button
                      type="button" // Prevents accidental form submissions
                      aria-label={`Delete ${cat} category`} // Tells screen readers what the "X" does
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(cat);
                      }}
                      className="p-1 rounded-md hover:bg-red-500/20 text-operator hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" /> {/* Icon is decorative, label is on button */}
                    </Button>
                  )}
                </div>
              </TabsTrigger>
            ))}

            <AddSetDialog />
          </TabsList>
        </Tabs>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="h-6 w-[1px] bg-border mx-2" />

        <Button
          variant="outline"
          size="sm"
          className="ff-interactive gap-2 border-brand/30 text-brand hover:bg-brand/10 transition-all ff-window border-none"
          onClick={() => alert("Generating Lua...")}
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Export .Lua</span>
        </Button>
      </div>

      {/* Themed Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            removeSet(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        title="Delete Category"
        itemName={deleteTarget || ""}
      />
    </header>
  );
}