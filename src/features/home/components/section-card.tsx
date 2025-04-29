import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

/**
 * Property shape to configure content blocks, step orders, and iconography vectors.
 */
type SectionCardProps = {
  icon: IconType;
  tag: string;
  title: string;
  description: string;
  index: number;
  className?: string;
};

/**
 * Presentational grid tile to show features and directional steps with sequential numbering overlays.
 */
export const SectionCard = ({
  icon: Icon,
  tag,
  title,
  description,
  index,
  className,
}: SectionCardProps) => (
  <div
    className={cn(
      "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_10px_15px_-3px_rgba(20,184,166,0.08),0_4px_6px_-4px_rgba(20,184,166,0.05)] md:border-2",
      className
    )}
  >
    {/* Absolute context barrier frame preserving underlying structural layer events */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" />

    {/* Top utility row presenting action metrics along with a stylized padded vector item node */}
    <div className="relative flex items-center justify-between">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-500/10 ring-1 ring-teal-500/20 transition-transform duration-300 group-hover:scale-105">
        <Icon className="size-6 text-teal-600" aria-hidden="true" />
      </div>
      <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
        {String(index + 1).padStart(2, "0")} · {tag}
      </span>
    </div>

    {/* Header descriptor title string matching product copy frameworks */}
    <h3 className="font-manrope relative mt-6 text-2xl font-semibold tracking-tight text-slate-900">
      {title}
    </h3>

    {/* Analytical summary body text layer explaining explicit feature properties */}
    <p className="relative mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
      {description}
    </p>
  </div>
);
