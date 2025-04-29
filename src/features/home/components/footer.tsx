import Image from "next/image";
import Link from "next/link";

/**
 * Global application footer component rendering semantic brand markers and dynamic copyright rows.
 */
export const Footer = () => {
  return (
    <footer className="bg-slate-100">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-14">
        {/* Interactive primary logo anchor linking back to home routing pathways */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Budgeable home">
          <Image
            src="/icon.svg"
            alt=""
            width={100}
            height={100}
            className="size-8 transition-transform hover:scale-105"
          />
          <span className="font-manrope text-base font-bold tracking-wide text-slate-900 uppercase sm:text-lg md:text-2xl">
            Budgeable
          </span>
        </Link>

        {/* Legal notice metadata string printing runtime system calendar dates */}
        <p className="text-center text-sm text-slate-500 sm:text-right sm:text-base">
          &copy; {new Date().getFullYear()} Budgeable. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
