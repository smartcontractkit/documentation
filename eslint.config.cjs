// eslint.config.cjs

const { configs: eslintConfigs } = require("@eslint/js")
const neostandard = require("neostandard")
const prettierPlugin = require("eslint-plugin-prettier")
const prettierConfig = require("eslint-config-prettier")

module.exports = [
  {
    // ES2021 language features
    ...eslintConfigs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        // Node.js globals
        process: true,
        __dirname: true,
        __filename: true,
        module: true,
        require: true,
        global: true,
      },
    },
  },

  // Neostandard baseline (spiritual successor to Standard) + TS support
  ...neostandard({
    ts: true,
  }),

  // Prettier config
  prettierConfig,

  // Sample files configuration
  {
    files: ["public/samples/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn"
    }
  },

  // Final overrides
  {
    plugins: {
      prettier: prettierPlugin,
    },

    ignores: [
      ".vercel",
      ".astro",
      "dist",
      ".cache",
      ".test",
      "node_modules",
      ".github",
      ".changeset",
      "scripts/**/*.js",
      "data-source",
      "typechain-types",
      "public/snippets",
      "**/*.json",
      "/src/pages/chainlink-functions/resources/example-source.js",
      "/src/env.d.ts",
      "src/graphql/generated.ts",
    ],

    rules: {
      "prettier/prettier": "error",
    },
  },
]
