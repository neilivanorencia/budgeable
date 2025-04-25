"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";

import { cn } from "@/lib/utils";

type Props = {
  value?: string | null;
  onChange: (color: string) => void;
  disabled?: boolean;
};

export const ColorPicker = ({ value, onChange, disabled }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentColor = value ?? "#14b8a6";

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-md border bg-transparent px-3 py-1 text-sm shadow-none transition-colors outline-none md:border-2",
          "hover:border-teal-500 focus-visible:border-teal-500 focus-visible:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "border-teal-500"
        )}
      >
        <span
          className="size-5 shrink-0 rounded-md border border-black/10"
          style={{ backgroundColor: currentColor }}
        />
        <span className={cn("font-mono text-sm tracking-wide", !value && "text-muted-foreground")}>
          {value ? value.toUpperCase() : "Pick a color"}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-[9999] mt-1 rounded-2xl border bg-white p-3 shadow-[0_10px_15px_-3px_rgba(30,25,20,0.06),0_4px_6px_-4px_rgba(30,25,20,0.04)]"
          style={{ zIndex: 9999 }}
        >
          <HexColorPicker color={currentColor} onChange={onChange} />
          <input
            type="text"
            value={value ?? ""}
            onChange={handleHexInput}
            placeholder="#000000"
            maxLength={7}
            spellCheck={false}
            className="mt-2 w-full rounded-md border px-3 py-1.5 font-mono text-sm transition-colors outline-none focus:border-teal-500 md:border-2"
          />
        </div>
      )}
    </div>
  );
};
