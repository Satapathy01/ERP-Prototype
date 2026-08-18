"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const OPTIONS = [
  {
    value: "light" as const,
    label: "Light theme",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Dark theme",
    icon: Moon,
  },
  {
    value: "system" as const,
    label: "System theme",
    icon: Monitor,
  },
];

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeSegmentControl({
  className,
}: {
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-full animate-pulse rounded-full bg-muted",
          className,
        )}
        aria-hidden
      />
    );
  }

  const active = theme ?? "system";

  return (
    <div
      className={cn(
        "flex w-fit gap-0.5 rounded-md border border-border/30 bg-muted p-0.5",
        className,
      )}
      role="group"
      aria-label="Theme"
    >
      {OPTIONS.map(
        ({
          value,
          label,
          icon: Icon,
        }) => {
          const isOn = active === value;

          return (
            <Button
              key={value}
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => setTheme(value)}
              aria-label={label}
              aria-pressed={isOn}
              className={cn(
                "flex flex-1 items-center justify-center py-2 text-sm outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isOn
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/70"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
            </Button>
          );
        },
      )}
    </div>
  );
}