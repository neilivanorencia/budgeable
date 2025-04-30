import type { Metadata } from "next";
import "@/app/globals.css";

import { Inter, Manrope } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

// Configures the primary body copy typography layout settings
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configures the stylistic heading and brand accent typography settings
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

/**
 * Global Search Engine Optimization (SEO) configuration dictionary parameters
 */
export const metadata: Metadata = {
  title: "Budgeable — A Simple Minimalistic Financial Tracker",
  description:
    "Budgeable is a comprehensive personal finance and budgeting web application designed to help users track their expenses, manage budgets, and gain insights into their spending habits. It has a simple, modern design with easy-to-understand data visualizations and integrates with Plaid for bank account synchronization, so that financial data is always up-to-date and easily accessible.",
  metadataBase: new URL("https://budgeable.vercel.app/"),
  keywords: [
    "budgeable",
    "personal finance",
    "budgeting app",
    "expense tracker",
    "financial management",
    "money management",
    "spending tracker",
    "Plaid integration",
    "bank account sync",
    "CSV import",
    "transaction management",
    "financial planning tool",
    "budget planner",
    "data visualization",
    "account organization",
    "category management",
    "financial insights",
  ],
  authors: [{ name: "Neil Ivan Orencia", url: "https://github.com/neilivanorencia" }],
  creator: "Neil Ivan Orencia",
  publisher: "Neil Ivan Orencia",
  openGraph: {
    type: "website",
    title: "Budgeable — A Simple Minimalistic Financial Tracker",
    description:
      "Budgeable is a comprehensive personal finance and budgeting web application designed to help users track their expenses, manage budgets, and gain insights into their spending habits. It has a simple, modern design with easy-to-understand data visualizations and integrates with Plaid for bank account synchronization, so that financial data is always up-to-date and easily accessible.",
    url: "https://budgeable.vercel.app/",
    siteName: "Budgeable",
    images: [
      {
        url: "/website-preview.png",
        width: 2400,
        height: 1260,
        alt: "Budgeable Website Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budgeable — A Simple Minimalistic Financial Tracker",
    description:
      "Budgeable is a comprehensive personal finance and budgeting web application designed to help users track their expenses, manage budgets, and gain insights into their spending habits. It has a simple, modern design with easy-to-understand data visualizations and integrates with Plaid for bank account synchronization, so that financial data is always up-to-date and easily accessible.",
    images: [
      {
        url: "/website-preview.png",
        width: 2400,
        height: 1260,
        alt: "Budgeable Website Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://budgeable.vercel.app/",
  },
  applicationName: "Budgeable",
  manifest: "/site.webmanifest",
};

/**
 * High-level core application configuration layout template root structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          // Strips development mode logging overhead messages out of user interface panels
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${manrope.variable} antialiased`}>
          {/* Orchestrates async data-fetching layer cache pools globally */}
          <QueryProvider>
            {/* Registers client side tracking modals and slides into application memory */}
            <SheetProvider />

            {/* System banner toast alert overlay element mapping active mutations */}
            <Toaster />

            {/* Gracefully captures streaming routing chunks during dynamic parameters hydration */}
            <Suspense>{children}</Suspense>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
