/* eslint-disable */
import * as types from "./graphql.js"
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  query GetTokenPoolLanesWithPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolLanesWithPoolCondition\n    $filter: CcipTokenPoolLanesWithPoolFilter\n  ) {\n    allCcipTokenPoolLanesWithPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        tokenDecimals\n        remoteNetworkName\n        remoteToken\n        removed\n        typeAndVersion\n        tokenPool\n        inboundCapacity\n        inboundRate\n        inboundEnabled\n        outboundCapacity\n        outboundRate\n        outboundEnabled\n        customInboundCapacity\n        customInboundRate\n        customInboundEnabled\n        customOutboundCapacity\n        customOutboundRate\n        customOutboundEnabled\n      }\n      totalCount\n    }\n  }\n": typeof types.GetTokenPoolLanesWithPoolsDocument
  "\n  query GetTokenPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolCondition\n    $filter: CcipTokenPoolFilter\n  ) {\n    allCcipTokenPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        typeAndVersion\n        minBlockConfirmations\n        tokenPool\n      }\n      totalCount\n    }\n  }\n": typeof types.GetTokenPoolsDocument
}
const documents: Documents = {
  "\n  query GetTokenPoolLanesWithPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolLanesWithPoolCondition\n    $filter: CcipTokenPoolLanesWithPoolFilter\n  ) {\n    allCcipTokenPoolLanesWithPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        tokenDecimals\n        remoteNetworkName\n        remoteToken\n        removed\n        typeAndVersion\n        tokenPool\n        inboundCapacity\n        inboundRate\n        inboundEnabled\n        outboundCapacity\n        outboundRate\n        outboundEnabled\n        customInboundCapacity\n        customInboundRate\n        customInboundEnabled\n        customOutboundCapacity\n        customOutboundRate\n        customOutboundEnabled\n      }\n      totalCount\n    }\n  }\n":
    types.GetTokenPoolLanesWithPoolsDocument,
  "\n  query GetTokenPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolCondition\n    $filter: CcipTokenPoolFilter\n  ) {\n    allCcipTokenPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        typeAndVersion\n        minBlockConfirmations\n        tokenPool\n      }\n      totalCount\n    }\n  }\n":
    types.GetTokenPoolsDocument,
}

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GetTokenPoolLanesWithPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolLanesWithPoolCondition\n    $filter: CcipTokenPoolLanesWithPoolFilter\n  ) {\n    allCcipTokenPoolLanesWithPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        tokenDecimals\n        remoteNetworkName\n        remoteToken\n        removed\n        typeAndVersion\n        tokenPool\n        inboundCapacity\n        inboundRate\n        inboundEnabled\n        outboundCapacity\n        outboundRate\n        outboundEnabled\n        customInboundCapacity\n        customInboundRate\n        customInboundEnabled\n        customOutboundCapacity\n        customOutboundRate\n        customOutboundEnabled\n      }\n      totalCount\n    }\n  }\n"
): (typeof documents)["\n  query GetTokenPoolLanesWithPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolLanesWithPoolCondition\n    $filter: CcipTokenPoolLanesWithPoolFilter\n  ) {\n    allCcipTokenPoolLanesWithPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        tokenDecimals\n        remoteNetworkName\n        remoteToken\n        removed\n        typeAndVersion\n        tokenPool\n        inboundCapacity\n        inboundRate\n        inboundEnabled\n        outboundCapacity\n        outboundRate\n        outboundEnabled\n        customInboundCapacity\n        customInboundRate\n        customInboundEnabled\n        customOutboundCapacity\n        customOutboundRate\n        customOutboundEnabled\n      }\n      totalCount\n    }\n  }\n"]
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GetTokenPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolCondition\n    $filter: CcipTokenPoolFilter\n  ) {\n    allCcipTokenPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        typeAndVersion\n        minBlockConfirmations\n        tokenPool\n      }\n      totalCount\n    }\n  }\n"
): (typeof documents)["\n  query GetTokenPools(\n    $first: Int\n    $offset: Int\n    $condition: CcipTokenPoolCondition\n    $filter: CcipTokenPoolFilter\n  ) {\n    allCcipTokenPools(\n      first: $first\n      offset: $offset\n      condition: $condition\n      filter: $filter\n      orderBy: [NETWORK_ASC, TOKEN_SYMBOL_ASC]\n    ) {\n      nodes {\n        network\n        token\n        tokenSymbol\n        typeAndVersion\n        minBlockConfirmations\n        tokenPool\n      }\n      totalCount\n    }\n  }\n"]

export function gql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
