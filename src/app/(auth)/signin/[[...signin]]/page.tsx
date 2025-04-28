"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
        <div className="flex h-full flex-col items-center justify-center p-4 md:p-6">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
            </div>
          </div>
        </div>
        <div className="relative hidden h-full items-center justify-center overflow-hidden bg-teal-500 lg:flex">
          <div className="absolute inset-0 z-10 bg-gradient-to-tl from-teal-600/80 to-teal-100/10" />
          <Image
            src="/auth-image.jpg"
            alt="Budgeable Authentication"
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 0vw, 50vw"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <div className="flex h-full flex-col items-center justify-center p-4 md:p-6">
        <ClerkLoading>
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
            </div>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <div className="mx-auto w-full max-w-lg">
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: "#14b8a6",
                  colorBackground: "white",
                  colorInputBackground: "white",
                  colorNeutral: "#e2e8f0",
                  colorText: "#1f2937",
                  colorTextSecondary: "#64748b",
                  borderRadius: "0.5rem",
                  fontFamily: "inherit",
                },
              }}
            />
          </div>
        </ClerkLoaded>
      </div>

      <div className="relative hidden h-full items-center justify-center overflow-hidden bg-teal-500 lg:flex">
        <div className="absolute inset-0 z-10 bg-gradient-to-tl from-teal-600/80 to-teal-100/10" />
        <Image
          src="/auth-image.jpg"
          alt="Budgeable Authentication"
          className="object-cover"
          fill
          priority
        />
      </div>
    </div>
  );
}
