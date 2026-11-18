/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never }
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Equal to the specified value. */
  equalTo?: boolean | null | undefined
  /** Greater than the specified value. */
  greaterThan?: boolean | null | undefined
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: boolean | null | undefined
  /** Included in the specified list. */
  in?: Array<boolean> | null | undefined
  /** Less than the specified value. */
  lessThan?: boolean | null | undefined
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: boolean | null | undefined
  /** Not equal to the specified value. */
  notEqualTo?: boolean | null | undefined
}

/**
 * A condition to be used against `CcipTokenPool` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolCondition = {
  /** Checks for equality with the object’s `administrator` field. */
  administrator?: string | null | undefined
  /** Checks for equality with the object’s `allowlist` field. */
  allowlist?: unknown
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash?: string | null | undefined
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber?: number | null | undefined
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp?: unknown
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: unknown
  /** Checks for equality with the object’s `info` field. */
  info?: unknown
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex?: number | null | undefined
  /** Checks for equality with the object’s `minBlockConfirmations` field. */
  minBlockConfirmations?: number | null | undefined
  /** Checks for equality with the object’s `network` field. */
  network?: string | null | undefined
  /** Checks for equality with the object’s `owner` field. */
  owner?: string | null | undefined
  /** Checks for equality with the object’s `pendingAdministrator` field. */
  pendingAdministrator?: string | null | undefined
  /** Checks for equality with the object’s `pendingOwner` field. */
  pendingOwner?: string | null | undefined
  /** Checks for equality with the object’s `previousPool` field. */
  previousPool?: string | null | undefined
  /** Checks for equality with the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion?: string | null | undefined
  /** Checks for equality with the object’s `registry` field. */
  registry?: string | null | undefined
  /** Checks for equality with the object’s `router` field. */
  router?: string | null | undefined
  /** Checks for equality with the object’s `token` field. */
  token?: string | null | undefined
  /** Checks for equality with the object’s `tokenDecimals` field. */
  tokenDecimals?: number | null | undefined
  /** Checks for equality with the object’s `tokenName` field. */
  tokenName?: string | null | undefined
  /** Checks for equality with the object’s `tokenPool` field. */
  tokenPool?: string | null | undefined
  /** Checks for equality with the object’s `tokenSymbol` field. */
  tokenSymbol?: string | null | undefined
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash?: string | null | undefined
  /** Checks for equality with the object’s `typeAndVersion` field. */
  typeAndVersion?: string | null | undefined
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: unknown
}

/** A filter to be used against `CcipTokenPool` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolFilter = {
  /** Filter by the object’s `administrator` field. */
  administrator?: StringFilter | null | undefined
  /** Filter by the object’s `allowlist` field. */
  allowlist?: JsonFilter | null | undefined
  /** Checks for all expressions in this list. */
  and?: Array<CcipTokenPoolFilter> | null | undefined
  /** Filter by the object’s `blockHash` field. */
  blockHash?: StringFilter | null | undefined
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: IntFilter | null | undefined
  /** Filter by the object’s `info` field. */
  info?: JsonFilter | null | undefined
  /** Filter by the object’s `logIndex` field. */
  logIndex?: IntFilter | null | undefined
  /** Filter by the object’s `minBlockConfirmations` field. */
  minBlockConfirmations?: IntFilter | null | undefined
  /** Filter by the object’s `network` field. */
  network?: StringFilter | null | undefined
  /** Negates the expression. */
  not?: CcipTokenPoolFilter | null | undefined
  /** Checks for any expressions in this list. */
  or?: Array<CcipTokenPoolFilter> | null | undefined
  /** Filter by the object’s `owner` field. */
  owner?: StringFilter | null | undefined
  /** Filter by the object’s `pendingAdministrator` field. */
  pendingAdministrator?: StringFilter | null | undefined
  /** Filter by the object’s `pendingOwner` field. */
  pendingOwner?: StringFilter | null | undefined
  /** Filter by the object’s `previousPool` field. */
  previousPool?: StringFilter | null | undefined
  /** Filter by the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion?: StringFilter | null | undefined
  /** Filter by the object’s `registry` field. */
  registry?: StringFilter | null | undefined
  /** Filter by the object’s `router` field. */
  router?: StringFilter | null | undefined
  /** Filter by the object’s `token` field. */
  token?: StringFilter | null | undefined
  /** Filter by the object’s `tokenDecimals` field. */
  tokenDecimals?: IntFilter | null | undefined
  /** Filter by the object’s `tokenName` field. */
  tokenName?: StringFilter | null | undefined
  /** Filter by the object’s `tokenPool` field. */
  tokenPool?: StringFilter | null | undefined
  /** Filter by the object’s `tokenSymbol` field. */
  tokenSymbol?: StringFilter | null | undefined
  /** Filter by the object’s `transactionHash` field. */
  transactionHash?: StringFilter | null | undefined
  /** Filter by the object’s `typeAndVersion` field. */
  typeAndVersion?: StringFilter | null | undefined
}

