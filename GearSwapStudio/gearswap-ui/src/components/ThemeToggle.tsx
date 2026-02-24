import { Sun, Moon, Monitor } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  const handleToggle = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "ffxi" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className="ff-interactive flex items-center gap-2 px-4 h-9 border-operator/20"
    >
      {theme === "light" && (
        <>
          <Sun className="h-4 w-4 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
            Modern / Light
          </span>
        </>
      )}
      {theme === "dark" && (
        <>
          <Moon className="h-4 w-4 text-operator" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-operator">
            Modern / Dark
          </span>
        </>
      )}
      {theme === "ffxi" && (
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
