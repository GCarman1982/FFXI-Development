import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanSetPath(path: string): string {
  return path.startsWith('sets.') ? path.substring(5) : path;
}

export function parseGearPath(path: string) {
  const cleaned = cleanSetPath(path);
  const match = cleaned.match(/^([^.\[]+)(.*)$/);

  if (!match) return { base: cleaned, variant: "" };

  return {
    base: match[1],
    variant: match[2] || ""
  };
}
