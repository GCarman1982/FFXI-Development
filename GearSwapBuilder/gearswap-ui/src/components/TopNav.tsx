import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGearStore } from "@/store/useGearStore";
import { Download, Upload, Trash2, Swords, Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { parseLuaToSets } from "@/lib/luaImporter";

export function TopNav() {
  const { 
    allSets, 
    importSets, 
    clearSets, 
    setActiveTab, 
    searchTerm, 
    setSearchTerm,
    setLuaCode 
  } = useGearStore();

  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSets = Object.keys(allSets || {}).length > 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        setLuaCode(text); 
        
        // 1. Destructure the sets and the logs from the parser result
        const { sets, logs } = parseLuaToSets(text);

        // 2. Import the data into the store
        importSets(sets);

        // 3. Log the results to the browser console for debugging
        console.group("Gearswap Import Log");
        console.log(`Successfully parsed ${Object.keys(sets).length} gear sets.`);
        
        // Filter for any warnings or errors
        const issues = logs.filter(l => l.status !== 'success');
        if (issues.length > 0) {
          console.warn("Issues found during import:", issues);
        } else {
          console.log("All sets parsed cleanly.");
        }

        // Specifically check for your 'Dark Magic' set in the logs
        const darkMagicCheck = logs.find(l => l.path?.includes('Dark Magic'));
        if (!darkMagicCheck) {
          console.error("DEBUG: 'Dark Magic' set was not found by the parser regex!");
        }

        console.table(logs); // Gives you a nice scannable table in the console
        console.groupEnd();

        // 4. Set the Active Tab
        const paths = Object.keys(sets);
        const idlePath = paths.find(p => p.toLowerCase().includes('idle')) || paths[0];
        if (idlePath) setActiveTab(idlePath);

      } catch (err) {
        console.error("Critical Failure in handleFileUpload:", err);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Left Side: Job Identity */}
        <div className="flex items-center gap-4 shrink-0 w-[280px]">
          <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center shadow-[0_0_15px_rgba(var(--brand-rgb),0.2)]">
            <Swords className="text-brand w-5 h-5" />
          </div>
          <div>
            <h1 className="app-title text-sm">
              GearSwap <span className="text-white">Studio</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Samurai / Level 99
            </p>
          </div>
        </div>

        {/* Center: Search Input */}
        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10 lucide-search" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sets or items..."
            // Using your variables for the input
            className="w-full bg-white/5 border-white/10 pl-10 pr-10 text-xs text-white focus-visible:ring-1 focus-visible:ring-brand h-9 ff-window !rounded-none"
          />
          
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-500 hover:text-white z-10 ff-interactive"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <div className="w-[1px] h-6 bg-white/10 mx-1" />

          <Input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".lua" className="hidden" id="lua-file-import" />

          <Button
            variant="ghost"
            className="ff-interactive text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2 text-brand" />
            Import
          </Button>

          <Button variant="ghost" className="ff-interactive text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-white">
            <Download className="w-4 h-4 mr-2 text-brand" />
            Export
          </Button>

          {hasSets && (
            <Button
              onClick={() => setShowPurgeConfirm(true)}
              className="ff-interactive h-9 px-4 !bg-red-600/10 hover:!bg-red-600 !text-red-500 hover:!text-white text-[10px] font-bold uppercase tracking-widest !border !border-red-600/30 transition-all !shadow-none !ring-0 !outline-none"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          )}
        </div>
      </div>

      <DeleteConfirmDialog
        open={showPurgeConfirm}
        onOpenChange={setShowPurgeConfirm}
        onConfirm={() => {
          clearSets();
          setShowPurgeConfirm(false);
          setActiveTab('idle');
        }}
        title="Purge All Data"
        itemName="ALL gear sets and imported Lua data"
      />
    </nav>
  );
}