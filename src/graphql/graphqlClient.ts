import ApolloClientPackage from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import dotenv from "dotenv"
dotenv.config()

const { ApolloClient, InMemoryCache, HttpLink } = ApolloClientPackage

if (!process.env.GRAPHQL_SERVER_URL) {
  throw new Error("Environment variable GRAPHQL_SERVER_URL is not set")
}

if (!process.env.GRAPHQL_API_TOKEN) {
  throw new Error("Environment variable GRAPHQL_API_TOKEN is not set.")
}

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_SERVER_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = process.env.GRAPHQL_API_TOKEN
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : "",
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
