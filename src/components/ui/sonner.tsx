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
          toast: "!font-inter !rounded-2xl !border !border-white/25 !shadow-[0_10px_20px_-3px_rgba(0,0,0,0.15),0_4px_8px_-4px_rgba(0,0,0,0.10)]",
          title: "!text-white !text-sm !font-normal",
          description: "!text-white !text-sm !font-normal",
          actionButton: "!bg-white/20 !text-white !rounded-lg",
          cancelButton: "!bg-white/10 !text-white/70 !rounded-lg",
          closeButton: "!bg-white/20 !text-white !border-0",
        },
        style: {
          fontFamily: "var(--font-inter)",
          fontWeight: "normal",
        },
      }}
      style={
        {
          "--normal-bg": "oklch(65.35% 0.124 183.61)",
          "--normal-text": "oklch(97.12% 0.006 255.09)",
          "--normal-border": "transparent",
          "--success-bg": "oklch(60.32% 0.124 163.61)",
          "--success-text": "oklch(97.12% 0.006 255.09)",
          "--success-border": "transparent",
          "--error-bg": "oklch(57.77% 0.207 27.33)",
          "--error-text": "oklch(97.12% 0.006 255.09)",
          "--error-border": "transparent",
          "--font-weight": "400",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
