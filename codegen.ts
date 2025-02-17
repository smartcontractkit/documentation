import { CodegenConfig } from "@graphql-codegen/cli"
import dotenv from "dotenv"

dotenv.config()

const requiredEnvVars = ["GRAPHQL_SERVER_URL", "GRAPHQL_API_TOKEN"] as const

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is not set. Please check your .env file.`)
  }
})

const config: CodegenConfig = {
  schema: [
    {
      [process.env.GRAPHQL_SERVER_URL as string]: {
        headers: {
          Authorization: `${process.env.GRAPHQL_API_TOKEN}`,
        },
      },
    },
  ],
  documents: "src/graphql/queries/**/*.gql",
  generates: {
    "src/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        avoidOptionals: true,
        gqlImport: "graphql-tag#gql",
        documentMode: "documentNode",
        dedupeFragments: true,
      },
    },
  },
}

export default config
