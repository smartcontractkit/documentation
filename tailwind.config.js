import baseConfig from "@chainlink/blocks/src/theme/base"
/** @type {import('tailwindcss').Config} */

export default {
  ...baseConfig,
  // Skip MDX pages (src/content) and blocks' ~3,700 icon files: neither adds a class, but they were ~80% of
  // Tailwind's cold start, and watching the MDX rebuilt the CSS on every save. Keep `!(content)` a positive
  // glob (Tailwind ignores negations when choosing files to watch), and keep Tailwind classes out of MDX.
  content: [
    "./src/!(content)/**/*.{html,js,jsx,md,mdx,ts,tsx}",
    "./src/*.{html,js,jsx,md,mdx,ts,tsx}",
    "node_modules/@chainlink/blocks/**/*.{ts,tsx}",
    "!node_modules/@chainlink/blocks/src/icons/library/**",
  ],
}
