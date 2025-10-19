import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (value: string | null | undefined) => {
  if (!value) return "";
  const words = value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase());

  if (words.length === 0) {
    return value.slice(0, 2).toUpperCase();
  }

  return words.slice(0, 2).join("");
};
