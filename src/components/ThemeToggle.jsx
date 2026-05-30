import React from "react";
import { useTheme } from "next-themes";
import { Toggle } from "./ui/toggle";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Toggle
      pressed={theme === "dark"}
      onPressedChange={(pressed) =>
        setTheme(pressed ? "dark" : "light")
      }
      aria-label="Toggle theme"
      variant="outline"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Toggle>
  );
}