/**
 * A condition to be used against `CcipTokenPoolLanesWithPool` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolLanesWithPoolCondition = {
  /** Checks for equality with the object’s `administrator` field. */
  administrator?: string | null | undefined
  /** Checks for equality with the object’s `allowlist` field. */
  allowlist?: unknown
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash?: string | null | undefined
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber?: number | null | undefined
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp?: unknown
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: unknown
  /** Checks for equality with the object’s `customInboundCapacity` field. */
  customInboundCapacity?: unknown
  /** Checks for equality with the object’s `customInboundEnabled` field. */
  customInboundEnabled?: boolean | null | undefined
  /** Checks for equality with the object’s `customInboundRate` field. */
  customInboundRate?: unknown
  /** Checks for equality with the object’s `customOutboundCapacity` field. */
  customOutboundCapacity?: unknown
  /** Checks for equality with the object’s `customOutboundEnabled` field. */
  customOutboundEnabled?: boolean | null | undefined
  /** Checks for equality with the object’s `customOutboundRate` field. */
  customOutboundRate?: unknown
  /** Checks for equality with the object’s `inboundCapacity` field. */
  inboundCapacity?: unknown
  /** Checks for equality with the object’s `inboundEnabled` field. */
  inboundEnabled?: boolean | null | undefined
  /** Checks for equality with the object’s `inboundRate` field. */
  inboundRate?: unknown
  /** Checks for equality with the object’s `info` field. */
  info?: unknown
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex?: number | null | undefined
  /** Checks for equality with the object’s `minBlockConfirmations` field. */
  minBlockConfirmations?: number | null | undefined
  /** Checks for equality with the object’s `network` field. */
  network?: string | null | undefined
  /** Checks for equality with the object’s `outboundCapacity` field. */
  outboundCapacity?: unknown
  /** Checks for equality with the object’s `outboundEnabled` field. */
  outboundEnabled?: boolean | null | undefined
  /** Checks for equality with the object’s `outboundRate` field. */
  outboundRate?: unknown
  /** Checks for equality with the object’s `owner` field. */
  owner?: string | null | undefined
  /** Checks for equality with the object’s `pendingAdministrator` field. */
  pendingAdministrator?: string | null | undefined
  /** Checks for equality with the object’s `pendingOwner` field. */
  pendingOwner?: string | null | undefined
  /** Checks for equality with the object’s `poolInfo` field. */
  poolInfo?: unknown
  /** Checks for equality with the object’s `previousPool` field. */
  previousPool?: string | null | undefined
  /** Checks for equality with the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion?: string | null | undefined
  /** Checks for equality with the object’s `registry` field. */
  registry?: string | null | undefined
  /** Checks for equality with the object’s `remoteNetworkName` field. */
  remoteNetworkName?: string | null | undefined
  /** Checks for equality with the object’s `remoteToken` field. */
  remoteToken?: string | null | undefined
  /** Checks for equality with the object’s `remoteTokenPools` field. */
  remoteTokenPools?: Array<string | null | undefined> | null | undefined
  /** Checks for equality with the object’s `removed` field. */
  removed?: boolean | null | undefined
  /** Checks for equality with the object’s `router` field. */
  router?: string | null | undefined
  /** Checks for equality with the object’s `token` field. */
  token?: string | null | undefined
  /** Checks for equality with the object’s `tokenDecimals` field. */
  tokenDecimals?: number | null | undefined
  /** Checks for equality with the object’s `tokenName` field. */
  tokenName?: string | null | undefined
  /** Checks for equality with the object’s `tokenPool` field. */
  tokenPool?: string | null | undefined
  /** Checks for equality with the object’s `tokenRegisteredAt` field. */
  tokenRegisteredAt?: unknown
  /** Checks for equality with the object’s `tokenSymbol` field. */
  tokenSymbol?: string | null | undefined
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash?: string | null | undefined
  /** Checks for equality with the object’s `typeAndVersion` field. */
  typeAndVersion?: string | null | undefined
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: unknown
}

