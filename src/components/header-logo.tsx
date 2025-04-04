import Image from "next/image";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center gap-3 lg:flex">
        <Image
          src="/icon.svg"
          alt="Budgeable Logo"
          width={100}
          height={100}
          className="h-12 w-12 transition-transform hover:scale-105"
        />
        <span className="font-manrope text-2xl tracking-wide font-bold uppercase text-slate-100">Budgeable</span>
      </div>
    </Link>
  );
};
