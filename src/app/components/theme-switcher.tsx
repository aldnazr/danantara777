// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { themes, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-x-2">
      {themes.map((t) => (
        <Button
          key={t}
          className="capitalize"
          onPress={() => setTheme(`${t}`)}
        >{`${t} Mode`}</Button>
      ))}
    </div>
  );
}
