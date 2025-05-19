module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/src/__mocks__/styleMock.ts",
    "^~/(.*)$": "<rootDir>/src/$1",
    "^@components": "<rootDir>/src/components/index.ts",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@config$": "<rootDir>/src/config/index.ts",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@graphql$": "<rootDir>/src/graphql/index.ts",
    "^@graphql/(.*)$": "<rootDir>/src/graphql/$1",
    "^@stores/(.*)$": "<rootDir>/src/stores/$1",
    "^@utils$": "<rootDir>/src/utils/index.ts",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@variables$": "<rootDir>/src/config/markdown-variables.ts",
    "^@abi$": "<rootDir>/src/features/abi/index.ts",
    "\\.ya?ml$": "<rootDir>/src/__mocks__/yamlMock.ts",
  },
  transformIgnorePatterns: ["/node_modules/(?!.*\\.mjs$)"],
  testPathIgnorePatterns: ["/node_modules/", "src/tests/chain-api.test.ts"],
}
