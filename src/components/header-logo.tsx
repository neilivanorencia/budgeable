import Image from "next/image";
import Link from "next/link";

/**
 * Desktop application logo component displayed within the primary dashboard header block.
 */
export const HeaderLogo = () => {
  return (
    <Link href="/">
      {/* Structural desktop wrapper hidden on small viewports and flexed on wide screens */}
      <div className="hidden items-center gap-3 lg:flex">
        <Image
          src="/icon.svg"
          alt="Budgeable Logo"
          width={100}
          height={100}
          className="h-12 w-12 transition-transform hover:scale-105"
        />
        <span className="font-manrope text-2xl font-bold tracking-wide text-slate-100 uppercase">
          Budgeable
        </span>
      </div>
    </Link>
  );
};
