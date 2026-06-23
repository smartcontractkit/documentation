import type { CodegenConfig } from "@graphql-codegen/cli"
import dotenv from "dotenv"

dotenv.config()

const GRAPHQL_API_URL = process.env.CCIP_GRAPHQL_ENDPOINT
const GRAPHQL_AUTH_TOKEN = process.env.CCIP_GRAPHQL_API_KEY

if (!GRAPHQL_API_URL) {
  throw new Error("CCIP_GRAPHQL_ENDPOINT is not defined in .env")
}

if (!GRAPHQL_AUTH_TOKEN) {
  throw new Error("CCIP_GRAPHQL_API_KEY is not defined in .env")
}

const config: CodegenConfig = {
  schema: {
    [GRAPHQL_API_URL]: {
      headers: {
        Authorization: `${GRAPHQL_AUTH_TOKEN}`,
      },
    },
  },
  documents: ["./src/lib/ccip/graphql/queries/**/*.ts"],
  emitLegacyCommonJSImports: false,
  generates: {
    "./src/lib/ccip/graphql/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./src/lib/ccip/graphql/schema.graphql.json": {
      plugins: ["introspection"],
    },
  },
  ignoreNoDocuments: true,
}

export default config