/** A filter to be used against `CcipTokenPoolLanesWithPool` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolLanesWithPoolFilter = {
  /** Filter by the object’s `administrator` field. */
  administrator?: StringFilter | null | undefined
  /** Filter by the object’s `allowlist` field. */
  allowlist?: JsonFilter | null | undefined
  /** Checks for all expressions in this list. */
  and?: Array<CcipTokenPoolLanesWithPoolFilter> | null | undefined
  /** Filter by the object’s `blockHash` field. */
  blockHash?: StringFilter | null | undefined
  /** Filter by the object’s `blockNumber` field. */
  blockNumber?: IntFilter | null | undefined
  /** Filter by the object’s `customInboundEnabled` field. */
  customInboundEnabled?: BooleanFilter | null | undefined
  /** Filter by the object’s `customOutboundEnabled` field. */
  customOutboundEnabled?: BooleanFilter | null | undefined
  /** Filter by the object’s `inboundEnabled` field. */
  inboundEnabled?: BooleanFilter | null | undefined
  /** Filter by the object’s `info` field. */
  info?: JsonFilter | null | undefined
  /** Filter by the object’s `logIndex` field. */
  logIndex?: IntFilter | null | undefined
  /** Filter by the object’s `minBlockConfirmations` field. */
  minBlockConfirmations?: IntFilter | null | undefined
  /** Filter by the object’s `network` field. */
  network?: StringFilter | null | undefined
  /** Negates the expression. */
  not?: CcipTokenPoolLanesWithPoolFilter | null | undefined
  /** Checks for any expressions in this list. */
  or?: Array<CcipTokenPoolLanesWithPoolFilter> | null | undefined
  /** Filter by the object’s `outboundEnabled` field. */
  outboundEnabled?: BooleanFilter | null | undefined
  /** Filter by the object’s `owner` field. */
  owner?: StringFilter | null | undefined
  /** Filter by the object’s `pendingAdministrator` field. */
  pendingAdministrator?: StringFilter | null | undefined
  /** Filter by the object’s `pendingOwner` field. */
  pendingOwner?: StringFilter | null | undefined
  /** Filter by the object’s `poolInfo` field. */
  poolInfo?: JsonFilter | null | undefined
  /** Filter by the object’s `previousPool` field. */
  previousPool?: StringFilter | null | undefined
  /** Filter by the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion?: StringFilter | null | undefined
  /** Filter by the object’s `registry` field. */
  registry?: StringFilter | null | undefined
  /** Filter by the object’s `remoteNetworkName` field. */
  remoteNetworkName?: StringFilter | null | undefined
  /** Filter by the object’s `remoteToken` field. */
  remoteToken?: StringFilter | null | undefined
  /** Filter by the object’s `remoteTokenPools` field. */
  remoteTokenPools?: StringListFilter | null | undefined
  /** Filter by the object’s `removed` field. */
  removed?: BooleanFilter | null | undefined
  /** Filter by the object’s `router` field. */
  router?: StringFilter | null | undefined
  /** Filter by the object’s `token` field. */
  token?: StringFilter | null | undefined
  /** Filter by the object’s `tokenDecimals` field. */
  tokenDecimals?: IntFilter | null | undefined
  /** Filter by the object’s `tokenName` field. */
  tokenName?: StringFilter | null | undefined
  /** Filter by the object’s `tokenPool` field. */
  tokenPool?: StringFilter | null | undefined
  /** Filter by the object’s `tokenSymbol` field. */
  tokenSymbol?: StringFilter | null | undefined
  /** Filter by the object’s `transactionHash` field. */
  transactionHash?: StringFilter | null | undefined
  /** Filter by the object’s `typeAndVersion` field. */
  typeAndVersion?: StringFilter | null | undefined
}

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Equal to the specified value. */
  equalTo?: number | null | undefined
  /** Greater than the specified value. */
  greaterThan?: number | null | undefined
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: number | null | undefined
  /** Included in the specified list. */
  in?: Array<number> | null | undefined
  /** Less than the specified value. */
  lessThan?: number | null | undefined
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: number | null | undefined
  /** Not equal to the specified value. */
  notEqualTo?: number | null | undefined
}

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contains the specified JSON. */
  contains?: unknown
  /** Equal to the specified value. */
  equalTo?: unknown
  /** Greater than the specified value. */
  greaterThan?: unknown
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: unknown
  /** Included in the specified list. */
  in?: Array<unknown> | null | undefined
  /** Less than the specified value. */
  lessThan?: unknown
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: unknown
  /** Not equal to the specified value. */
  notEqualTo?: unknown
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Equal to the specified value. */
  equalTo?: string | null | undefined
  /** Greater than the specified value. */
  greaterThan?: string | null | undefined
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: string | null | undefined
  /** Included in the specified list. */
  in?: Array<string> | null | undefined
  /** Less than the specified value. */
  lessThan?: string | null | undefined
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: string | null | undefined
  /** Not equal to the specified value. */
  notEqualTo?: string | null | undefined
}

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Contains the specified list of values. */
  contains?: Array<string | null | undefined> | null | undefined
  /** Equal to the specified value. */
  equalTo?: Array<string | null | undefined> | null | undefined
  /** Greater than the specified value. */
  greaterThan?: Array<string | null | undefined> | null | undefined
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Array<string | null | undefined> | null | undefined
  /** Less than the specified value. */
  lessThan?: Array<string | null | undefined> | null | undefined
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Array<string | null | undefined> | null | undefined
  /** Not equal to the specified value. */
  notEqualTo?: Array<string | null | undefined> | null | undefined
}

