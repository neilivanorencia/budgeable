"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "!font-inter",
          title: "!text-slate-100 !text-sm !font-normal",
          description: "!text-slate-100 !text-sm !font-normal",
        },
        style: {
          fontFamily: "var(--font-inter)",
          fontWeight: "normal",
        },
      }}
      style={
        {
          "--normal-bg":
            "linear-gradient(to right, oklch(75.54% 0.124 183.61), oklch(65.35% 0.124 183.61))",
          "--normal-text": "oklch(97.12% 0.006 255.09)",
          "--normal-border": "var(--border)",
          "--font-weight": "400",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
