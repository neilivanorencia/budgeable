import Image from "next/image";

import { ClerkLoaded, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex h-full flex-col items-center justify-center p-4 md:p-6">
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