export type GetTokenPoolLanesWithPoolsQueryVariables = Exact<{
  first?: number | null | undefined
  offset?: number | null | undefined
  condition?: CcipTokenPoolLanesWithPoolCondition | null | undefined
  filter?: CcipTokenPoolLanesWithPoolFilter | null | undefined
}>

export type GetTokenPoolLanesWithPoolsQuery = {
  allCcipTokenPoolLanesWithPools: {
    totalCount: number
    nodes: Array<{
      network: string | null
      token: string | null
      tokenSymbol: string | null
      tokenDecimals: number | null
      remoteNetworkName: string | null
      remoteToken: string | null
      info: unknown
      poolInfo: unknown
      removed: boolean | null
      typeAndVersion: string | null
      tokenPool: string | null
      inboundCapacity: unknown
      inboundRate: unknown
      inboundEnabled: boolean | null
      outboundCapacity: unknown
      outboundRate: unknown
      outboundEnabled: boolean | null
      customInboundCapacity: unknown
      customInboundRate: unknown
      customInboundEnabled: boolean | null
      customOutboundCapacity: unknown
      customOutboundRate: unknown
      customOutboundEnabled: boolean | null
    }>
  } | null
}

export type GetTokenPoolsQueryVariables = Exact<{
  first?: number | null | undefined
  offset?: number | null | undefined
  condition?: CcipTokenPoolCondition | null | undefined
  filter?: CcipTokenPoolFilter | null | undefined
}>

