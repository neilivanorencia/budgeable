import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["scripts/**/*.ts", "src/components/ui/**", "src/lib/seed.ts"],
  project: ["src/**/*.{ts,tsx}", "scripts/**/*.ts"],
  ignoreDependencies: [
    "tw-animate-css",
    "prettier-plugin-tailwindcss",
    "eslint",
    "eslint-config-next",
    "tailwindcss",
    "postcss",
  ],
};

export default config;
