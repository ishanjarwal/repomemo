"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";

const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();

  const onThemeChange = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [theme]);

  return (
    <div>
      <Button
        className="rounded-full"
        onClick={onThemeChange}
        variant={"ghost"}
        size={"icon"}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
};

export default ThemeToggleButton;
