module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/src/__mocks__/styleMock.ts",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
}
