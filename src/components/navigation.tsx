"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  return <div></div>;
};
