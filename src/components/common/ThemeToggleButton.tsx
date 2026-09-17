"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait until the component has mounted so server/client HTML matches.
    setMounted(true);
  }, []);

  const onThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Don't render theme-dependent UI during SSR.
  if (!mounted) {
    return (
      <div>
        <Button
          className="rounded-full"
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
        >
          <Moon />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        className="rounded-full"
        onClick={onThemeChange}
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};

export default ThemeToggleButton;
