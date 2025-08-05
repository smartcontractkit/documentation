import { DocumentNode } from "graphql"
import * as Apollo from "@apollo/client"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigFloat: { input: any; output: any }
  BigInt: { input: any; output: any }
  Cursor: { input: any; output: any }
  Datetime: { input: any; output: any }
  JSON: { input: any; output: any }
}

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Equal to the specified value. */
  equalTo: InputMaybe<Scalars["Boolean"]["input"]>
  /** Greater than the specified value. */
  greaterThan: InputMaybe<Scalars["Boolean"]["input"]>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo: InputMaybe<Scalars["Boolean"]["input"]>
  /** Included in the specified list. */
  in: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  /** Less than the specified value. */
  lessThan: InputMaybe<Scalars["Boolean"]["input"]>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo: InputMaybe<Scalars["Boolean"]["input"]>
  /** Not equal to the specified value. */
  notEqualTo: InputMaybe<Scalars["Boolean"]["input"]>
}

export type CcipAllLaneStatus = {
  __typename?: "CcipAllLaneStatus"
  destNetworkName: Maybe<Scalars["String"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  successRate: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `CcipAllLaneStatus` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipAllLaneStatusCondition = {
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `successRate` field. */
  successRate: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `CcipAllLaneStatus` object types. All fields are combined with a logical ‘and.’ */
export type CcipAllLaneStatusFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipAllLaneStatusFilter>>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipAllLaneStatusFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipAllLaneStatusFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `successRate` field. */
  successRate: InputMaybe<IntFilter>
}

/** A connection to a list of `CcipAllLaneStatus` values. */
export type CcipAllLaneStatusesConnection = {
  __typename?: "CcipAllLaneStatusesConnection"
  /** A list of edges which contains the `CcipAllLaneStatus` and cursor to aid in pagination. */
  edges: Array<CcipAllLaneStatusesEdge>
  /** A list of `CcipAllLaneStatus` objects. */
  nodes: Array<CcipAllLaneStatus>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipAllLaneStatus` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipAllLaneStatus` edge in the connection. */
export type CcipAllLaneStatusesEdge = {
  __typename?: "CcipAllLaneStatusesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipAllLaneStatus` at the end of the edge. */
  node: CcipAllLaneStatus
}

/** Methods to use when ordering `CcipAllLaneStatus`. */
export enum CcipAllLaneStatusesOrderBy {
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  Natural = "NATURAL",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SuccessRateAsc = "SUCCESS_RATE_ASC",
  SuccessRateDesc = "SUCCESS_RATE_DESC",
}

export type CcipLaneStatus = {
  __typename?: "CcipLaneStatus"
  destNetworkName: Maybe<Scalars["String"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  successRate: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `CcipLaneStatus` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipLaneStatusCondition = {
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `successRate` field. */
  successRate: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `CcipLaneStatus` object types. All fields are combined with a logical ‘and.’ */
export type CcipLaneStatusFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipLaneStatusFilter>>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipLaneStatusFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipLaneStatusFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `successRate` field. */
  successRate: InputMaybe<IntFilter>
}

/** A connection to a list of `CcipLaneStatus` values. */
export type CcipLaneStatusesConnection = {
  __typename?: "CcipLaneStatusesConnection"
  /** A list of edges which contains the `CcipLaneStatus` and cursor to aid in pagination. */
  edges: Array<CcipLaneStatusesEdge>
  /** A list of `CcipLaneStatus` objects. */
  nodes: Array<CcipLaneStatus>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipLaneStatus` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipLaneStatus` edge in the connection. */
export type CcipLaneStatusesEdge = {
  __typename?: "CcipLaneStatusesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipLaneStatus` at the end of the edge. */
  node: CcipLaneStatus
}

/** Methods to use when ordering `CcipLaneStatus`. */
export enum CcipLaneStatusesOrderBy {
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  Natural = "NATURAL",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SuccessRateAsc = "SUCCESS_RATE_ASC",
  SuccessRateDesc = "SUCCESS_RATE_DESC",
}

export type CcipLaneTimeEstimate = {
  __typename?: "CcipLaneTimeEstimate"
  commitMs: Maybe<Scalars["Float"]["output"]>
  destNetworkName: Maybe<Scalars["String"]["output"]>
  finalityMs: Maybe<Scalars["Float"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  totalMs: Maybe<Scalars["Float"]["output"]>
  transferMs: Maybe<Scalars["Float"]["output"]>
}

/**
 * A condition to be used against `CcipLaneTimeEstimate` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CcipLaneTimeEstimateCondition = {
  /** Checks for equality with the object’s `commitMs` field. */
  commitMs: InputMaybe<Scalars["Float"]["input"]>
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `finalityMs` field. */
  finalityMs: InputMaybe<Scalars["Float"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalMs` field. */
  totalMs: InputMaybe<Scalars["Float"]["input"]>
  /** Checks for equality with the object’s `transferMs` field. */
  transferMs: InputMaybe<Scalars["Float"]["input"]>
}

/** A filter to be used against `CcipLaneTimeEstimate` object types. All fields are combined with a logical ‘and.’ */
export type CcipLaneTimeEstimateFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipLaneTimeEstimateFilter>>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipLaneTimeEstimateFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipLaneTimeEstimateFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipLaneTimeEstimate` values. */
export type CcipLaneTimeEstimatesConnection = {
  __typename?: "CcipLaneTimeEstimatesConnection"
  /** A list of edges which contains the `CcipLaneTimeEstimate` and cursor to aid in pagination. */
  edges: Array<CcipLaneTimeEstimatesEdge>
  /** A list of `CcipLaneTimeEstimate` objects. */
  nodes: Array<CcipLaneTimeEstimate>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipLaneTimeEstimate` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipLaneTimeEstimate` edge in the connection. */
export type CcipLaneTimeEstimatesEdge = {
  __typename?: "CcipLaneTimeEstimatesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipLaneTimeEstimate` at the end of the edge. */
  node: CcipLaneTimeEstimate
}

/** Methods to use when ordering `CcipLaneTimeEstimate`. */
export enum CcipLaneTimeEstimatesOrderBy {
  CommitMsAsc = "COMMIT_MS_ASC",
  CommitMsDesc = "COMMIT_MS_DESC",
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  FinalityMsAsc = "FINALITY_MS_ASC",
  FinalityMsDesc = "FINALITY_MS_DESC",
  Natural = "NATURAL",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  TotalMsAsc = "TOTAL_MS_ASC",
  TotalMsDesc = "TOTAL_MS_DESC",
  TransferMsAsc = "TRANSFER_MS_ASC",
  TransferMsDesc = "TRANSFER_MS_DESC",
}

export type CcipMessage = {
  __typename?: "CcipMessage"
  arm: Maybe<Scalars["String"]["output"]>
  blessBlockNumber: Maybe<Scalars["Int"]["output"]>
  blessBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  blessLogIndex: Maybe<Scalars["Int"]["output"]>
  blessTransactionHash: Maybe<Scalars["String"]["output"]>
  commitBlockNumber: Maybe<Scalars["Int"]["output"]>
  commitBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  commitLogIndex: Maybe<Scalars["Int"]["output"]>
  commitStore: Maybe<Scalars["String"]["output"]>
  commitTransactionHash: Maybe<Scalars["String"]["output"]>
  data: Maybe<Scalars["String"]["output"]>
  destChainId: Maybe<Scalars["BigInt"]["output"]>
  destNetworkName: Maybe<Scalars["String"]["output"]>
  destRouterAddress: Maybe<Scalars["String"]["output"]>
  feeToken: Maybe<Scalars["String"]["output"]>
  feeTokenAmount: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["BigFloat"]["output"]>
  info: Maybe<Scalars["JSON"]["output"]>
  max: Maybe<Scalars["BigInt"]["output"]>
  messageId: Maybe<Scalars["String"]["output"]>
  min: Maybe<Scalars["BigInt"]["output"]>
  nonce: Maybe<Scalars["Int"]["output"]>
  offrampAddress: Maybe<Scalars["String"]["output"]>
  onrampAddress: Maybe<Scalars["String"]["output"]>
  origin: Maybe<Scalars["String"]["output"]>
  receiptBlock: Maybe<Scalars["Int"]["output"]>
  receiptFinalized: Maybe<Scalars["Datetime"]["output"]>
  receiptLogIndex: Maybe<Scalars["Int"]["output"]>
  receiptTimestamp: Maybe<Scalars["Datetime"]["output"]>
  receiptTransactionHash: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  root: Maybe<Scalars["String"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  sendBlock: Maybe<Scalars["Int"]["output"]>
  sendFinalized: Maybe<Scalars["Datetime"]["output"]>
  sendLogIndex: Maybe<Scalars["Int"]["output"]>
  sendTimestamp: Maybe<Scalars["Datetime"]["output"]>
  sendTransactionHash: Maybe<Scalars["String"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  sequenceNumber: Maybe<Scalars["Int"]["output"]>
  sourceChainId: Maybe<Scalars["BigInt"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  state: Maybe<Scalars["Int"]["output"]>
  strict: Maybe<Scalars["Boolean"]["output"]>
  tokenAmounts: Maybe<Scalars["JSON"]["output"]>
  votes: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `CcipMessage` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CcipMessageCondition = {
  /** Checks for equality with the object’s `arm` field. */
  arm: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blessBlockNumber` field. */
  blessBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blessBlockTimestamp` field. */
  blessBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `blessLogIndex` field. */
  blessLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blessTransactionHash` field. */
  blessTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `commitBlockNumber` field. */
  commitBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `commitBlockTimestamp` field. */
  commitBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `commitLogIndex` field. */
  commitLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `commitStore` field. */
  commitStore: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `commitTransactionHash` field. */
  commitTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `data` field. */
  data: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destChainId` field. */
  destChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeToken` field. */
  feeToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `info` field. */
  info: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `max` field. */
  max: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `messageId` field. */
  messageId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `min` field. */
  min: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `nonce` field. */
  nonce: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `origin` field. */
  origin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiptBlock` field. */
  receiptBlock: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `receiptFinalized` field. */
  receiptFinalized: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `receiptLogIndex` field. */
  receiptLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `receiptTimestamp` field. */
  receiptTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `receiptTransactionHash` field. */
  receiptTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `root` field. */
  root: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sendBlock` field. */
  sendBlock: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sendFinalized` field. */
  sendFinalized: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `sendLogIndex` field. */
  sendLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sendTimestamp` field. */
  sendTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `sendTransactionHash` field. */
  sendTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sourceChainId` field. */
  sourceChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `state` field. */
  state: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `strict` field. */
  strict: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `votes` field. */
  votes: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `CcipMessage` object types. All fields are combined with a logical ‘and.’ */
export type CcipMessageFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipMessageFilter>>
  /** Filter by the object’s `arm` field. */
  arm: InputMaybe<StringFilter>
  /** Filter by the object’s `blessBlockNumber` field. */
  blessBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `blessLogIndex` field. */
  blessLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `blessTransactionHash` field. */
  blessTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `commitBlockNumber` field. */
  commitBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `commitLogIndex` field. */
  commitLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `commitStore` field. */
  commitStore: InputMaybe<StringFilter>
  /** Filter by the object’s `commitTransactionHash` field. */
  commitTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `data` field. */
  data: InputMaybe<StringFilter>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `feeToken` field. */
  feeToken: InputMaybe<StringFilter>
  /** Filter by the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<StringFilter>
  /** Filter by the object’s `info` field. */
  info: InputMaybe<JsonFilter>
  /** Filter by the object’s `messageId` field. */
  messageId: InputMaybe<StringFilter>
  /** Filter by the object’s `nonce` field. */
  nonce: InputMaybe<IntFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipMessageFilter>
  /** Filter by the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipMessageFilter>>
  /** Filter by the object’s `origin` field. */
  origin: InputMaybe<StringFilter>
  /** Filter by the object’s `receiptBlock` field. */
  receiptBlock: InputMaybe<IntFilter>
  /** Filter by the object’s `receiptLogIndex` field. */
  receiptLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `receiptTransactionHash` field. */
  receiptTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `root` field. */
  root: InputMaybe<StringFilter>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `sendBlock` field. */
  sendBlock: InputMaybe<IntFilter>
  /** Filter by the object’s `sendLogIndex` field. */
  sendLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `sendTransactionHash` field. */
  sendTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `state` field. */
  state: InputMaybe<IntFilter>
  /** Filter by the object’s `strict` field. */
  strict: InputMaybe<BooleanFilter>
  /** Filter by the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<JsonFilter>
  /** Filter by the object’s `votes` field. */
  votes: InputMaybe<IntFilter>
}

/** A connection to a list of `CcipMessage` values. */
export type CcipMessagesConnection = {
  __typename?: "CcipMessagesConnection"
  /** A list of edges which contains the `CcipMessage` and cursor to aid in pagination. */
  edges: Array<CcipMessagesEdge>
  /** A list of `CcipMessage` objects. */
  nodes: Array<CcipMessage>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipMessage` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipMessage` edge in the connection. */
export type CcipMessagesEdge = {
  __typename?: "CcipMessagesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipMessage` at the end of the edge. */
  node: CcipMessage
}

export type CcipMessagesFlat = {
  __typename?: "CcipMessagesFlat"
  blessBlockHash: Maybe<Scalars["String"]["output"]>
  blessBlockNumber: Maybe<Scalars["Int"]["output"]>
  blessBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  blessLogIndex: Maybe<Scalars["Int"]["output"]>
  blessTransactionHash: Maybe<Scalars["String"]["output"]>
  commitBlockHash: Maybe<Scalars["String"]["output"]>
  commitBlockNumber: Maybe<Scalars["Int"]["output"]>
  commitBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  commitLogIndex: Maybe<Scalars["Int"]["output"]>
  commitStore: Maybe<Scalars["String"]["output"]>
  commitTransactionHash: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  data: Maybe<Scalars["String"]["output"]>
  destChainId: Maybe<Scalars["BigInt"]["output"]>
  destNetworkName: Maybe<Scalars["String"]["output"]>
  destRouter: Maybe<Scalars["String"]["output"]>
  firstReceiptBlockHash: Maybe<Scalars["String"]["output"]>
  firstReceiptBlockNumber: Maybe<Scalars["Int"]["output"]>
  firstReceiptBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  firstReceiptInfo: Maybe<Scalars["JSON"]["output"]>
  firstReceiptLogIndex: Maybe<Scalars["Int"]["output"]>
  firstReceiptTransactionHash: Maybe<Scalars["String"]["output"]>
  info: Maybe<Scalars["JSON"]["output"]>
  max: Maybe<Scalars["Int"]["output"]>
  messageId: Maybe<Scalars["String"]["output"]>
  min: Maybe<Scalars["Int"]["output"]>
  offramp: Maybe<Scalars["String"]["output"]>
  onramp: Maybe<Scalars["String"]["output"]>
  origin: Maybe<Scalars["String"]["output"]>
  receiptBlockHash: Maybe<Scalars["String"]["output"]>
  receiptBlockNumber: Maybe<Scalars["Int"]["output"]>
  receiptBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  receiptInfo: Maybe<Scalars["JSON"]["output"]>
  receiptLogIndex: Maybe<Scalars["Int"]["output"]>
  receiptTransactionHash: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  rmn: Maybe<Scalars["String"]["output"]>
  root: Maybe<Scalars["String"]["output"]>
  sendBlockHash: Maybe<Scalars["String"]["output"]>
  sendBlockNumber: Maybe<Scalars["Int"]["output"]>
  sendBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  sendFinalized: Maybe<Scalars["Datetime"]["output"]>
  sendLogIndex: Maybe<Scalars["Int"]["output"]>
  sendTransactionHash: Maybe<Scalars["String"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  sequenceNumber: Maybe<Scalars["Int"]["output"]>
  sourceChainId: Maybe<Scalars["BigInt"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  sourceRouter: Maybe<Scalars["String"]["output"]>
  sourceSchema: Maybe<Scalars["String"]["output"]>
  state: Maybe<Scalars["Int"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  votes: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `CcipMessagesFlat` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipMessagesFlatCondition = {
  /** Checks for equality with the object’s `blessBlockHash` field. */
  blessBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blessBlockNumber` field. */
  blessBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blessBlockTimestamp` field. */
  blessBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `blessLogIndex` field. */
  blessLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blessTransactionHash` field. */
  blessTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `commitBlockHash` field. */
  commitBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `commitBlockNumber` field. */
  commitBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `commitBlockTimestamp` field. */
  commitBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `commitLogIndex` field. */
  commitLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `commitStore` field. */
  commitStore: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `commitTransactionHash` field. */
  commitTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `data` field. */
  data: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destChainId` field. */
  destChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destRouter` field. */
  destRouter: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `firstReceiptBlockHash` field. */
  firstReceiptBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `firstReceiptBlockNumber` field. */
  firstReceiptBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `firstReceiptBlockTimestamp` field. */
  firstReceiptBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `firstReceiptInfo` field. */
  firstReceiptInfo: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `firstReceiptLogIndex` field. */
  firstReceiptLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `firstReceiptTransactionHash` field. */
  firstReceiptTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `info` field. */
  info: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `max` field. */
  max: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `messageId` field. */
  messageId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `min` field. */
  min: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `offramp` field. */
  offramp: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `onramp` field. */
  onramp: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `origin` field. */
  origin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiptBlockHash` field. */
  receiptBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiptBlockNumber` field. */
  receiptBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `receiptBlockTimestamp` field. */
  receiptBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `receiptInfo` field. */
  receiptInfo: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `receiptLogIndex` field. */
  receiptLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `receiptTransactionHash` field. */
  receiptTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rmn` field. */
  rmn: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `root` field. */
  root: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sendBlockHash` field. */
  sendBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sendBlockNumber` field. */
  sendBlockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sendBlockTimestamp` field. */
  sendBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `sendFinalized` field. */
  sendFinalized: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `sendLogIndex` field. */
  sendLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sendTransactionHash` field. */
  sendTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sourceChainId` field. */
  sourceChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceRouter` field. */
  sourceRouter: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceSchema` field. */
  sourceSchema: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `state` field. */
  state: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `votes` field. */
  votes: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `CcipMessagesFlat` object types. All fields are combined with a logical ‘and.’ */
export type CcipMessagesFlatFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipMessagesFlatFilter>>
  /** Filter by the object’s `blessBlockHash` field. */
  blessBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blessBlockNumber` field. */
  blessBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `blessLogIndex` field. */
  blessLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `blessTransactionHash` field. */
  blessTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `commitBlockHash` field. */
  commitBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `commitBlockNumber` field. */
  commitBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `commitLogIndex` field. */
  commitLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `commitStore` field. */
  commitStore: InputMaybe<StringFilter>
  /** Filter by the object’s `commitTransactionHash` field. */
  commitTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `destRouter` field. */
  destRouter: InputMaybe<StringFilter>
  /** Filter by the object’s `firstReceiptBlockHash` field. */
  firstReceiptBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `firstReceiptBlockNumber` field. */
  firstReceiptBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `firstReceiptInfo` field. */
  firstReceiptInfo: InputMaybe<JsonFilter>
  /** Filter by the object’s `firstReceiptLogIndex` field. */
  firstReceiptLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `firstReceiptTransactionHash` field. */
  firstReceiptTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `info` field. */
  info: InputMaybe<JsonFilter>
  /** Filter by the object’s `max` field. */
  max: InputMaybe<IntFilter>
  /** Filter by the object’s `messageId` field. */
  messageId: InputMaybe<StringFilter>
  /** Filter by the object’s `min` field. */
  min: InputMaybe<IntFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipMessagesFlatFilter>
  /** Filter by the object’s `offramp` field. */
  offramp: InputMaybe<StringFilter>
  /** Filter by the object’s `onramp` field. */
  onramp: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipMessagesFlatFilter>>
  /** Filter by the object’s `origin` field. */
  origin: InputMaybe<StringFilter>
  /** Filter by the object’s `receiptBlockHash` field. */
  receiptBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `receiptBlockNumber` field. */
  receiptBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `receiptInfo` field. */
  receiptInfo: InputMaybe<JsonFilter>
  /** Filter by the object’s `receiptLogIndex` field. */
  receiptLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `receiptTransactionHash` field. */
  receiptTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `rmn` field. */
  rmn: InputMaybe<StringFilter>
  /** Filter by the object’s `root` field. */
  root: InputMaybe<StringFilter>
  /** Filter by the object’s `sendBlockHash` field. */
  sendBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `sendBlockNumber` field. */
  sendBlockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sendLogIndex` field. */
  sendLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `sendTransactionHash` field. */
  sendTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceRouter` field. */
  sourceRouter: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceSchema` field. */
  sourceSchema: InputMaybe<StringFilter>
  /** Filter by the object’s `state` field. */
  state: InputMaybe<IntFilter>
  /** Filter by the object’s `votes` field. */
  votes: InputMaybe<IntFilter>
}

/** A connection to a list of `CcipMessagesFlat` values. */
export type CcipMessagesFlatsConnection = {
  __typename?: "CcipMessagesFlatsConnection"
  /** A list of edges which contains the `CcipMessagesFlat` and cursor to aid in pagination. */
  edges: Array<CcipMessagesFlatsEdge>
  /** A list of `CcipMessagesFlat` objects. */
  nodes: Array<CcipMessagesFlat>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipMessagesFlat` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipMessagesFlat` edge in the connection. */
export type CcipMessagesFlatsEdge = {
  __typename?: "CcipMessagesFlatsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipMessagesFlat` at the end of the edge. */
  node: CcipMessagesFlat
}

/** Methods to use when ordering `CcipMessagesFlat`. */
export enum CcipMessagesFlatsOrderBy {
  BlessBlockHashAsc = "BLESS_BLOCK_HASH_ASC",
  BlessBlockHashDesc = "BLESS_BLOCK_HASH_DESC",
  BlessBlockNumberAsc = "BLESS_BLOCK_NUMBER_ASC",
  BlessBlockNumberDesc = "BLESS_BLOCK_NUMBER_DESC",
  BlessBlockTimestampAsc = "BLESS_BLOCK_TIMESTAMP_ASC",
  BlessBlockTimestampDesc = "BLESS_BLOCK_TIMESTAMP_DESC",
  BlessLogIndexAsc = "BLESS_LOG_INDEX_ASC",
  BlessLogIndexDesc = "BLESS_LOG_INDEX_DESC",
  BlessTransactionHashAsc = "BLESS_TRANSACTION_HASH_ASC",
  BlessTransactionHashDesc = "BLESS_TRANSACTION_HASH_DESC",
  CommitBlockHashAsc = "COMMIT_BLOCK_HASH_ASC",
  CommitBlockHashDesc = "COMMIT_BLOCK_HASH_DESC",
  CommitBlockNumberAsc = "COMMIT_BLOCK_NUMBER_ASC",
  CommitBlockNumberDesc = "COMMIT_BLOCK_NUMBER_DESC",
  CommitBlockTimestampAsc = "COMMIT_BLOCK_TIMESTAMP_ASC",
  CommitBlockTimestampDesc = "COMMIT_BLOCK_TIMESTAMP_DESC",
  CommitLogIndexAsc = "COMMIT_LOG_INDEX_ASC",
  CommitLogIndexDesc = "COMMIT_LOG_INDEX_DESC",
  CommitStoreAsc = "COMMIT_STORE_ASC",
  CommitStoreDesc = "COMMIT_STORE_DESC",
  CommitTransactionHashAsc = "COMMIT_TRANSACTION_HASH_ASC",
  CommitTransactionHashDesc = "COMMIT_TRANSACTION_HASH_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  DataAsc = "DATA_ASC",
  DataDesc = "DATA_DESC",
  DestChainIdAsc = "DEST_CHAIN_ID_ASC",
  DestChainIdDesc = "DEST_CHAIN_ID_DESC",
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  DestRouterAsc = "DEST_ROUTER_ASC",
  DestRouterDesc = "DEST_ROUTER_DESC",
  FirstReceiptBlockHashAsc = "FIRST_RECEIPT_BLOCK_HASH_ASC",
  FirstReceiptBlockHashDesc = "FIRST_RECEIPT_BLOCK_HASH_DESC",
  FirstReceiptBlockNumberAsc = "FIRST_RECEIPT_BLOCK_NUMBER_ASC",
  FirstReceiptBlockNumberDesc = "FIRST_RECEIPT_BLOCK_NUMBER_DESC",
  FirstReceiptBlockTimestampAsc = "FIRST_RECEIPT_BLOCK_TIMESTAMP_ASC",
  FirstReceiptBlockTimestampDesc = "FIRST_RECEIPT_BLOCK_TIMESTAMP_DESC",
  FirstReceiptInfoAsc = "FIRST_RECEIPT_INFO_ASC",
  FirstReceiptInfoDesc = "FIRST_RECEIPT_INFO_DESC",
  FirstReceiptLogIndexAsc = "FIRST_RECEIPT_LOG_INDEX_ASC",
  FirstReceiptLogIndexDesc = "FIRST_RECEIPT_LOG_INDEX_DESC",
  FirstReceiptTransactionHashAsc = "FIRST_RECEIPT_TRANSACTION_HASH_ASC",
  FirstReceiptTransactionHashDesc = "FIRST_RECEIPT_TRANSACTION_HASH_DESC",
  InfoAsc = "INFO_ASC",
  InfoDesc = "INFO_DESC",
  MaxAsc = "MAX_ASC",
  MaxDesc = "MAX_DESC",
  MessageIdAsc = "MESSAGE_ID_ASC",
  MessageIdDesc = "MESSAGE_ID_DESC",
  MinAsc = "MIN_ASC",
  MinDesc = "MIN_DESC",
  Natural = "NATURAL",
  OfframpAsc = "OFFRAMP_ASC",
  OfframpDesc = "OFFRAMP_DESC",
  OnrampAsc = "ONRAMP_ASC",
  OnrampDesc = "ONRAMP_DESC",
  OriginAsc = "ORIGIN_ASC",
  OriginDesc = "ORIGIN_DESC",
  ReceiptBlockHashAsc = "RECEIPT_BLOCK_HASH_ASC",
  ReceiptBlockHashDesc = "RECEIPT_BLOCK_HASH_DESC",
  ReceiptBlockNumberAsc = "RECEIPT_BLOCK_NUMBER_ASC",
  ReceiptBlockNumberDesc = "RECEIPT_BLOCK_NUMBER_DESC",
  ReceiptBlockTimestampAsc = "RECEIPT_BLOCK_TIMESTAMP_ASC",
  ReceiptBlockTimestampDesc = "RECEIPT_BLOCK_TIMESTAMP_DESC",
  ReceiptInfoAsc = "RECEIPT_INFO_ASC",
  ReceiptInfoDesc = "RECEIPT_INFO_DESC",
  ReceiptLogIndexAsc = "RECEIPT_LOG_INDEX_ASC",
  ReceiptLogIndexDesc = "RECEIPT_LOG_INDEX_DESC",
  ReceiptTransactionHashAsc = "RECEIPT_TRANSACTION_HASH_ASC",
  ReceiptTransactionHashDesc = "RECEIPT_TRANSACTION_HASH_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  RmnAsc = "RMN_ASC",
  RmnDesc = "RMN_DESC",
  RootAsc = "ROOT_ASC",
  RootDesc = "ROOT_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  SendBlockHashAsc = "SEND_BLOCK_HASH_ASC",
  SendBlockHashDesc = "SEND_BLOCK_HASH_DESC",
  SendBlockNumberAsc = "SEND_BLOCK_NUMBER_ASC",
  SendBlockNumberDesc = "SEND_BLOCK_NUMBER_DESC",
  SendBlockTimestampAsc = "SEND_BLOCK_TIMESTAMP_ASC",
  SendBlockTimestampDesc = "SEND_BLOCK_TIMESTAMP_DESC",
  SendFinalizedAsc = "SEND_FINALIZED_ASC",
  SendFinalizedDesc = "SEND_FINALIZED_DESC",
  SendLogIndexAsc = "SEND_LOG_INDEX_ASC",
  SendLogIndexDesc = "SEND_LOG_INDEX_DESC",
  SendTransactionHashAsc = "SEND_TRANSACTION_HASH_ASC",
  SendTransactionHashDesc = "SEND_TRANSACTION_HASH_DESC",
  SequenceNumberAsc = "SEQUENCE_NUMBER_ASC",
  SequenceNumberDesc = "SEQUENCE_NUMBER_DESC",
  SourceChainIdAsc = "SOURCE_CHAIN_ID_ASC",
  SourceChainIdDesc = "SOURCE_CHAIN_ID_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SourceRouterAsc = "SOURCE_ROUTER_ASC",
  SourceRouterDesc = "SOURCE_ROUTER_DESC",
  SourceSchemaAsc = "SOURCE_SCHEMA_ASC",
  SourceSchemaDesc = "SOURCE_SCHEMA_DESC",
  StateAsc = "STATE_ASC",
  StateDesc = "STATE_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  VotesAsc = "VOTES_ASC",
  VotesDesc = "VOTES_DESC",
}

/** Methods to use when ordering `CcipMessage`. */
export enum CcipMessagesOrderBy {
  ArmAsc = "ARM_ASC",
  ArmDesc = "ARM_DESC",
  BlessBlockNumberAsc = "BLESS_BLOCK_NUMBER_ASC",
  BlessBlockNumberDesc = "BLESS_BLOCK_NUMBER_DESC",
  BlessBlockTimestampAsc = "BLESS_BLOCK_TIMESTAMP_ASC",
  BlessBlockTimestampDesc = "BLESS_BLOCK_TIMESTAMP_DESC",
  BlessLogIndexAsc = "BLESS_LOG_INDEX_ASC",
  BlessLogIndexDesc = "BLESS_LOG_INDEX_DESC",
  BlessTransactionHashAsc = "BLESS_TRANSACTION_HASH_ASC",
  BlessTransactionHashDesc = "BLESS_TRANSACTION_HASH_DESC",
  CommitBlockNumberAsc = "COMMIT_BLOCK_NUMBER_ASC",
  CommitBlockNumberDesc = "COMMIT_BLOCK_NUMBER_DESC",
  CommitBlockTimestampAsc = "COMMIT_BLOCK_TIMESTAMP_ASC",
  CommitBlockTimestampDesc = "COMMIT_BLOCK_TIMESTAMP_DESC",
  CommitLogIndexAsc = "COMMIT_LOG_INDEX_ASC",
  CommitLogIndexDesc = "COMMIT_LOG_INDEX_DESC",
  CommitStoreAsc = "COMMIT_STORE_ASC",
  CommitStoreDesc = "COMMIT_STORE_DESC",
  CommitTransactionHashAsc = "COMMIT_TRANSACTION_HASH_ASC",
  CommitTransactionHashDesc = "COMMIT_TRANSACTION_HASH_DESC",
  DataAsc = "DATA_ASC",
  DataDesc = "DATA_DESC",
  DestChainIdAsc = "DEST_CHAIN_ID_ASC",
  DestChainIdDesc = "DEST_CHAIN_ID_DESC",
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  DestRouterAddressAsc = "DEST_ROUTER_ADDRESS_ASC",
  DestRouterAddressDesc = "DEST_ROUTER_ADDRESS_DESC",
  FeeTokenAmountAsc = "FEE_TOKEN_AMOUNT_ASC",
  FeeTokenAmountDesc = "FEE_TOKEN_AMOUNT_DESC",
  FeeTokenAsc = "FEE_TOKEN_ASC",
  FeeTokenDesc = "FEE_TOKEN_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  InfoAsc = "INFO_ASC",
  InfoDesc = "INFO_DESC",
  MaxAsc = "MAX_ASC",
  MaxDesc = "MAX_DESC",
  MessageIdAsc = "MESSAGE_ID_ASC",
  MessageIdDesc = "MESSAGE_ID_DESC",
  MinAsc = "MIN_ASC",
  MinDesc = "MIN_DESC",
  Natural = "NATURAL",
  NonceAsc = "NONCE_ASC",
  NonceDesc = "NONCE_DESC",
  OfframpAddressAsc = "OFFRAMP_ADDRESS_ASC",
  OfframpAddressDesc = "OFFRAMP_ADDRESS_DESC",
  OnrampAddressAsc = "ONRAMP_ADDRESS_ASC",
  OnrampAddressDesc = "ONRAMP_ADDRESS_DESC",
  OriginAsc = "ORIGIN_ASC",
  OriginDesc = "ORIGIN_DESC",
  ReceiptBlockAsc = "RECEIPT_BLOCK_ASC",
  ReceiptBlockDesc = "RECEIPT_BLOCK_DESC",
  ReceiptFinalizedAsc = "RECEIPT_FINALIZED_ASC",
  ReceiptFinalizedDesc = "RECEIPT_FINALIZED_DESC",
  ReceiptLogIndexAsc = "RECEIPT_LOG_INDEX_ASC",
  ReceiptLogIndexDesc = "RECEIPT_LOG_INDEX_DESC",
  ReceiptTimestampAsc = "RECEIPT_TIMESTAMP_ASC",
  ReceiptTimestampDesc = "RECEIPT_TIMESTAMP_DESC",
  ReceiptTransactionHashAsc = "RECEIPT_TRANSACTION_HASH_ASC",
  ReceiptTransactionHashDesc = "RECEIPT_TRANSACTION_HASH_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  RootAsc = "ROOT_ASC",
  RootDesc = "ROOT_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  SendBlockAsc = "SEND_BLOCK_ASC",
  SendBlockDesc = "SEND_BLOCK_DESC",
  SendFinalizedAsc = "SEND_FINALIZED_ASC",
  SendFinalizedDesc = "SEND_FINALIZED_DESC",
  SendLogIndexAsc = "SEND_LOG_INDEX_ASC",
  SendLogIndexDesc = "SEND_LOG_INDEX_DESC",
  SendTimestampAsc = "SEND_TIMESTAMP_ASC",
  SendTimestampDesc = "SEND_TIMESTAMP_DESC",
  SendTransactionHashAsc = "SEND_TRANSACTION_HASH_ASC",
  SendTransactionHashDesc = "SEND_TRANSACTION_HASH_DESC",
  SequenceNumberAsc = "SEQUENCE_NUMBER_ASC",
  SequenceNumberDesc = "SEQUENCE_NUMBER_DESC",
  SourceChainIdAsc = "SOURCE_CHAIN_ID_ASC",
  SourceChainIdDesc = "SOURCE_CHAIN_ID_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  StateAsc = "STATE_ASC",
  StateDesc = "STATE_DESC",
  StrictAsc = "STRICT_ASC",
  StrictDesc = "STRICT_DESC",
  TokenAmountsAsc = "TOKEN_AMOUNTS_ASC",
  TokenAmountsDesc = "TOKEN_AMOUNTS_DESC",
  VotesAsc = "VOTES_ASC",
  VotesDesc = "VOTES_DESC",
}

export type CcipSend = {
  __typename?: "CcipSend"
  data: Maybe<Scalars["String"]["output"]>
  feeToken: Maybe<Scalars["String"]["output"]>
  feeTokenAmount: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["BigFloat"]["output"]>
  messageId: Maybe<Scalars["String"]["output"]>
  nonce: Maybe<Scalars["Int"]["output"]>
  onrampAddress: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  sequenceNumber: Maybe<Scalars["Int"]["output"]>
  sourceChainSelector: Maybe<Scalars["String"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  sourceTokenData: Maybe<Scalars["String"]["output"]>
  strict: Maybe<Scalars["Boolean"]["output"]>
  tokenAmounts: Maybe<Scalars["JSON"]["output"]>
}

/**
 * A condition to be used against `CcipSend` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CcipSendCondition = {
  /** Checks for equality with the object’s `data` field. */
  data: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeToken` field. */
  feeToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `messageId` field. */
  messageId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `nonce` field. */
  nonce: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sourceChainSelector` field. */
  sourceChainSelector: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceTokenData` field. */
  sourceTokenData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `strict` field. */
  strict: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<Scalars["JSON"]["input"]>
}

/** A filter to be used against `CcipSend` object types. All fields are combined with a logical ‘and.’ */
export type CcipSendFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipSendFilter>>
  /** Filter by the object’s `data` field. */
  data: InputMaybe<StringFilter>
  /** Filter by the object’s `feeToken` field. */
  feeToken: InputMaybe<StringFilter>
  /** Filter by the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<StringFilter>
  /** Filter by the object’s `messageId` field. */
  messageId: InputMaybe<StringFilter>
  /** Filter by the object’s `nonce` field. */
  nonce: InputMaybe<IntFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipSendFilter>
  /** Filter by the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipSendFilter>>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sourceChainSelector` field. */
  sourceChainSelector: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceTokenData` field. */
  sourceTokenData: InputMaybe<StringFilter>
  /** Filter by the object’s `strict` field. */
  strict: InputMaybe<BooleanFilter>
  /** Filter by the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<JsonFilter>
}

/** A connection to a list of `CcipSend` values. */
export type CcipSendsConnection = {
  __typename?: "CcipSendsConnection"
  /** A list of edges which contains the `CcipSend` and cursor to aid in pagination. */
  edges: Array<CcipSendsEdge>
  /** A list of `CcipSend` objects. */
  nodes: Array<CcipSend>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipSend` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipSend` edge in the connection. */
export type CcipSendsEdge = {
  __typename?: "CcipSendsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipSend` at the end of the edge. */
  node: CcipSend
}

/** Methods to use when ordering `CcipSend`. */
export enum CcipSendsOrderBy {
  DataAsc = "DATA_ASC",
  DataDesc = "DATA_DESC",
  FeeTokenAmountAsc = "FEE_TOKEN_AMOUNT_ASC",
  FeeTokenAmountDesc = "FEE_TOKEN_AMOUNT_DESC",
  FeeTokenAsc = "FEE_TOKEN_ASC",
  FeeTokenDesc = "FEE_TOKEN_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  MessageIdAsc = "MESSAGE_ID_ASC",
  MessageIdDesc = "MESSAGE_ID_DESC",
  Natural = "NATURAL",
  NonceAsc = "NONCE_ASC",
  NonceDesc = "NONCE_DESC",
  OnrampAddressAsc = "ONRAMP_ADDRESS_ASC",
  OnrampAddressDesc = "ONRAMP_ADDRESS_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  SequenceNumberAsc = "SEQUENCE_NUMBER_ASC",
  SequenceNumberDesc = "SEQUENCE_NUMBER_DESC",
  SourceChainSelectorAsc = "SOURCE_CHAIN_SELECTOR_ASC",
  SourceChainSelectorDesc = "SOURCE_CHAIN_SELECTOR_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SourceTokenDataAsc = "SOURCE_TOKEN_DATA_ASC",
  SourceTokenDataDesc = "SOURCE_TOKEN_DATA_DESC",
  StrictAsc = "STRICT_ASC",
  StrictDesc = "STRICT_DESC",
  TokenAmountsAsc = "TOKEN_AMOUNTS_ASC",
  TokenAmountsDesc = "TOKEN_AMOUNTS_DESC",
}

export type CcipTokenPool = {
  __typename?: "CcipTokenPool"
  administrator: Maybe<Scalars["String"]["output"]>
  allowlist: Maybe<Scalars["JSON"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["Int"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  owner: Maybe<Scalars["String"]["output"]>
  pendingAdministrator: Maybe<Scalars["String"]["output"]>
  pendingOwner: Maybe<Scalars["String"]["output"]>
  previousPool: Maybe<Scalars["String"]["output"]>
  previousPoolTypeAndVersion: Maybe<Scalars["String"]["output"]>
  registry: Maybe<Scalars["String"]["output"]>
  router: Maybe<Scalars["String"]["output"]>
  token: Maybe<Scalars["String"]["output"]>
  tokenDecimals: Maybe<Scalars["Int"]["output"]>
  tokenName: Maybe<Scalars["String"]["output"]>
  tokenPool: Maybe<Scalars["String"]["output"]>
  tokenSymbol: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  typeAndVersion: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `CcipTokenPool` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolCondition = {
  /** Checks for equality with the object’s `administrator` field. */
  administrator: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `allowlist` field. */
  allowlist: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `owner` field. */
  owner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingAdministrator` field. */
  pendingAdministrator: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingOwner` field. */
  pendingOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `previousPool` field. */
  previousPool: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registry` field. */
  registry: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `router` field. */
  router: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `token` field. */
  token: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenDecimals` field. */
  tokenDecimals: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `tokenName` field. */
  tokenName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenPool` field. */
  tokenPool: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenSymbol` field. */
  tokenSymbol: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `typeAndVersion` field. */
  typeAndVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

export type CcipTokenPoolEvent = {
  __typename?: "CcipTokenPoolEvent"
  amount: Maybe<Scalars["BigFloat"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["Int"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  event: Maybe<Scalars["String"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  tokenAddress: Maybe<Scalars["String"]["output"]>
  tokenPoolAddress: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `CcipTokenPoolEvent` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolEventCondition = {
  /** Checks for equality with the object’s `amount` field. */
  amount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `event` field. */
  event: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenAddress` field. */
  tokenAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenPoolAddress` field. */
  tokenPoolAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `CcipTokenPoolEvent` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTokenPoolEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `event` field. */
  event: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTokenPoolEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTokenPoolEventFilter>>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `removed` field. */
  removed: InputMaybe<BooleanFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenAddress` field. */
  tokenAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenPoolAddress` field. */
  tokenPoolAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipTokenPoolEvent` values. */
export type CcipTokenPoolEventsConnection = {
  __typename?: "CcipTokenPoolEventsConnection"
  /** A list of edges which contains the `CcipTokenPoolEvent` and cursor to aid in pagination. */
  edges: Array<CcipTokenPoolEventsEdge>
  /** A list of `CcipTokenPoolEvent` objects. */
  nodes: Array<CcipTokenPoolEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTokenPoolEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTokenPoolEvent` edge in the connection. */
export type CcipTokenPoolEventsEdge = {
  __typename?: "CcipTokenPoolEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTokenPoolEvent` at the end of the edge. */
  node: CcipTokenPoolEvent
}

/** Methods to use when ordering `CcipTokenPoolEvent`. */
export enum CcipTokenPoolEventsOrderBy {
  AmountAsc = "AMOUNT_ASC",
  AmountDesc = "AMOUNT_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventAsc = "EVENT_ASC",
  EventDesc = "EVENT_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  TokenAddressAsc = "TOKEN_ADDRESS_ASC",
  TokenAddressDesc = "TOKEN_ADDRESS_DESC",
  TokenPoolAddressAsc = "TOKEN_POOL_ADDRESS_ASC",
  TokenPoolAddressDesc = "TOKEN_POOL_ADDRESS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

/** A filter to be used against `CcipTokenPool` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolFilter = {
  /** Filter by the object’s `administrator` field. */
  administrator: InputMaybe<StringFilter>
  /** Filter by the object’s `allowlist` field. */
  allowlist: InputMaybe<JsonFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTokenPoolFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTokenPoolFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTokenPoolFilter>>
  /** Filter by the object’s `owner` field. */
  owner: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingAdministrator` field. */
  pendingAdministrator: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingOwner` field. */
  pendingOwner: InputMaybe<StringFilter>
  /** Filter by the object’s `previousPool` field. */
  previousPool: InputMaybe<StringFilter>
  /** Filter by the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion: InputMaybe<StringFilter>
  /** Filter by the object’s `registry` field. */
  registry: InputMaybe<StringFilter>
  /** Filter by the object’s `router` field. */
  router: InputMaybe<StringFilter>
  /** Filter by the object’s `token` field. */
  token: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenDecimals` field. */
  tokenDecimals: InputMaybe<IntFilter>
  /** Filter by the object’s `tokenName` field. */
  tokenName: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenPool` field. */
  tokenPool: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenSymbol` field. */
  tokenSymbol: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `typeAndVersion` field. */
  typeAndVersion: InputMaybe<StringFilter>
}

export type CcipTokenPoolLane = {
  __typename?: "CcipTokenPoolLane"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["Int"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  inboundCapacity: Maybe<Scalars["BigFloat"]["output"]>
  inboundEnabled: Maybe<Scalars["Boolean"]["output"]>
  inboundRate: Maybe<Scalars["BigFloat"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  outboundCapacity: Maybe<Scalars["BigFloat"]["output"]>
  outboundEnabled: Maybe<Scalars["Boolean"]["output"]>
  outboundRate: Maybe<Scalars["BigFloat"]["output"]>
  remoteNetworkName: Maybe<Scalars["String"]["output"]>
  remoteToken: Maybe<Scalars["String"]["output"]>
  remoteTokenPools: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  removed: Maybe<Scalars["Boolean"]["output"]>
  tokenPool: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `CcipTokenPoolLane` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolLaneCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `inboundCapacity` field. */
  inboundCapacity: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `inboundEnabled` field. */
  inboundEnabled: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `inboundRate` field. */
  inboundRate: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `outboundCapacity` field. */
  outboundCapacity: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `outboundEnabled` field. */
  outboundEnabled: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `outboundRate` field. */
  outboundRate: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `remoteNetworkName` field. */
  remoteNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `remoteToken` field. */
  remoteToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `remoteTokenPools` field. */
  remoteTokenPools: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `tokenPool` field. */
  tokenPool: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `CcipTokenPoolLane` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolLaneFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTokenPoolLaneFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `inboundEnabled` field. */
  inboundEnabled: InputMaybe<BooleanFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTokenPoolLaneFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTokenPoolLaneFilter>>
  /** Filter by the object’s `outboundEnabled` field. */
  outboundEnabled: InputMaybe<BooleanFilter>
  /** Filter by the object’s `remoteNetworkName` field. */
  remoteNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `remoteToken` field. */
  remoteToken: InputMaybe<StringFilter>
  /** Filter by the object’s `remoteTokenPools` field. */
  remoteTokenPools: InputMaybe<StringListFilter>
  /** Filter by the object’s `removed` field. */
  removed: InputMaybe<BooleanFilter>
  /** Filter by the object’s `tokenPool` field. */
  tokenPool: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipTokenPoolLane` values. */
export type CcipTokenPoolLanesConnection = {
  __typename?: "CcipTokenPoolLanesConnection"
  /** A list of edges which contains the `CcipTokenPoolLane` and cursor to aid in pagination. */
  edges: Array<CcipTokenPoolLanesEdge>
  /** A list of `CcipTokenPoolLane` objects. */
  nodes: Array<CcipTokenPoolLane>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTokenPoolLane` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTokenPoolLane` edge in the connection. */
export type CcipTokenPoolLanesEdge = {
  __typename?: "CcipTokenPoolLanesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTokenPoolLane` at the end of the edge. */
  node: CcipTokenPoolLane
}

export type CcipTokenPoolLanesGroup = {
  __typename?: "CcipTokenPoolLanesGroup"
  admins: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  owners: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  pk: Maybe<Scalars["String"]["output"]>
  tokenGroup: Maybe<Scalars["JSON"]["output"]>
}

/**
 * A condition to be used against `CcipTokenPoolLanesGroup` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolLanesGroupCondition = {
  /** Checks for equality with the object’s `admins` field. */
  admins: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `owners` field. */
  owners: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Checks for equality with the object’s `pk` field. */
  pk: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenGroup` field. */
  tokenGroup: InputMaybe<Scalars["JSON"]["input"]>
}

/** A filter to be used against `CcipTokenPoolLanesGroup` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolLanesGroupFilter = {
  /** Filter by the object’s `admins` field. */
  admins: InputMaybe<StringListFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTokenPoolLanesGroupFilter>>
  /** Negates the expression. */
  not: InputMaybe<CcipTokenPoolLanesGroupFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTokenPoolLanesGroupFilter>>
  /** Filter by the object’s `owners` field. */
  owners: InputMaybe<StringListFilter>
  /** Filter by the object’s `pk` field. */
  pk: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenGroup` field. */
  tokenGroup: InputMaybe<JsonFilter>
}

/** A connection to a list of `CcipTokenPoolLanesGroup` values. */
export type CcipTokenPoolLanesGroupsConnection = {
  __typename?: "CcipTokenPoolLanesGroupsConnection"
  /** A list of edges which contains the `CcipTokenPoolLanesGroup` and cursor to aid in pagination. */
  edges: Array<CcipTokenPoolLanesGroupsEdge>
  /** A list of `CcipTokenPoolLanesGroup` objects. */
  nodes: Array<CcipTokenPoolLanesGroup>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTokenPoolLanesGroup` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTokenPoolLanesGroup` edge in the connection. */
export type CcipTokenPoolLanesGroupsEdge = {
  __typename?: "CcipTokenPoolLanesGroupsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTokenPoolLanesGroup` at the end of the edge. */
  node: CcipTokenPoolLanesGroup
}

/** Methods to use when ordering `CcipTokenPoolLanesGroup`. */
export enum CcipTokenPoolLanesGroupsOrderBy {
  AdminsAsc = "ADMINS_ASC",
  AdminsDesc = "ADMINS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  Natural = "NATURAL",
  OwnersAsc = "OWNERS_ASC",
  OwnersDesc = "OWNERS_DESC",
  PkAsc = "PK_ASC",
  PkDesc = "PK_DESC",
  TokenGroupAsc = "TOKEN_GROUP_ASC",
  TokenGroupDesc = "TOKEN_GROUP_DESC",
}

/** Methods to use when ordering `CcipTokenPoolLane`. */
export enum CcipTokenPoolLanesOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  InboundCapacityAsc = "INBOUND_CAPACITY_ASC",
  InboundCapacityDesc = "INBOUND_CAPACITY_DESC",
  InboundEnabledAsc = "INBOUND_ENABLED_ASC",
  InboundEnabledDesc = "INBOUND_ENABLED_DESC",
  InboundRateAsc = "INBOUND_RATE_ASC",
  InboundRateDesc = "INBOUND_RATE_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OutboundCapacityAsc = "OUTBOUND_CAPACITY_ASC",
  OutboundCapacityDesc = "OUTBOUND_CAPACITY_DESC",
  OutboundEnabledAsc = "OUTBOUND_ENABLED_ASC",
  OutboundEnabledDesc = "OUTBOUND_ENABLED_DESC",
  OutboundRateAsc = "OUTBOUND_RATE_ASC",
  OutboundRateDesc = "OUTBOUND_RATE_DESC",
  RemoteNetworkNameAsc = "REMOTE_NETWORK_NAME_ASC",
  RemoteNetworkNameDesc = "REMOTE_NETWORK_NAME_DESC",
  RemoteTokenAsc = "REMOTE_TOKEN_ASC",
  RemoteTokenDesc = "REMOTE_TOKEN_DESC",
  RemoteTokenPoolsAsc = "REMOTE_TOKEN_POOLS_ASC",
  RemoteTokenPoolsDesc = "REMOTE_TOKEN_POOLS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TokenPoolAsc = "TOKEN_POOL_ASC",
  TokenPoolDesc = "TOKEN_POOL_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type CcipTokenPoolLanesWithPool = {
  __typename?: "CcipTokenPoolLanesWithPool"
  administrator: Maybe<Scalars["String"]["output"]>
  allowlist: Maybe<Scalars["JSON"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["Int"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  inboundCapacity: Maybe<Scalars["BigFloat"]["output"]>
  inboundEnabled: Maybe<Scalars["Boolean"]["output"]>
  inboundRate: Maybe<Scalars["BigFloat"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  outboundCapacity: Maybe<Scalars["BigFloat"]["output"]>
  outboundEnabled: Maybe<Scalars["Boolean"]["output"]>
  outboundRate: Maybe<Scalars["BigFloat"]["output"]>
  owner: Maybe<Scalars["String"]["output"]>
  pendingAdministrator: Maybe<Scalars["String"]["output"]>
  pendingOwner: Maybe<Scalars["String"]["output"]>
  previousPool: Maybe<Scalars["String"]["output"]>
  previousPoolTypeAndVersion: Maybe<Scalars["String"]["output"]>
  registry: Maybe<Scalars["String"]["output"]>
  remoteNetworkName: Maybe<Scalars["String"]["output"]>
  remoteToken: Maybe<Scalars["String"]["output"]>
  remoteTokenPools: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  removed: Maybe<Scalars["Boolean"]["output"]>
  router: Maybe<Scalars["String"]["output"]>
  token: Maybe<Scalars["String"]["output"]>
  tokenDecimals: Maybe<Scalars["Int"]["output"]>
  tokenName: Maybe<Scalars["String"]["output"]>
  tokenPool: Maybe<Scalars["String"]["output"]>
  tokenRegisteredAt: Maybe<Scalars["Datetime"]["output"]>
  tokenSymbol: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  typeAndVersion: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `CcipTokenPoolLanesWithPool` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type CcipTokenPoolLanesWithPoolCondition = {
  /** Checks for equality with the object’s `administrator` field. */
  administrator: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `allowlist` field. */
  allowlist: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `inboundCapacity` field. */
  inboundCapacity: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `inboundEnabled` field. */
  inboundEnabled: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `inboundRate` field. */
  inboundRate: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `outboundCapacity` field. */
  outboundCapacity: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `outboundEnabled` field. */
  outboundEnabled: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `outboundRate` field. */
  outboundRate: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `owner` field. */
  owner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingAdministrator` field. */
  pendingAdministrator: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingOwner` field. */
  pendingOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `previousPool` field. */
  previousPool: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registry` field. */
  registry: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `remoteNetworkName` field. */
  remoteNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `remoteToken` field. */
  remoteToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `remoteTokenPools` field. */
  remoteTokenPools: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `router` field. */
  router: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `token` field. */
  token: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenDecimals` field. */
  tokenDecimals: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `tokenName` field. */
  tokenName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenPool` field. */
  tokenPool: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `tokenRegisteredAt` field. */
  tokenRegisteredAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `tokenSymbol` field. */
  tokenSymbol: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `typeAndVersion` field. */
  typeAndVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `CcipTokenPoolLanesWithPool` object types. All fields are combined with a logical ‘and.’ */
export type CcipTokenPoolLanesWithPoolFilter = {
  /** Filter by the object’s `administrator` field. */
  administrator: InputMaybe<StringFilter>
  /** Filter by the object’s `allowlist` field. */
  allowlist: InputMaybe<JsonFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTokenPoolLanesWithPoolFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `inboundEnabled` field. */
  inboundEnabled: InputMaybe<BooleanFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTokenPoolLanesWithPoolFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTokenPoolLanesWithPoolFilter>>
  /** Filter by the object’s `outboundEnabled` field. */
  outboundEnabled: InputMaybe<BooleanFilter>
  /** Filter by the object’s `owner` field. */
  owner: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingAdministrator` field. */
  pendingAdministrator: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingOwner` field. */
  pendingOwner: InputMaybe<StringFilter>
  /** Filter by the object’s `previousPool` field. */
  previousPool: InputMaybe<StringFilter>
  /** Filter by the object’s `previousPoolTypeAndVersion` field. */
  previousPoolTypeAndVersion: InputMaybe<StringFilter>
  /** Filter by the object’s `registry` field. */
  registry: InputMaybe<StringFilter>
  /** Filter by the object’s `remoteNetworkName` field. */
  remoteNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `remoteToken` field. */
  remoteToken: InputMaybe<StringFilter>
  /** Filter by the object’s `remoteTokenPools` field. */
  remoteTokenPools: InputMaybe<StringListFilter>
  /** Filter by the object’s `removed` field. */
  removed: InputMaybe<BooleanFilter>
  /** Filter by the object’s `router` field. */
  router: InputMaybe<StringFilter>
  /** Filter by the object’s `token` field. */
  token: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenDecimals` field. */
  tokenDecimals: InputMaybe<IntFilter>
  /** Filter by the object’s `tokenName` field. */
  tokenName: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenPool` field. */
  tokenPool: InputMaybe<StringFilter>
  /** Filter by the object’s `tokenSymbol` field. */
  tokenSymbol: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `typeAndVersion` field. */
  typeAndVersion: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipTokenPoolLanesWithPool` values. */
export type CcipTokenPoolLanesWithPoolsConnection = {
  __typename?: "CcipTokenPoolLanesWithPoolsConnection"
  /** A list of edges which contains the `CcipTokenPoolLanesWithPool` and cursor to aid in pagination. */
  edges: Array<CcipTokenPoolLanesWithPoolsEdge>
  /** A list of `CcipTokenPoolLanesWithPool` objects. */
  nodes: Array<CcipTokenPoolLanesWithPool>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTokenPoolLanesWithPool` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTokenPoolLanesWithPool` edge in the connection. */
export type CcipTokenPoolLanesWithPoolsEdge = {
  __typename?: "CcipTokenPoolLanesWithPoolsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTokenPoolLanesWithPool` at the end of the edge. */
  node: CcipTokenPoolLanesWithPool
}

/** Methods to use when ordering `CcipTokenPoolLanesWithPool`. */
export enum CcipTokenPoolLanesWithPoolsOrderBy {
  AdministratorAsc = "ADMINISTRATOR_ASC",
  AdministratorDesc = "ADMINISTRATOR_DESC",
  AllowlistAsc = "ALLOWLIST_ASC",
  AllowlistDesc = "ALLOWLIST_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  InboundCapacityAsc = "INBOUND_CAPACITY_ASC",
  InboundCapacityDesc = "INBOUND_CAPACITY_DESC",
  InboundEnabledAsc = "INBOUND_ENABLED_ASC",
  InboundEnabledDesc = "INBOUND_ENABLED_DESC",
  InboundRateAsc = "INBOUND_RATE_ASC",
  InboundRateDesc = "INBOUND_RATE_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OutboundCapacityAsc = "OUTBOUND_CAPACITY_ASC",
  OutboundCapacityDesc = "OUTBOUND_CAPACITY_DESC",
  OutboundEnabledAsc = "OUTBOUND_ENABLED_ASC",
  OutboundEnabledDesc = "OUTBOUND_ENABLED_DESC",
  OutboundRateAsc = "OUTBOUND_RATE_ASC",
  OutboundRateDesc = "OUTBOUND_RATE_DESC",
  OwnerAsc = "OWNER_ASC",
  OwnerDesc = "OWNER_DESC",
  PendingAdministratorAsc = "PENDING_ADMINISTRATOR_ASC",
  PendingAdministratorDesc = "PENDING_ADMINISTRATOR_DESC",
  PendingOwnerAsc = "PENDING_OWNER_ASC",
  PendingOwnerDesc = "PENDING_OWNER_DESC",
  PreviousPoolAsc = "PREVIOUS_POOL_ASC",
  PreviousPoolDesc = "PREVIOUS_POOL_DESC",
  PreviousPoolTypeAndVersionAsc = "PREVIOUS_POOL_TYPE_AND_VERSION_ASC",
  PreviousPoolTypeAndVersionDesc = "PREVIOUS_POOL_TYPE_AND_VERSION_DESC",
  RegistryAsc = "REGISTRY_ASC",
  RegistryDesc = "REGISTRY_DESC",
  RemoteNetworkNameAsc = "REMOTE_NETWORK_NAME_ASC",
  RemoteNetworkNameDesc = "REMOTE_NETWORK_NAME_DESC",
  RemoteTokenAsc = "REMOTE_TOKEN_ASC",
  RemoteTokenDesc = "REMOTE_TOKEN_DESC",
  RemoteTokenPoolsAsc = "REMOTE_TOKEN_POOLS_ASC",
  RemoteTokenPoolsDesc = "REMOTE_TOKEN_POOLS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  RouterAsc = "ROUTER_ASC",
  RouterDesc = "ROUTER_DESC",
  TokenAsc = "TOKEN_ASC",
  TokenDecimalsAsc = "TOKEN_DECIMALS_ASC",
  TokenDecimalsDesc = "TOKEN_DECIMALS_DESC",
  TokenDesc = "TOKEN_DESC",
  TokenNameAsc = "TOKEN_NAME_ASC",
  TokenNameDesc = "TOKEN_NAME_DESC",
  TokenPoolAsc = "TOKEN_POOL_ASC",
  TokenPoolDesc = "TOKEN_POOL_DESC",
  TokenRegisteredAtAsc = "TOKEN_REGISTERED_AT_ASC",
  TokenRegisteredAtDesc = "TOKEN_REGISTERED_AT_DESC",
  TokenSymbolAsc = "TOKEN_SYMBOL_ASC",
  TokenSymbolDesc = "TOKEN_SYMBOL_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TypeAndVersionAsc = "TYPE_AND_VERSION_ASC",
  TypeAndVersionDesc = "TYPE_AND_VERSION_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

/** A connection to a list of `CcipTokenPool` values. */
export type CcipTokenPoolsConnection = {
  __typename?: "CcipTokenPoolsConnection"
  /** A list of edges which contains the `CcipTokenPool` and cursor to aid in pagination. */
  edges: Array<CcipTokenPoolsEdge>
  /** A list of `CcipTokenPool` objects. */
  nodes: Array<CcipTokenPool>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTokenPool` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTokenPool` edge in the connection. */
export type CcipTokenPoolsEdge = {
  __typename?: "CcipTokenPoolsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTokenPool` at the end of the edge. */
  node: CcipTokenPool
}

/** Methods to use when ordering `CcipTokenPool`. */
export enum CcipTokenPoolsOrderBy {
  AdministratorAsc = "ADMINISTRATOR_ASC",
  AdministratorDesc = "ADMINISTRATOR_DESC",
  AllowlistAsc = "ALLOWLIST_ASC",
  AllowlistDesc = "ALLOWLIST_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OwnerAsc = "OWNER_ASC",
  OwnerDesc = "OWNER_DESC",
  PendingAdministratorAsc = "PENDING_ADMINISTRATOR_ASC",
  PendingAdministratorDesc = "PENDING_ADMINISTRATOR_DESC",
  PendingOwnerAsc = "PENDING_OWNER_ASC",
  PendingOwnerDesc = "PENDING_OWNER_DESC",
  PreviousPoolAsc = "PREVIOUS_POOL_ASC",
  PreviousPoolDesc = "PREVIOUS_POOL_DESC",
  PreviousPoolTypeAndVersionAsc = "PREVIOUS_POOL_TYPE_AND_VERSION_ASC",
  PreviousPoolTypeAndVersionDesc = "PREVIOUS_POOL_TYPE_AND_VERSION_DESC",
  RegistryAsc = "REGISTRY_ASC",
  RegistryDesc = "REGISTRY_DESC",
  RouterAsc = "ROUTER_ASC",
  RouterDesc = "ROUTER_DESC",
  TokenAsc = "TOKEN_ASC",
  TokenDecimalsAsc = "TOKEN_DECIMALS_ASC",
  TokenDecimalsDesc = "TOKEN_DECIMALS_DESC",
  TokenDesc = "TOKEN_DESC",
  TokenNameAsc = "TOKEN_NAME_ASC",
  TokenNameDesc = "TOKEN_NAME_DESC",
  TokenPoolAsc = "TOKEN_POOL_ASC",
  TokenPoolDesc = "TOKEN_POOL_DESC",
  TokenSymbolAsc = "TOKEN_SYMBOL_ASC",
  TokenSymbolDesc = "TOKEN_SYMBOL_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TypeAndVersionAsc = "TYPE_AND_VERSION_ASC",
  TypeAndVersionDesc = "TYPE_AND_VERSION_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type CcipTransaction = {
  __typename?: "CcipTransaction"
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  commitStoreAddress: Maybe<Scalars["String"]["output"]>
  destChainId: Maybe<Scalars["BigInt"]["output"]>
  destNetworkName: Maybe<Scalars["String"]["output"]>
  destRouterAddress: Maybe<Scalars["String"]["output"]>
  destTransactionHash: Maybe<Scalars["String"]["output"]>
  info: Maybe<Scalars["JSON"]["output"]>
  messageId: Maybe<Scalars["String"]["output"]>
  offrampAddress: Maybe<Scalars["String"]["output"]>
  onrampAddress: Maybe<Scalars["String"]["output"]>
  origin: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  sequenceNumber: Maybe<Scalars["Int"]["output"]>
  sourceChainId: Maybe<Scalars["BigInt"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  sourceRouterAddress: Maybe<Scalars["String"]["output"]>
  state: Maybe<Scalars["Int"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `CcipTransaction` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CcipTransactionCondition = {
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `commitStoreAddress` field. */
  commitStoreAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destChainId` field. */
  destChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destTransactionHash` field. */
  destTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `info` field. */
  info: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `messageId` field. */
  messageId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `origin` field. */
  origin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sourceChainId` field. */
  sourceChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceRouterAddress` field. */
  sourceRouterAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `state` field. */
  state: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `CcipTransaction` object types. All fields are combined with a logical ‘and.’ */
export type CcipTransactionFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTransactionFilter>>
  /** Filter by the object’s `commitStoreAddress` field. */
  commitStoreAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `destTransactionHash` field. */
  destTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `info` field. */
  info: InputMaybe<JsonFilter>
  /** Filter by the object’s `messageId` field. */
  messageId: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTransactionFilter>
  /** Filter by the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTransactionFilter>>
  /** Filter by the object’s `origin` field. */
  origin: InputMaybe<StringFilter>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceRouterAddress` field. */
  sourceRouterAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `state` field. */
  state: InputMaybe<IntFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipTransaction` values. */
export type CcipTransactionsConnection = {
  __typename?: "CcipTransactionsConnection"
  /** A list of edges which contains the `CcipTransaction` and cursor to aid in pagination. */
  edges: Array<CcipTransactionsEdge>
  /** A list of `CcipTransaction` objects. */
  nodes: Array<CcipTransaction>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTransaction` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTransaction` edge in the connection. */
export type CcipTransactionsEdge = {
  __typename?: "CcipTransactionsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTransaction` at the end of the edge. */
  node: CcipTransaction
}

export type CcipTransactionsFlat = {
  __typename?: "CcipTransactionsFlat"
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  commitStoreAddress: Maybe<Scalars["String"]["output"]>
  data: Maybe<Scalars["String"]["output"]>
  destChainId: Maybe<Scalars["BigInt"]["output"]>
  destNetworkName: Maybe<Scalars["String"]["output"]>
  destRouterAddress: Maybe<Scalars["String"]["output"]>
  destTransactionHash: Maybe<Scalars["String"]["output"]>
  feeToken: Maybe<Scalars["String"]["output"]>
  feeTokenAmount: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["BigFloat"]["output"]>
  info: Maybe<Scalars["JSON"]["output"]>
  messageId: Maybe<Scalars["String"]["output"]>
  nonce: Maybe<Scalars["Int"]["output"]>
  offrampAddress: Maybe<Scalars["String"]["output"]>
  onrampAddress: Maybe<Scalars["String"]["output"]>
  origin: Maybe<Scalars["String"]["output"]>
  receiver: Maybe<Scalars["String"]["output"]>
  sender: Maybe<Scalars["String"]["output"]>
  sequenceNumber: Maybe<Scalars["Int"]["output"]>
  sourceChainId: Maybe<Scalars["BigInt"]["output"]>
  sourceNetworkName: Maybe<Scalars["String"]["output"]>
  sourceRouterAddress: Maybe<Scalars["String"]["output"]>
  state: Maybe<Scalars["Int"]["output"]>
  strict: Maybe<Scalars["Boolean"]["output"]>
  tokenAmounts: Maybe<Scalars["JSON"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `CcipTransactionsFlat` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type CcipTransactionsFlatCondition = {
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `commitStoreAddress` field. */
  commitStoreAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `data` field. */
  data: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destChainId` field. */
  destChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `destTransactionHash` field. */
  destTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeToken` field. */
  feeToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `info` field. */
  info: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `messageId` field. */
  messageId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `nonce` field. */
  nonce: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `origin` field. */
  origin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `receiver` field. */
  receiver: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sender` field. */
  sender: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `sourceChainId` field. */
  sourceChainId: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `sourceRouterAddress` field. */
  sourceRouterAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `state` field. */
  state: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `strict` field. */
  strict: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `CcipTransactionsFlat` object types. All fields are combined with a logical ‘and.’ */
export type CcipTransactionsFlatFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<CcipTransactionsFlatFilter>>
  /** Filter by the object’s `commitStoreAddress` field. */
  commitStoreAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `data` field. */
  data: InputMaybe<StringFilter>
  /** Filter by the object’s `destNetworkName` field. */
  destNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `destRouterAddress` field. */
  destRouterAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `destTransactionHash` field. */
  destTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `feeToken` field. */
  feeToken: InputMaybe<StringFilter>
  /** Filter by the object’s `feeTokenAmount` field. */
  feeTokenAmount: InputMaybe<StringFilter>
  /** Filter by the object’s `info` field. */
  info: InputMaybe<JsonFilter>
  /** Filter by the object’s `messageId` field. */
  messageId: InputMaybe<StringFilter>
  /** Filter by the object’s `nonce` field. */
  nonce: InputMaybe<IntFilter>
  /** Negates the expression. */
  not: InputMaybe<CcipTransactionsFlatFilter>
  /** Filter by the object’s `offrampAddress` field. */
  offrampAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `onrampAddress` field. */
  onrampAddress: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<CcipTransactionsFlatFilter>>
  /** Filter by the object’s `origin` field. */
  origin: InputMaybe<StringFilter>
  /** Filter by the object’s `receiver` field. */
  receiver: InputMaybe<StringFilter>
  /** Filter by the object’s `sender` field. */
  sender: InputMaybe<StringFilter>
  /** Filter by the object’s `sequenceNumber` field. */
  sequenceNumber: InputMaybe<IntFilter>
  /** Filter by the object’s `sourceNetworkName` field. */
  sourceNetworkName: InputMaybe<StringFilter>
  /** Filter by the object’s `sourceRouterAddress` field. */
  sourceRouterAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `state` field. */
  state: InputMaybe<IntFilter>
  /** Filter by the object’s `strict` field. */
  strict: InputMaybe<BooleanFilter>
  /** Filter by the object’s `tokenAmounts` field. */
  tokenAmounts: InputMaybe<JsonFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
}

/** A connection to a list of `CcipTransactionsFlat` values. */
export type CcipTransactionsFlatsConnection = {
  __typename?: "CcipTransactionsFlatsConnection"
  /** A list of edges which contains the `CcipTransactionsFlat` and cursor to aid in pagination. */
  edges: Array<CcipTransactionsFlatsEdge>
  /** A list of `CcipTransactionsFlat` objects. */
  nodes: Array<CcipTransactionsFlat>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `CcipTransactionsFlat` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `CcipTransactionsFlat` edge in the connection. */
export type CcipTransactionsFlatsEdge = {
  __typename?: "CcipTransactionsFlatsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `CcipTransactionsFlat` at the end of the edge. */
  node: CcipTransactionsFlat
}

/** Methods to use when ordering `CcipTransactionsFlat`. */
export enum CcipTransactionsFlatsOrderBy {
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CommitStoreAddressAsc = "COMMIT_STORE_ADDRESS_ASC",
  CommitStoreAddressDesc = "COMMIT_STORE_ADDRESS_DESC",
  DataAsc = "DATA_ASC",
  DataDesc = "DATA_DESC",
  DestChainIdAsc = "DEST_CHAIN_ID_ASC",
  DestChainIdDesc = "DEST_CHAIN_ID_DESC",
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  DestRouterAddressAsc = "DEST_ROUTER_ADDRESS_ASC",
  DestRouterAddressDesc = "DEST_ROUTER_ADDRESS_DESC",
  DestTransactionHashAsc = "DEST_TRANSACTION_HASH_ASC",
  DestTransactionHashDesc = "DEST_TRANSACTION_HASH_DESC",
  FeeTokenAmountAsc = "FEE_TOKEN_AMOUNT_ASC",
  FeeTokenAmountDesc = "FEE_TOKEN_AMOUNT_DESC",
  FeeTokenAsc = "FEE_TOKEN_ASC",
  FeeTokenDesc = "FEE_TOKEN_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  InfoAsc = "INFO_ASC",
  InfoDesc = "INFO_DESC",
  MessageIdAsc = "MESSAGE_ID_ASC",
  MessageIdDesc = "MESSAGE_ID_DESC",
  Natural = "NATURAL",
  NonceAsc = "NONCE_ASC",
  NonceDesc = "NONCE_DESC",
  OfframpAddressAsc = "OFFRAMP_ADDRESS_ASC",
  OfframpAddressDesc = "OFFRAMP_ADDRESS_DESC",
  OnrampAddressAsc = "ONRAMP_ADDRESS_ASC",
  OnrampAddressDesc = "ONRAMP_ADDRESS_DESC",
  OriginAsc = "ORIGIN_ASC",
  OriginDesc = "ORIGIN_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  SequenceNumberAsc = "SEQUENCE_NUMBER_ASC",
  SequenceNumberDesc = "SEQUENCE_NUMBER_DESC",
  SourceChainIdAsc = "SOURCE_CHAIN_ID_ASC",
  SourceChainIdDesc = "SOURCE_CHAIN_ID_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SourceRouterAddressAsc = "SOURCE_ROUTER_ADDRESS_ASC",
  SourceRouterAddressDesc = "SOURCE_ROUTER_ADDRESS_DESC",
  StateAsc = "STATE_ASC",
  StateDesc = "STATE_DESC",
  StrictAsc = "STRICT_ASC",
  StrictDesc = "STRICT_DESC",
  TokenAmountsAsc = "TOKEN_AMOUNTS_ASC",
  TokenAmountsDesc = "TOKEN_AMOUNTS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
}

/** Methods to use when ordering `CcipTransaction`. */
export enum CcipTransactionsOrderBy {
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CommitStoreAddressAsc = "COMMIT_STORE_ADDRESS_ASC",
  CommitStoreAddressDesc = "COMMIT_STORE_ADDRESS_DESC",
  DestChainIdAsc = "DEST_CHAIN_ID_ASC",
  DestChainIdDesc = "DEST_CHAIN_ID_DESC",
  DestNetworkNameAsc = "DEST_NETWORK_NAME_ASC",
  DestNetworkNameDesc = "DEST_NETWORK_NAME_DESC",
  DestRouterAddressAsc = "DEST_ROUTER_ADDRESS_ASC",
  DestRouterAddressDesc = "DEST_ROUTER_ADDRESS_DESC",
  DestTransactionHashAsc = "DEST_TRANSACTION_HASH_ASC",
  DestTransactionHashDesc = "DEST_TRANSACTION_HASH_DESC",
  InfoAsc = "INFO_ASC",
  InfoDesc = "INFO_DESC",
  MessageIdAsc = "MESSAGE_ID_ASC",
  MessageIdDesc = "MESSAGE_ID_DESC",
  Natural = "NATURAL",
  OfframpAddressAsc = "OFFRAMP_ADDRESS_ASC",
  OfframpAddressDesc = "OFFRAMP_ADDRESS_DESC",
  OnrampAddressAsc = "ONRAMP_ADDRESS_ASC",
  OnrampAddressDesc = "ONRAMP_ADDRESS_DESC",
  OriginAsc = "ORIGIN_ASC",
  OriginDesc = "ORIGIN_DESC",
  ReceiverAsc = "RECEIVER_ASC",
  ReceiverDesc = "RECEIVER_DESC",
  SenderAsc = "SENDER_ASC",
  SenderDesc = "SENDER_DESC",
  SequenceNumberAsc = "SEQUENCE_NUMBER_ASC",
  SequenceNumberDesc = "SEQUENCE_NUMBER_DESC",
  SourceChainIdAsc = "SOURCE_CHAIN_ID_ASC",
  SourceChainIdDesc = "SOURCE_CHAIN_ID_DESC",
  SourceNetworkNameAsc = "SOURCE_NETWORK_NAME_ASC",
  SourceNetworkNameDesc = "SOURCE_NETWORK_NAME_DESC",
  SourceRouterAddressAsc = "SOURCE_ROUTER_ADDRESS_ASC",
  SourceRouterAddressDesc = "SOURCE_ROUTER_ADDRESS_DESC",
  StateAsc = "STATE_ASC",
  StateDesc = "STATE_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
}

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Equal to the specified value. */
  equalTo: InputMaybe<Scalars["Int"]["input"]>
  /** Greater than the specified value. */
  greaterThan: InputMaybe<Scalars["Int"]["input"]>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo: InputMaybe<Scalars["Int"]["input"]>
  /** Included in the specified list. */
  in: InputMaybe<Array<Scalars["Int"]["input"]>>
  /** Less than the specified value. */
  lessThan: InputMaybe<Scalars["Int"]["input"]>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo: InputMaybe<Scalars["Int"]["input"]>
  /** Not equal to the specified value. */
  notEqualTo: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contains the specified JSON. */
  contains: InputMaybe<Scalars["JSON"]["input"]>
  /** Equal to the specified value. */
  equalTo: InputMaybe<Scalars["JSON"]["input"]>
  /** Greater than the specified value. */
  greaterThan: InputMaybe<Scalars["JSON"]["input"]>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo: InputMaybe<Scalars["JSON"]["input"]>
  /** Included in the specified list. */
  in: InputMaybe<Array<Scalars["JSON"]["input"]>>
  /** Less than the specified value. */
  lessThan: InputMaybe<Scalars["JSON"]["input"]>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo: InputMaybe<Scalars["JSON"]["input"]>
  /** Not equal to the specified value. */
  notEqualTo: InputMaybe<Scalars["JSON"]["input"]>
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"]["output"]
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo"
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars["Cursor"]["output"]>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"]["output"]
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"]["output"]
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars["Cursor"]["output"]>
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: "Query"
  /** Reads and enables pagination through a set of `CcipAllLaneStatus`. */
  allCcipAllLaneStatuses: Maybe<CcipAllLaneStatusesConnection>
  /** Reads and enables pagination through a set of `CcipLaneStatus`. */
  allCcipLaneStatuses: Maybe<CcipLaneStatusesConnection>
  /** Reads and enables pagination through a set of `CcipLaneTimeEstimate`. */
  allCcipLaneTimeEstimates: Maybe<CcipLaneTimeEstimatesConnection>
  /** Reads and enables pagination through a set of `CcipMessage`. */
  allCcipMessages: Maybe<CcipMessagesConnection>
  /** Reads and enables pagination through a set of `CcipMessagesFlat`. */
  allCcipMessagesFlats: Maybe<CcipMessagesFlatsConnection>
  /** Reads and enables pagination through a set of `CcipSend`. */
  allCcipSends: Maybe<CcipSendsConnection>
  /** Reads and enables pagination through a set of `CcipTokenPoolEvent`. */
  allCcipTokenPoolEvents: Maybe<CcipTokenPoolEventsConnection>
  /** Reads and enables pagination through a set of `CcipTokenPoolLane`. */
  allCcipTokenPoolLanes: Maybe<CcipTokenPoolLanesConnection>
  /** Reads and enables pagination through a set of `CcipTokenPoolLanesGroup`. */
  allCcipTokenPoolLanesGroups: Maybe<CcipTokenPoolLanesGroupsConnection>
  /** Reads and enables pagination through a set of `CcipTokenPoolLanesWithPool`. */
  allCcipTokenPoolLanesWithPools: Maybe<CcipTokenPoolLanesWithPoolsConnection>
  /** Reads and enables pagination through a set of `CcipTokenPool`. */
  allCcipTokenPools: Maybe<CcipTokenPoolsConnection>
  /** Reads and enables pagination through a set of `CcipTransaction`. */
  allCcipTransactions: Maybe<CcipTransactionsConnection>
  /** Reads and enables pagination through a set of `CcipTransactionsFlat`. */
  allCcipTransactionsFlats: Maybe<CcipTransactionsFlatsConnection>
  /** Reads and enables pagination through a set of `SchemaMigration`. */
  allSchemaMigrations: Maybe<SchemaMigrationsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars["ID"]["output"]
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
  /** Reads a single `SchemaMigration` using its globally unique `ID`. */
  schemaMigration: Maybe<SchemaMigration>
  schemaMigrationByVersion: Maybe<SchemaMigration>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipAllLaneStatusesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipAllLaneStatusCondition>
  filter: InputMaybe<CcipAllLaneStatusFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipAllLaneStatusesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipLaneStatusesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipLaneStatusCondition>
  filter: InputMaybe<CcipLaneStatusFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipLaneStatusesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipLaneTimeEstimatesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipLaneTimeEstimateCondition>
  filter: InputMaybe<CcipLaneTimeEstimateFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipLaneTimeEstimatesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipMessagesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipMessageCondition>
  filter: InputMaybe<CcipMessageFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipMessagesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipMessagesFlatsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipMessagesFlatCondition>
  filter: InputMaybe<CcipMessagesFlatFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipMessagesFlatsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipSendsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipSendCondition>
  filter: InputMaybe<CcipSendFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipSendsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTokenPoolEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTokenPoolEventCondition>
  filter: InputMaybe<CcipTokenPoolEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTokenPoolEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTokenPoolLanesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTokenPoolLaneCondition>
  filter: InputMaybe<CcipTokenPoolLaneFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTokenPoolLanesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTokenPoolLanesGroupsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTokenPoolLanesGroupCondition>
  filter: InputMaybe<CcipTokenPoolLanesGroupFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTokenPoolLanesGroupsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTokenPoolLanesWithPoolsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTokenPoolLanesWithPoolCondition>
  filter: InputMaybe<CcipTokenPoolLanesWithPoolFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTokenPoolLanesWithPoolsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTokenPoolsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTokenPoolCondition>
  filter: InputMaybe<CcipTokenPoolFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTokenPoolsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTransactionsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTransactionCondition>
  filter: InputMaybe<CcipTransactionFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTransactionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllCcipTransactionsFlatsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<CcipTransactionsFlatCondition>
  filter: InputMaybe<CcipTransactionsFlatFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<CcipTransactionsFlatsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllSchemaMigrationsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<SchemaMigrationCondition>
  filter: InputMaybe<SchemaMigrationFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<SchemaMigrationsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"]["input"]
}

/** The root query type which gives access points into the data universe. */
export type QuerySchemaMigrationArgs = {
  nodeId: Scalars["ID"]["input"]
}

/** The root query type which gives access points into the data universe. */
export type QuerySchemaMigrationByVersionArgs = {
  version: Scalars["String"]["input"]
}

export type SchemaMigration = Node & {
  __typename?: "SchemaMigration"
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"]["output"]
  version: Scalars["String"]["output"]
}

/**
 * A condition to be used against `SchemaMigration` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SchemaMigrationCondition = {
  /** Checks for equality with the object’s `version` field. */
  version: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `SchemaMigration` object types. All fields are combined with a logical ‘and.’ */
export type SchemaMigrationFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<SchemaMigrationFilter>>
  /** Negates the expression. */
  not: InputMaybe<SchemaMigrationFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<SchemaMigrationFilter>>
  /** Filter by the object’s `version` field. */
  version: InputMaybe<StringFilter>
}

/** A connection to a list of `SchemaMigration` values. */
export type SchemaMigrationsConnection = {
  __typename?: "SchemaMigrationsConnection"
  /** A list of edges which contains the `SchemaMigration` and cursor to aid in pagination. */
  edges: Array<SchemaMigrationsEdge>
  /** A list of `SchemaMigration` objects. */
  nodes: Array<SchemaMigration>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `SchemaMigration` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `SchemaMigration` edge in the connection. */
export type SchemaMigrationsEdge = {
  __typename?: "SchemaMigrationsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `SchemaMigration` at the end of the edge. */
  node: SchemaMigration
}

/** Methods to use when ordering `SchemaMigration`. */
export enum SchemaMigrationsOrderBy {
  Natural = "NATURAL",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC",
  VersionAsc = "VERSION_ASC",
  VersionDesc = "VERSION_DESC",
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Equal to the specified value. */
  equalTo: InputMaybe<Scalars["String"]["input"]>
  /** Greater than the specified value. */
  greaterThan: InputMaybe<Scalars["String"]["input"]>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo: InputMaybe<Scalars["String"]["input"]>
  /** Included in the specified list. */
  in: InputMaybe<Array<Scalars["String"]["input"]>>
  /** Less than the specified value. */
  lessThan: InputMaybe<Scalars["String"]["input"]>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo: InputMaybe<Scalars["String"]["input"]>
  /** Not equal to the specified value. */
  notEqualTo: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Contains the specified list of values. */
  contains: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Equal to the specified value. */
  equalTo: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Greater than the specified value. */
  greaterThan: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Less than the specified value. */
  lessThan: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Not equal to the specified value. */
  notEqualTo: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
}

export type LaneStatusesFilteredQueryVariables = Exact<{
  sourceRouterAddress: Scalars["String"]["input"]
  sourceNetworkId: Scalars["String"]["input"]
  destinationNetworkIds: Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
}>

export type LaneStatusesFilteredQuery = {
  __typename?: "Query"
  allCcipAllLaneStatuses: {
    __typename?: "CcipAllLaneStatusesConnection"
    nodes: Array<{
      __typename?: "CcipAllLaneStatus"
      routerAddress: string | null
      destNetworkName: string | null
      sourceNetworkName: string | null
      successRate: number | null
    }>
  } | null
}

export const LaneStatusesFilteredDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LaneStatusesFiltered" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sourceRouterAddress" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sourceNetworkId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "destinationNetworkIds" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allCcipAllLaneStatuses" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "sourceNetworkName" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "equalTo" },
                            value: { kind: "Variable", name: { kind: "Name", value: "sourceNetworkId" } },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "routerAddress" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "equalTo" },
                            value: { kind: "Variable", name: { kind: "Name", value: "sourceRouterAddress" } },
                          },
                        ],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "destNetworkName" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "in" },
                            value: { kind: "Variable", name: { kind: "Name", value: "destinationNetworkIds" } },
                          },
                        ],
                      },
                    },
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
                      { kind: "Field", name: { kind: "Name", value: "routerAddress" } },
                      { kind: "Field", name: { kind: "Name", value: "destNetworkName" } },
                      { kind: "Field", name: { kind: "Name", value: "sourceNetworkName" } },
                      { kind: "Field", name: { kind: "Name", value: "successRate" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode

/**
 * __useLaneStatusesFilteredQuery__
 *
 * To run a query within a React component, call `useLaneStatusesFilteredQuery` and pass it any options that fit your needs.
 * When your component renders, `useLaneStatusesFilteredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLaneStatusesFilteredQuery({
 *   variables: {
 *      sourceRouterAddress: // value for 'sourceRouterAddress'
 *      sourceNetworkId: // value for 'sourceNetworkId'
 *      destinationNetworkIds: // value for 'destinationNetworkIds'
 *   },
 * });
 */
export function useLaneStatusesFilteredQuery(
  baseOptions: Apollo.QueryHookOptions<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables> &
    ({ variables: LaneStatusesFilteredQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables>(
    LaneStatusesFilteredDocument,
    options
  )
}
export function useLaneStatusesFilteredLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables>(
    LaneStatusesFilteredDocument,
    options
  )
}
export function useLaneStatusesFilteredSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables>
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LaneStatusesFilteredQuery, LaneStatusesFilteredQueryVariables>(
    LaneStatusesFilteredDocument,
    options
  )
}
export type LaneStatusesFilteredQueryHookResult = ReturnType<typeof useLaneStatusesFilteredQuery>
export type LaneStatusesFilteredLazyQueryHookResult = ReturnType<typeof useLaneStatusesFilteredLazyQuery>
export type LaneStatusesFilteredSuspenseQueryHookResult = ReturnType<typeof useLaneStatusesFilteredSuspenseQuery>
export type LaneStatusesFilteredQueryResult = Apollo.QueryResult<
  LaneStatusesFilteredQuery,
  LaneStatusesFilteredQueryVariables
>
