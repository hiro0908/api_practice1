"use client";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { darkModeAtom } from "@/src/state/settingsAtom";

export function ThemeSync() {
  const darkMode = useAtomValue(darkModeAtom);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
}
