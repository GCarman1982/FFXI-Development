import { Moon, Monitor } from "lucide-react";
import { useGearStore } from "@/store/useGearStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useGearStore();

  const handleToggle = () => {
    const next = theme === "ffxi" ? "dark" : "ffxi";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className="ff-interactive flex items-center gap-2 px-4 h-9 border-operator/20"
    >
      {theme === "ffxi" ? (
        <>
          <Moon className="h-4 w-4 text-operator" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-operator">
            Modern / Dark
          </span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
            FFXI Classic
          </span>
        </>
      )}
    </Button>
  );
}
