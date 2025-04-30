"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

/**
 * Authentication client page displaying the unified sign-in terminal.
 */
export default function Page() {
  // Tracking state to determine if the component has mounted on the client
  const [isMounted, setIsMounted] = useState(false);

  // Sets the `isMounted` flag to `true` after the initial client-side render pass
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Renders a structural shell loading state during server pre-rendering to eliminate layout shift
  if (!isMounted) {
    return (
      <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
        {/* Placeholder wrapper matching the dimensions of the sign-in column */}
        <div className="flex h-full flex-col items-center justify-center p-4 md:p-6">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
            </div>
          </div>
        </div>
        {/* Placeholder wrapper matching the dimensions of the branding column */}
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
      {/* Interactive left column containing the authentication terminal forms */}
      <div className="flex h-full flex-col items-center justify-center p-4 md:p-6">
        {/* Displays a standalone spinner element while the Clerk library assets are fetching */}
        <ClerkLoading>
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
            </div>
          </div>
        </ClerkLoading>
        {/* Mounts the interactive sign-in card component once the provider is ready */}
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

      {/* Decorative side panel rendering image on desktop viewports */}
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