export type GetTokenPoolsQuery = {
  allCcipTokenPools: {
    totalCount: number
    nodes: Array<{
      network: string | null
      token: string | null
      tokenSymbol: string | null
      typeAndVersion: string | null
      registry: string | null
      minBlockConfirmations: number | null
      info: unknown
      tokenPool: string | null
    }>
  } | null
}

export const GetTokenPoolLanesWithPoolsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetTokenPoolLanesWithPools" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "condition" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CcipTokenPoolLanesWithPoolCondition" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CcipTokenPoolLanesWithPoolFilter" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allCcipTokenPoolLanesWithPools" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "condition" },
                value: { kind: "Variable", name: { kind: "Name", value: "condition" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "filter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ListValue",
                  values: [
                    { kind: "EnumValue", value: "NETWORK_ASC" },
                    { kind: "EnumValue", value: "TOKEN_SYMBOL_ASC" },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "nodes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "network" } },
                      { kind: "Field", name: { kind: "Name", value: "token" } },
                      { kind: "Field", name: { kind: "Name", value: "tokenSymbol" } },
                      { kind: "Field", name: { kind: "Name", value: "tokenDecimals" } },
                      { kind: "Field", name: { kind: "Name", value: "remoteNetworkName" } },
                      { kind: "Field", name: { kind: "Name", value: "remoteToken" } },
                      { kind: "Field", name: { kind: "Name", value: "info" } },
                      { kind: "Field", name: { kind: "Name", value: "poolInfo" } },
                      { kind: "Field", name: { kind: "Name", value: "removed" } },
                      { kind: "Field", name: { kind: "Name", value: "typeAndVersion" } },
                      { kind: "Field", name: { kind: "Name", value: "tokenPool" } },
                      { kind: "Field", name: { kind: "Name", value: "inboundCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "inboundRate" } },
                      { kind: "Field", name: { kind: "Name", value: "inboundEnabled" } },
                      { kind: "Field", name: { kind: "Name", value: "outboundCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "outboundRate" } },
                      { kind: "Field", name: { kind: "Name", value: "outboundEnabled" } },
                      { kind: "Field", name: { kind: "Name", value: "customInboundCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "customInboundRate" } },
                      { kind: "Field", name: { kind: "Name", value: "customInboundEnabled" } },
                      { kind: "Field", name: { kind: "Name", value: "customOutboundCapacity" } },
                      { kind: "Field", name: { kind: "Name", value: "customOutboundRate" } },
                      { kind: "Field", name: { kind: "Name", value: "customOutboundEnabled" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTokenPoolLanesWithPoolsQuery, GetTokenPoolLanesWithPoolsQueryVariables>
export const GetTokenPoolsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetTokenPools" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "condition" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CcipTokenPoolCondition" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CcipTokenPoolFilter" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allCcipTokenPools" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "condition" },
                value: { kind: "Variable", name: { kind: "Name", value: "condition" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "filter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: {
                  kind: "ListValue",
                  values: [
                    { kind: "EnumValue", value: "NETWORK_ASC" },
                    { kind: "EnumValue", value: "TOKEN_SYMBOL_ASC" },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "nodes" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "network" } },
                      { kind: "Field", name: { kind: "Name", value: "token" } },
                      { kind: "Field", name: { kind: "Name", value: "tokenSymbol" } },
                      { kind: "Field", name: { kind: "Name", value: "typeAndVersion" } },
                      { kind: "Field", name: { kind: "Name", value: "registry" } },
                      { kind: "Field", name: { kind: "Name", value: "minBlockConfirmations" } },
                      { kind: "Field", name: { kind: "Name", value: "info" } },
                      { kind: "Field", name: { kind: "Name", value: "tokenPool" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTokenPoolsQuery, GetTokenPoolsQueryVariables>
