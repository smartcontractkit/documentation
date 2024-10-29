import { GraphQLClient, RequestOptions } from "graphql-request"
import gql from "graphql-tag"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never }
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"]
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

export type AutomationContract = {
  __typename?: "AutomationContract"
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  cronUpkeepFactoryAddress: Maybe<Scalars["String"]["output"]>
  env: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrarVersion: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  registryVersion: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `AutomationContract` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type AutomationContractCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `cronUpkeepFactoryAddress` field. */
  cronUpkeepFactoryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `env` field. */
  env: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarVersion` field. */
  registrarVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryVersion` field. */
  registryVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `AutomationContract` object types. All fields are combined with a logical ‘and.’ */
export type AutomationContractFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationContractFilter>>
  /** Filter by the object’s `cronUpkeepFactoryAddress` field. */
  cronUpkeepFactoryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `env` field. */
  env: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationContractFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationContractFilter>>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarVersion` field. */
  registrarVersion: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registryVersion` field. */
  registryVersion: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationContract` values. */
export type AutomationContractsConnection = {
  __typename?: "AutomationContractsConnection"
  /** A list of edges which contains the `AutomationContract` and cursor to aid in pagination. */
  edges: Array<AutomationContractsEdge>
  /** A list of `AutomationContract` objects. */
  nodes: Array<AutomationContract>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationContract` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationContract` edge in the connection. */
export type AutomationContractsEdge = {
  __typename?: "AutomationContractsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationContract` at the end of the edge. */
  node: AutomationContract
}

/** Methods to use when ordering `AutomationContract`. */
export enum AutomationContractsOrderBy {
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  CronUpkeepFactoryAddressAsc = "CRON_UPKEEP_FACTORY_ADDRESS_ASC",
  CronUpkeepFactoryAddressDesc = "CRON_UPKEEP_FACTORY_ADDRESS_DESC",
  EnvAsc = "ENV_ASC",
  EnvDesc = "ENV_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrarVersionAsc = "REGISTRAR_VERSION_ASC",
  RegistrarVersionDesc = "REGISTRAR_VERSION_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RegistryVersionAsc = "REGISTRY_VERSION_ASC",
  RegistryVersionDesc = "REGISTRY_VERSION_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type AutomationPerformEvent = {
  __typename?: "AutomationPerformEvent"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["String"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["String"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationPerformEvent` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type AutomationPerformEventCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationPerformEvent` object types. All fields are combined with a logical ‘and.’ */
export type AutomationPerformEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationPerformEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<StringFilter>
  /** Filter by the object’s `chainId` field. */
  chainId: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationPerformEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationPerformEventFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationPerformEvent` values. */
export type AutomationPerformEventsConnection = {
  __typename?: "AutomationPerformEventsConnection"
  /** A list of edges which contains the `AutomationPerformEvent` and cursor to aid in pagination. */
  edges: Array<AutomationPerformEventsEdge>
  /** A list of `AutomationPerformEvent` objects. */
  nodes: Array<AutomationPerformEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationPerformEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationPerformEvent` edge in the connection. */
export type AutomationPerformEventsEdge = {
  __typename?: "AutomationPerformEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationPerformEvent` at the end of the edge. */
  node: AutomationPerformEvent
}

/** Methods to use when ordering `AutomationPerformEvent`. */
export enum AutomationPerformEventsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type AutomationRegistration = {
  __typename?: "AutomationRegistration"
  admin: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["String"]["output"]>
  billingToken: Maybe<Scalars["String"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  offchainConfig: Maybe<Scalars["String"]["output"]>
  performGas: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrationHash: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  target: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  triggerType: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationRegistration` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type AutomationRegistrationCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `billingToken` field. */
  billingToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `performGas` field. */
  performGas: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrationHash` field. */
  registrationHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `target` field. */
  target: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerType` field. */
  triggerType: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationRegistration` object types. All fields are combined with a logical ‘and.’ */
export type AutomationRegistrationFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationRegistrationFilter>>
  /** Filter by the object’s `balance` field. */
  balance: InputMaybe<StringFilter>
  /** Filter by the object’s `billingToken` field. */
  billingToken: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationRegistrationFilter>
  /** Filter by the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationRegistrationFilter>>
  /** Filter by the object’s `performGas` field. */
  performGas: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrationHash` field. */
  registrationHash: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `target` field. */
  target: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerType` field. */
  triggerType: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationRegistration` values. */
export type AutomationRegistrationsConnection = {
  __typename?: "AutomationRegistrationsConnection"
  /** A list of edges which contains the `AutomationRegistration` and cursor to aid in pagination. */
  edges: Array<AutomationRegistrationsEdge>
  /** A list of `AutomationRegistration` objects. */
  nodes: Array<AutomationRegistration>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationRegistration` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationRegistration` edge in the connection. */
export type AutomationRegistrationsEdge = {
  __typename?: "AutomationRegistrationsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationRegistration` at the end of the edge. */
  node: AutomationRegistration
}

/** Methods to use when ordering `AutomationRegistration`. */
export enum AutomationRegistrationsOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BillingTokenAsc = "BILLING_TOKEN_ASC",
  BillingTokenDesc = "BILLING_TOKEN_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OffchainConfigAsc = "OFFCHAIN_CONFIG_ASC",
  OffchainConfigDesc = "OFFCHAIN_CONFIG_DESC",
  PerformGasAsc = "PERFORM_GAS_ASC",
  PerformGasDesc = "PERFORM_GAS_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrationHashAsc = "REGISTRATION_HASH_ASC",
  RegistrationHashDesc = "REGISTRATION_HASH_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TargetAsc = "TARGET_ASC",
  TargetDesc = "TARGET_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  TriggerTypeAsc = "TRIGGER_TYPE_ASC",
  TriggerTypeDesc = "TRIGGER_TYPE_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type AutomationStageContract = {
  __typename?: "AutomationStageContract"
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  cronUpkeepFactoryAddress: Maybe<Scalars["String"]["output"]>
  env: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrarVersion: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  registryVersion: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `AutomationStageContract` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type AutomationStageContractCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `cronUpkeepFactoryAddress` field. */
  cronUpkeepFactoryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `env` field. */
  env: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarVersion` field. */
  registrarVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryVersion` field. */
  registryVersion: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `AutomationStageContract` object types. All fields are combined with a logical ‘and.’ */
export type AutomationStageContractFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationStageContractFilter>>
  /** Filter by the object’s `cronUpkeepFactoryAddress` field. */
  cronUpkeepFactoryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `env` field. */
  env: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationStageContractFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationStageContractFilter>>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarVersion` field. */
  registrarVersion: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registryVersion` field. */
  registryVersion: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationStageContract` values. */
export type AutomationStageContractsConnection = {
  __typename?: "AutomationStageContractsConnection"
  /** A list of edges which contains the `AutomationStageContract` and cursor to aid in pagination. */
  edges: Array<AutomationStageContractsEdge>
  /** A list of `AutomationStageContract` objects. */
  nodes: Array<AutomationStageContract>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationStageContract` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationStageContract` edge in the connection. */
export type AutomationStageContractsEdge = {
  __typename?: "AutomationStageContractsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationStageContract` at the end of the edge. */
  node: AutomationStageContract
}

/** Methods to use when ordering `AutomationStageContract`. */
export enum AutomationStageContractsOrderBy {
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  CronUpkeepFactoryAddressAsc = "CRON_UPKEEP_FACTORY_ADDRESS_ASC",
  CronUpkeepFactoryAddressDesc = "CRON_UPKEEP_FACTORY_ADDRESS_DESC",
  EnvAsc = "ENV_ASC",
  EnvDesc = "ENV_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrarVersionAsc = "REGISTRAR_VERSION_ASC",
  RegistrarVersionDesc = "REGISTRAR_VERSION_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RegistryVersionAsc = "REGISTRY_VERSION_ASC",
  RegistryVersionDesc = "REGISTRY_VERSION_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type AutomationStagePerformEvent = {
  __typename?: "AutomationStagePerformEvent"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationStagePerformEvent` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type AutomationStagePerformEventCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationStagePerformEvent` object types. All fields are combined with a logical ‘and.’ */
export type AutomationStagePerformEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationStagePerformEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationStagePerformEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationStagePerformEventFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `AutomationStagePerformEvent` values. */
export type AutomationStagePerformEventsConnection = {
  __typename?: "AutomationStagePerformEventsConnection"
  /** A list of edges which contains the `AutomationStagePerformEvent` and cursor to aid in pagination. */
  edges: Array<AutomationStagePerformEventsEdge>
  /** A list of `AutomationStagePerformEvent` objects. */
  nodes: Array<AutomationStagePerformEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationStagePerformEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationStagePerformEvent` edge in the connection. */
export type AutomationStagePerformEventsEdge = {
  __typename?: "AutomationStagePerformEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationStagePerformEvent` at the end of the edge. */
  node: AutomationStagePerformEvent
}

/** Methods to use when ordering `AutomationStagePerformEvent`. */
export enum AutomationStagePerformEventsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type AutomationStageRegistration = {
  __typename?: "AutomationStageRegistration"
  admin: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["BigFloat"]["output"]>
  billingToken: Maybe<Scalars["String"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  offchainConfig: Maybe<Scalars["String"]["output"]>
  performGas: Maybe<Scalars["BigFloat"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrationHash: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  target: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  triggerType: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationStageRegistration` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type AutomationStageRegistrationCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `billingToken` field. */
  billingToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `performGas` field. */
  performGas: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrationHash` field. */
  registrationHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `target` field. */
  target: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerType` field. */
  triggerType: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationStageRegistration` object types. All fields are combined with a logical ‘and.’ */
export type AutomationStageRegistrationFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationStageRegistrationFilter>>
  /** Filter by the object’s `billingToken` field. */
  billingToken: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationStageRegistrationFilter>
  /** Filter by the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationStageRegistrationFilter>>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrationHash` field. */
  registrationHash: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `target` field. */
  target: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerType` field. */
  triggerType: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationStageRegistration` values. */
export type AutomationStageRegistrationsConnection = {
  __typename?: "AutomationStageRegistrationsConnection"
  /** A list of edges which contains the `AutomationStageRegistration` and cursor to aid in pagination. */
  edges: Array<AutomationStageRegistrationsEdge>
  /** A list of `AutomationStageRegistration` objects. */
  nodes: Array<AutomationStageRegistration>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationStageRegistration` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationStageRegistration` edge in the connection. */
export type AutomationStageRegistrationsEdge = {
  __typename?: "AutomationStageRegistrationsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationStageRegistration` at the end of the edge. */
  node: AutomationStageRegistration
}

/** Methods to use when ordering `AutomationStageRegistration`. */
export enum AutomationStageRegistrationsOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BillingTokenAsc = "BILLING_TOKEN_ASC",
  BillingTokenDesc = "BILLING_TOKEN_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OffchainConfigAsc = "OFFCHAIN_CONFIG_ASC",
  OffchainConfigDesc = "OFFCHAIN_CONFIG_DESC",
  PerformGasAsc = "PERFORM_GAS_ASC",
  PerformGasDesc = "PERFORM_GAS_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrationHashAsc = "REGISTRATION_HASH_ASC",
  RegistrationHashDesc = "REGISTRATION_HASH_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TargetAsc = "TARGET_ASC",
  TargetDesc = "TARGET_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  TriggerTypeAsc = "TRIGGER_TYPE_ASC",
  TriggerTypeDesc = "TRIGGER_TYPE_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type AutomationStageUpkeep = {
  __typename?: "AutomationStageUpkeep"
  admin: Maybe<Scalars["String"]["output"]>
  amountSpent: Maybe<Scalars["BigFloat"]["output"]>
  balance: Maybe<Scalars["BigFloat"]["output"]>
  billingToken: Maybe<Scalars["String"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  forwarderAddress: Maybe<Scalars["String"]["output"]>
  lastPerformBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  maxValidBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  minBalance: Maybe<Scalars["BigFloat"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  offchainConfig: Maybe<Scalars["String"]["output"]>
  performGas: Maybe<Scalars["BigFloat"]["output"]>
  proposedAdmin: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrationHash: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  target: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  triggerType: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationStageUpkeep` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type AutomationStageUpkeepCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `amountSpent` field. */
  amountSpent: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `billingToken` field. */
  billingToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `forwarderAddress` field. */
  forwarderAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `lastPerformBlockNumber` field. */
  lastPerformBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `minBalance` field. */
  minBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `performGas` field. */
  performGas: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrationHash` field. */
  registrationHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `target` field. */
  target: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerType` field. */
  triggerType: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

export type AutomationStageUpkeepEvent = {
  __typename?: "AutomationStageUpkeepEvent"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationStageUpkeepEvent` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type AutomationStageUpkeepEventCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationStageUpkeepEvent` object types. All fields are combined with a logical ‘and.’ */
export type AutomationStageUpkeepEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationStageUpkeepEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationStageUpkeepEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationStageUpkeepEventFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `AutomationStageUpkeepEvent` values. */
export type AutomationStageUpkeepEventsConnection = {
  __typename?: "AutomationStageUpkeepEventsConnection"
  /** A list of edges which contains the `AutomationStageUpkeepEvent` and cursor to aid in pagination. */
  edges: Array<AutomationStageUpkeepEventsEdge>
  /** A list of `AutomationStageUpkeepEvent` objects. */
  nodes: Array<AutomationStageUpkeepEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationStageUpkeepEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationStageUpkeepEvent` edge in the connection. */
export type AutomationStageUpkeepEventsEdge = {
  __typename?: "AutomationStageUpkeepEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationStageUpkeepEvent` at the end of the edge. */
  node: AutomationStageUpkeepEvent
}

/** Methods to use when ordering `AutomationStageUpkeepEvent`. */
export enum AutomationStageUpkeepEventsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

/** A filter to be used against `AutomationStageUpkeep` object types. All fields are combined with a logical ‘and.’ */
export type AutomationStageUpkeepFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationStageUpkeepFilter>>
  /** Filter by the object’s `billingToken` field. */
  billingToken: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `forwarderAddress` field. */
  forwarderAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationStageUpkeepFilter>
  /** Filter by the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationStageUpkeepFilter>>
  /** Filter by the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrationHash` field. */
  registrationHash: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `target` field. */
  target: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerType` field. */
  triggerType: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationStageUpkeep` values. */
export type AutomationStageUpkeepsConnection = {
  __typename?: "AutomationStageUpkeepsConnection"
  /** A list of edges which contains the `AutomationStageUpkeep` and cursor to aid in pagination. */
  edges: Array<AutomationStageUpkeepsEdge>
  /** A list of `AutomationStageUpkeep` objects. */
  nodes: Array<AutomationStageUpkeep>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationStageUpkeep` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationStageUpkeep` edge in the connection. */
export type AutomationStageUpkeepsEdge = {
  __typename?: "AutomationStageUpkeepsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationStageUpkeep` at the end of the edge. */
  node: AutomationStageUpkeep
}

/** Methods to use when ordering `AutomationStageUpkeep`. */
export enum AutomationStageUpkeepsOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  AmountSpentAsc = "AMOUNT_SPENT_ASC",
  AmountSpentDesc = "AMOUNT_SPENT_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BillingTokenAsc = "BILLING_TOKEN_ASC",
  BillingTokenDesc = "BILLING_TOKEN_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  ForwarderAddressAsc = "FORWARDER_ADDRESS_ASC",
  ForwarderAddressDesc = "FORWARDER_ADDRESS_DESC",
  LastPerformBlockNumberAsc = "LAST_PERFORM_BLOCK_NUMBER_ASC",
  LastPerformBlockNumberDesc = "LAST_PERFORM_BLOCK_NUMBER_DESC",
  MaxValidBlockNumberAsc = "MAX_VALID_BLOCK_NUMBER_ASC",
  MaxValidBlockNumberDesc = "MAX_VALID_BLOCK_NUMBER_DESC",
  MinBalanceAsc = "MIN_BALANCE_ASC",
  MinBalanceDesc = "MIN_BALANCE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OffchainConfigAsc = "OFFCHAIN_CONFIG_ASC",
  OffchainConfigDesc = "OFFCHAIN_CONFIG_DESC",
  PerformGasAsc = "PERFORM_GAS_ASC",
  PerformGasDesc = "PERFORM_GAS_DESC",
  ProposedAdminAsc = "PROPOSED_ADMIN_ASC",
  ProposedAdminDesc = "PROPOSED_ADMIN_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrationHashAsc = "REGISTRATION_HASH_ASC",
  RegistrationHashDesc = "REGISTRATION_HASH_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TargetAsc = "TARGET_ASC",
  TargetDesc = "TARGET_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  TriggerTypeAsc = "TRIGGER_TYPE_ASC",
  TriggerTypeDesc = "TRIGGER_TYPE_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type AutomationUpkeep = {
  __typename?: "AutomationUpkeep"
  admin: Maybe<Scalars["String"]["output"]>
  amountSpent: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["String"]["output"]>
  billingToken: Maybe<Scalars["String"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  forwarderAddress: Maybe<Scalars["String"]["output"]>
  lastPerformBlockNumber: Maybe<Scalars["String"]["output"]>
  maxValidBlockNumber: Maybe<Scalars["String"]["output"]>
  minBalance: Maybe<Scalars["String"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  offchainConfig: Maybe<Scalars["String"]["output"]>
  performGas: Maybe<Scalars["String"]["output"]>
  proposedAdmin: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registrationHash: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  target: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  triggerType: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationUpkeep` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type AutomationUpkeepCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `amountSpent` field. */
  amountSpent: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `billingToken` field. */
  billingToken: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `forwarderAddress` field. */
  forwarderAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `lastPerformBlockNumber` field. */
  lastPerformBlockNumber: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `minBalance` field. */
  minBalance: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `performGas` field. */
  performGas: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrationHash` field. */
  registrationHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `target` field. */
  target: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerType` field. */
  triggerType: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

export type AutomationUpkeepEvent = {
  __typename?: "AutomationUpkeepEvent"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["String"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["String"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["String"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
  upkeepId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `AutomationUpkeepEvent` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type AutomationUpkeepEventCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `AutomationUpkeepEvent` object types. All fields are combined with a logical ‘and.’ */
export type AutomationUpkeepEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationUpkeepEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `blockNumber` field. */
  blockNumber: InputMaybe<StringFilter>
  /** Filter by the object’s `chainId` field. */
  chainId: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationUpkeepEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationUpkeepEventFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationUpkeepEvent` values. */
export type AutomationUpkeepEventsConnection = {
  __typename?: "AutomationUpkeepEventsConnection"
  /** A list of edges which contains the `AutomationUpkeepEvent` and cursor to aid in pagination. */
  edges: Array<AutomationUpkeepEventsEdge>
  /** A list of `AutomationUpkeepEvent` objects. */
  nodes: Array<AutomationUpkeepEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationUpkeepEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationUpkeepEvent` edge in the connection. */
export type AutomationUpkeepEventsEdge = {
  __typename?: "AutomationUpkeepEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationUpkeepEvent` at the end of the edge. */
  node: AutomationUpkeepEvent
}

/** Methods to use when ordering `AutomationUpkeepEvent`. */
export enum AutomationUpkeepEventsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

/** A filter to be used against `AutomationUpkeep` object types. All fields are combined with a logical ‘and.’ */
export type AutomationUpkeepFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Filter by the object’s `amountSpent` field. */
  amountSpent: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<AutomationUpkeepFilter>>
  /** Filter by the object’s `balance` field. */
  balance: InputMaybe<StringFilter>
  /** Filter by the object’s `billingToken` field. */
  billingToken: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `forwarderAddress` field. */
  forwarderAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `lastPerformBlockNumber` field. */
  lastPerformBlockNumber: InputMaybe<StringFilter>
  /** Filter by the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<StringFilter>
  /** Filter by the object’s `minBalance` field. */
  minBalance: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<AutomationUpkeepFilter>
  /** Filter by the object’s `offchainConfig` field. */
  offchainConfig: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<AutomationUpkeepFilter>>
  /** Filter by the object’s `performGas` field. */
  performGas: InputMaybe<StringFilter>
  /** Filter by the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registrationHash` field. */
  registrationHash: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `target` field. */
  target: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerType` field. */
  triggerType: InputMaybe<StringFilter>
}

/** A connection to a list of `AutomationUpkeep` values. */
export type AutomationUpkeepsConnection = {
  __typename?: "AutomationUpkeepsConnection"
  /** A list of edges which contains the `AutomationUpkeep` and cursor to aid in pagination. */
  edges: Array<AutomationUpkeepsEdge>
  /** A list of `AutomationUpkeep` objects. */
  nodes: Array<AutomationUpkeep>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `AutomationUpkeep` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `AutomationUpkeep` edge in the connection. */
export type AutomationUpkeepsEdge = {
  __typename?: "AutomationUpkeepsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `AutomationUpkeep` at the end of the edge. */
  node: AutomationUpkeep
}

/** Methods to use when ordering `AutomationUpkeep`. */
export enum AutomationUpkeepsOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  AmountSpentAsc = "AMOUNT_SPENT_ASC",
  AmountSpentDesc = "AMOUNT_SPENT_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BillingTokenAsc = "BILLING_TOKEN_ASC",
  BillingTokenDesc = "BILLING_TOKEN_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  ForwarderAddressAsc = "FORWARDER_ADDRESS_ASC",
  ForwarderAddressDesc = "FORWARDER_ADDRESS_DESC",
  LastPerformBlockNumberAsc = "LAST_PERFORM_BLOCK_NUMBER_ASC",
  LastPerformBlockNumberDesc = "LAST_PERFORM_BLOCK_NUMBER_DESC",
  MaxValidBlockNumberAsc = "MAX_VALID_BLOCK_NUMBER_ASC",
  MaxValidBlockNumberDesc = "MAX_VALID_BLOCK_NUMBER_DESC",
  MinBalanceAsc = "MIN_BALANCE_ASC",
  MinBalanceDesc = "MIN_BALANCE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OffchainConfigAsc = "OFFCHAIN_CONFIG_ASC",
  OffchainConfigDesc = "OFFCHAIN_CONFIG_DESC",
  PerformGasAsc = "PERFORM_GAS_ASC",
  PerformGasDesc = "PERFORM_GAS_DESC",
  ProposedAdminAsc = "PROPOSED_ADMIN_ASC",
  ProposedAdminDesc = "PROPOSED_ADMIN_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistrationHashAsc = "REGISTRATION_HASH_ASC",
  RegistrationHashDesc = "REGISTRATION_HASH_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TargetAsc = "TARGET_ASC",
  TargetDesc = "TARGET_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  TriggerTypeAsc = "TRIGGER_TYPE_ASC",
  TriggerTypeDesc = "TRIGGER_TYPE_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
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
  gasLimit: Maybe<Scalars["String"]["output"]>
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
  gasLimit: InputMaybe<Scalars["String"]["input"]>
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
  /** Filter by the object’s `gasLimit` field. */
  gasLimit: InputMaybe<StringFilter>
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
  gasLimit: Maybe<Scalars["String"]["output"]>
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
  gasLimit: InputMaybe<Scalars["String"]["input"]>
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
  /** Filter by the object’s `gasLimit` field. */
  gasLimit: InputMaybe<StringFilter>
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
  gasLimit: Maybe<Scalars["String"]["output"]>
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
  gasLimit: InputMaybe<Scalars["String"]["input"]>
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
  /** Filter by the object’s `gasLimit` field. */
  gasLimit: InputMaybe<StringFilter>
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

/** A connection to a list of `ChainDataRecord` values. */
export type ChainDataConnection = {
  __typename?: "ChainDataConnection"
  /** A list of edges which contains the `ChainDataRecord` and cursor to aid in pagination. */
  edges: Array<ChainDatumEdge>
  /** A list of `ChainDataRecord` objects. */
  nodes: Array<ChainDataRecord>
  /** The count of *all* `ChainDataRecord` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** The return type of our `chainData` query. */
export type ChainDataRecord = {
  __typename?: "ChainDataRecord"
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
}

/** A `ChainDataRecord` edge in the connection. */
export type ChainDatumEdge = {
  __typename?: "ChainDatumEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ChainDataRecord` at the end of the edge. */
  node: ChainDataRecord
}

export type ConsoleContract = {
  __typename?: "ConsoleContract"
  contractAddress: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  service: Maybe<Scalars["String"]["output"]>
  version: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `ConsoleContract` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ConsoleContractCondition = {
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `service` field. */
  service: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `version` field. */
  version: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `ConsoleContract` object types. All fields are combined with a logical ‘and.’ */
export type ConsoleContractFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<ConsoleContractFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<ConsoleContractFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<ConsoleContractFilter>>
  /** Filter by the object’s `service` field. */
  service: InputMaybe<StringFilter>
  /** Filter by the object’s `version` field. */
  version: InputMaybe<StringFilter>
}

/** A connection to a list of `ConsoleContract` values. */
export type ConsoleContractsConnection = {
  __typename?: "ConsoleContractsConnection"
  /** A list of edges which contains the `ConsoleContract` and cursor to aid in pagination. */
  edges: Array<ConsoleContractsEdge>
  /** A list of `ConsoleContract` objects. */
  nodes: Array<ConsoleContract>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ConsoleContract` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `ConsoleContract` edge in the connection. */
export type ConsoleContractsEdge = {
  __typename?: "ConsoleContractsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ConsoleContract` at the end of the edge. */
  node: ConsoleContract
}

/** Methods to use when ordering `ConsoleContract`. */
export enum ConsoleContractsOrderBy {
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ServiceAsc = "SERVICE_ASC",
  ServiceDesc = "SERVICE_DESC",
  VersionAsc = "VERSION_ASC",
  VersionDesc = "VERSION_DESC",
}

export type ConsoleInstance = {
  __typename?: "ConsoleInstance"
  admin: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["JSON"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  id: Maybe<Scalars["BigFloat"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  service: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  version: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `ConsoleInstance` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ConsoleInstanceCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `service` field. */
  service: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `version` field. */
  version: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `ConsoleInstance` object types. All fields are combined with a logical ‘and.’ */
export type ConsoleInstanceFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<ConsoleInstanceFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<ConsoleInstanceFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<ConsoleInstanceFilter>>
  /** Filter by the object’s `service` field. */
  service: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `version` field. */
  version: InputMaybe<StringFilter>
}

/** A `ConsoleInstanceRequestCountsRecord` edge in the connection. */
export type ConsoleInstanceRequestCountEdge = {
  __typename?: "ConsoleInstanceRequestCountEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ConsoleInstanceRequestCountsRecord` at the end of the edge. */
  node: ConsoleInstanceRequestCountsRecord
}

/** A connection to a list of `ConsoleInstanceRequestCountsRecord` values. */
export type ConsoleInstanceRequestCountsConnection = {
  __typename?: "ConsoleInstanceRequestCountsConnection"
  /** A list of edges which contains the `ConsoleInstanceRequestCountsRecord` and cursor to aid in pagination. */
  edges: Array<ConsoleInstanceRequestCountEdge>
  /** A list of `ConsoleInstanceRequestCountsRecord` objects. */
  nodes: Array<ConsoleInstanceRequestCountsRecord>
  /** The count of *all* `ConsoleInstanceRequestCountsRecord` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** The return type of our `consoleInstanceRequestCounts` query. */
export type ConsoleInstanceRequestCountsRecord = {
  __typename?: "ConsoleInstanceRequestCountsRecord"
  count: Maybe<Scalars["BigInt"]["output"]>
  hour: Maybe<Scalars["Datetime"]["output"]>
  id: Maybe<Scalars["BigFloat"]["output"]>
}

/** A connection to a list of `ConsoleInstance` values. */
export type ConsoleInstancesConnection = {
  __typename?: "ConsoleInstancesConnection"
  /** A list of edges which contains the `ConsoleInstance` and cursor to aid in pagination. */
  edges: Array<ConsoleInstancesEdge>
  /** A list of `ConsoleInstance` objects. */
  nodes: Array<ConsoleInstance>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ConsoleInstance` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `ConsoleInstance` edge in the connection. */
export type ConsoleInstancesEdge = {
  __typename?: "ConsoleInstancesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ConsoleInstance` at the end of the edge. */
  node: ConsoleInstance
}

/** Methods to use when ordering `ConsoleInstance`. */
export enum ConsoleInstancesOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ServiceAsc = "SERVICE_ASC",
  ServiceDesc = "SERVICE_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  VersionAsc = "VERSION_ASC",
  VersionDesc = "VERSION_DESC",
}

export type ConsoleRequest = {
  __typename?: "ConsoleRequest"
  admin: Maybe<Scalars["String"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  service: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  timestamp: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `ConsoleRequest` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ConsoleRequestCondition = {
  /** Checks for equality with the object’s `admin` field. */
  admin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `service` field. */
  service: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `ConsoleRequest` object types. All fields are combined with a logical ‘and.’ */
export type ConsoleRequestFilter = {
  /** Filter by the object’s `admin` field. */
  admin: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<ConsoleRequestFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<ConsoleRequestFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<ConsoleRequestFilter>>
  /** Filter by the object’s `service` field. */
  service: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
}

/** A connection to a list of `ConsoleRequest` values. */
export type ConsoleRequestsConnection = {
  __typename?: "ConsoleRequestsConnection"
  /** A list of edges which contains the `ConsoleRequest` and cursor to aid in pagination. */
  edges: Array<ConsoleRequestsEdge>
  /** A list of `ConsoleRequest` objects. */
  nodes: Array<ConsoleRequest>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ConsoleRequest` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `ConsoleRequest` edge in the connection. */
export type ConsoleRequestsEdge = {
  __typename?: "ConsoleRequestsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ConsoleRequest` at the end of the edge. */
  node: ConsoleRequest
}

/** Methods to use when ordering `ConsoleRequest`. */
export enum ConsoleRequestsOrderBy {
  AdminAsc = "ADMIN_ASC",
  AdminDesc = "ADMIN_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ServiceAsc = "SERVICE_ASC",
  ServiceDesc = "SERVICE_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TimestampAsc = "TIMESTAMP_ASC",
  TimestampDesc = "TIMESTAMP_DESC",
}

/** A `ConsoleServiceRequestCountsRecord` edge in the connection. */
export type ConsoleServiceRequestCountEdge = {
  __typename?: "ConsoleServiceRequestCountEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `ConsoleServiceRequestCountsRecord` at the end of the edge. */
  node: ConsoleServiceRequestCountsRecord
}

/** A connection to a list of `ConsoleServiceRequestCountsRecord` values. */
export type ConsoleServiceRequestCountsConnection = {
  __typename?: "ConsoleServiceRequestCountsConnection"
  /** A list of edges which contains the `ConsoleServiceRequestCountsRecord` and cursor to aid in pagination. */
  edges: Array<ConsoleServiceRequestCountEdge>
  /** A list of `ConsoleServiceRequestCountsRecord` objects. */
  nodes: Array<ConsoleServiceRequestCountsRecord>
  /** The count of *all* `ConsoleServiceRequestCountsRecord` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** The return type of our `consoleServiceRequestCounts` query. */
export type ConsoleServiceRequestCountsRecord = {
  __typename?: "ConsoleServiceRequestCountsRecord"
  count: Maybe<Scalars["BigInt"]["output"]>
  day: Maybe<Scalars["Datetime"]["output"]>
  service: Maybe<Scalars["String"]["output"]>
}

/** A filter to be used against `ConsoleServiceRequestCountsRecord` object types. All fields are combined with a logical ‘and.’ */
export type ConsoleServiceRequestCountsRecordFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<ConsoleServiceRequestCountsRecordFilter>>
  /** Negates the expression. */
  not: InputMaybe<ConsoleServiceRequestCountsRecordFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<ConsoleServiceRequestCountsRecordFilter>>
  /** Filter by the object’s `service` field. */
  service: InputMaybe<StringFilter>
}

export type Functionsv1DonId = {
  __typename?: "Functionsv1DonId"
  donId: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `Functionsv1DonId` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type Functionsv1DonIdCondition = {
  /** Checks for equality with the object’s `donId` field. */
  donId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `Functionsv1DonId` object types. All fields are combined with a logical ‘and.’ */
export type Functionsv1DonIdFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Functionsv1DonIdFilter>>
  /** Filter by the object’s `donId` field. */
  donId: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Functionsv1DonIdFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Functionsv1DonIdFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `Functionsv1DonId` values. */
export type Functionsv1DonIdsConnection = {
  __typename?: "Functionsv1DonIdsConnection"
  /** A list of edges which contains the `Functionsv1DonId` and cursor to aid in pagination. */
  edges: Array<Functionsv1DonIdsEdge>
  /** A list of `Functionsv1DonId` objects. */
  nodes: Array<Functionsv1DonId>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Functionsv1DonId` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Functionsv1DonId` edge in the connection. */
export type Functionsv1DonIdsEdge = {
  __typename?: "Functionsv1DonIdsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Functionsv1DonId` at the end of the edge. */
  node: Functionsv1DonId
}

/** Methods to use when ordering `Functionsv1DonId`. */
export enum Functionsv1DonIdsOrderBy {
  DonIdAsc = "DON_ID_ASC",
  DonIdDesc = "DON_ID_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
}

export type Functionsv1Event = {
  __typename?: "Functionsv1Event"
  balance: Maybe<Scalars["BigFloat"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  event: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  payment: Maybe<Scalars["BigFloat"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionLogIndex: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `Functionsv1Event` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type Functionsv1EventCondition = {
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `event` field. */
  event: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `payment` field. */
  payment: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionLogIndex` field. */
  transactionLogIndex: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `Functionsv1Event` object types. All fields are combined with a logical ‘and.’ */
export type Functionsv1EventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Functionsv1EventFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `event` field. */
  event: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Functionsv1EventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Functionsv1EventFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionLogIndex` field. */
  transactionLogIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `Functionsv1Event` values. */
export type Functionsv1EventsConnection = {
  __typename?: "Functionsv1EventsConnection"
  /** A list of edges which contains the `Functionsv1Event` and cursor to aid in pagination. */
  edges: Array<Functionsv1EventsEdge>
  /** A list of `Functionsv1Event` objects. */
  nodes: Array<Functionsv1Event>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Functionsv1Event` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Functionsv1Event` edge in the connection. */
export type Functionsv1EventsEdge = {
  __typename?: "Functionsv1EventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Functionsv1Event` at the end of the edge. */
  node: Functionsv1Event
}

/** Methods to use when ordering `Functionsv1Event`. */
export enum Functionsv1EventsOrderBy {
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  EventAsc = "EVENT_ASC",
  EventDesc = "EVENT_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionLogIndexAsc = "TRANSACTION_LOG_INDEX_ASC",
  TransactionLogIndexDesc = "TRANSACTION_LOG_INDEX_DESC",
}

export type Functionsv1Request = {
  __typename?: "Functionsv1Request"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  donId: Maybe<Scalars["String"]["output"]>
  error: Maybe<Scalars["String"]["output"]>
  isComputationError: Maybe<Scalars["Boolean"]["output"]>
  isFailed: Maybe<Scalars["Boolean"]["output"]>
  isFulfilled: Maybe<Scalars["Boolean"]["output"]>
  isPending: Maybe<Scalars["Boolean"]["output"]>
  isTimedOut: Maybe<Scalars["Boolean"]["output"]>
  maxCost: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  payment: Maybe<Scalars["BigFloat"]["output"]>
  reason: Maybe<Scalars["String"]["output"]>
  requestId: Maybe<Scalars["String"]["output"]>
  resultCode: Maybe<Scalars["Int"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionLogIndex: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `Functionsv1Request` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type Functionsv1RequestCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `donId` field. */
  donId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `error` field. */
  error: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `isComputationError` field. */
  isComputationError: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `isFailed` field. */
  isFailed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `isFulfilled` field. */
  isFulfilled: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `isPending` field. */
  isPending: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `isTimedOut` field. */
  isTimedOut: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `maxCost` field. */
  maxCost: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `payment` field. */
  payment: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `reason` field. */
  reason: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `requestId` field. */
  requestId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `resultCode` field. */
  resultCode: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionLogIndex` field. */
  transactionLogIndex: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `Functionsv1Request` object types. All fields are combined with a logical ‘and.’ */
export type Functionsv1RequestFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Functionsv1RequestFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `donId` field. */
  donId: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Functionsv1RequestFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Functionsv1RequestFilter>>
  /** Filter by the object’s `requestId` field. */
  requestId: InputMaybe<StringFilter>
  /** Filter by the object’s `resultCode` field. */
  resultCode: InputMaybe<IntFilter>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionLogIndex` field. */
  transactionLogIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `Functionsv1Request` values. */
export type Functionsv1RequestsConnection = {
  __typename?: "Functionsv1RequestsConnection"
  /** A list of edges which contains the `Functionsv1Request` and cursor to aid in pagination. */
  edges: Array<Functionsv1RequestsEdge>
  /** A list of `Functionsv1Request` objects. */
  nodes: Array<Functionsv1Request>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Functionsv1Request` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Functionsv1Request` edge in the connection. */
export type Functionsv1RequestsEdge = {
  __typename?: "Functionsv1RequestsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Functionsv1Request` at the end of the edge. */
  node: Functionsv1Request
}

/** Methods to use when ordering `Functionsv1Request`. */
export enum Functionsv1RequestsOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  DonIdAsc = "DON_ID_ASC",
  DonIdDesc = "DON_ID_DESC",
  ErrorAsc = "ERROR_ASC",
  ErrorDesc = "ERROR_DESC",
  IsComputationErrorAsc = "IS_COMPUTATION_ERROR_ASC",
  IsComputationErrorDesc = "IS_COMPUTATION_ERROR_DESC",
  IsFailedAsc = "IS_FAILED_ASC",
  IsFailedDesc = "IS_FAILED_DESC",
  IsFulfilledAsc = "IS_FULFILLED_ASC",
  IsFulfilledDesc = "IS_FULFILLED_DESC",
  IsPendingAsc = "IS_PENDING_ASC",
  IsPendingDesc = "IS_PENDING_DESC",
  IsTimedOutAsc = "IS_TIMED_OUT_ASC",
  IsTimedOutDesc = "IS_TIMED_OUT_DESC",
  MaxCostAsc = "MAX_COST_ASC",
  MaxCostDesc = "MAX_COST_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  ReasonAsc = "REASON_ASC",
  ReasonDesc = "REASON_DESC",
  RequestIdAsc = "REQUEST_ID_ASC",
  RequestIdDesc = "REQUEST_ID_DESC",
  ResultCodeAsc = "RESULT_CODE_ASC",
  ResultCodeDesc = "RESULT_CODE_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionLogIndexAsc = "TRANSACTION_LOG_INDEX_ASC",
  TransactionLogIndexDesc = "TRANSACTION_LOG_INDEX_DESC",
}

export type Functionsv1Subscription = {
  __typename?: "Functionsv1Subscription"
  activeConsumersCount: Maybe<Scalars["Int"]["output"]>
  cancelledAt: Maybe<Scalars["Datetime"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  currentBalance: Maybe<Scalars["BigFloat"]["output"]>
  isActive: Maybe<Scalars["Boolean"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  nextSubscriptionOwner: Maybe<Scalars["String"]["output"]>
  refundAmount: Maybe<Scalars["BigFloat"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  subscriptionOwner: Maybe<Scalars["String"]["output"]>
  totalFulfilledRequests: Maybe<Scalars["BigInt"]["output"]>
}

/**
 * A condition to be used against `Functionsv1Subscription` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Functionsv1SubscriptionCondition = {
  /** Checks for equality with the object’s `activeConsumersCount` field. */
  activeConsumersCount: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `cancelledAt` field. */
  cancelledAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `currentBalance` field. */
  currentBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `isActive` field. */
  isActive: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `nextSubscriptionOwner` field. */
  nextSubscriptionOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `refundAmount` field. */
  refundAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalFulfilledRequests` field. */
  totalFulfilledRequests: InputMaybe<Scalars["BigInt"]["input"]>
}

/** A filter to be used against `Functionsv1Subscription` object types. All fields are combined with a logical ‘and.’ */
export type Functionsv1SubscriptionFilter = {
  /** Filter by the object’s `activeConsumersCount` field. */
  activeConsumersCount: InputMaybe<IntFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Functionsv1SubscriptionFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `nextSubscriptionOwner` field. */
  nextSubscriptionOwner: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Functionsv1SubscriptionFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Functionsv1SubscriptionFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<StringFilter>
}

/** A connection to a list of `Functionsv1Subscription` values. */
export type Functionsv1SubscriptionsConnection = {
  __typename?: "Functionsv1SubscriptionsConnection"
  /** A list of edges which contains the `Functionsv1Subscription` and cursor to aid in pagination. */
  edges: Array<Functionsv1SubscriptionsEdge>
  /** A list of `Functionsv1Subscription` objects. */
  nodes: Array<Functionsv1Subscription>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Functionsv1Subscription` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

export type Functionsv1SubscriptionsConsumer = {
  __typename?: "Functionsv1SubscriptionsConsumer"
  addedAt: Maybe<Scalars["Datetime"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  lastFulfillmentTimestamp: Maybe<Scalars["Datetime"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  routerAddress: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  totalPaymentsAmount: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `Functionsv1SubscriptionsConsumer` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type Functionsv1SubscriptionsConsumerCondition = {
  /** Checks for equality with the object’s `addedAt` field. */
  addedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `lastFulfillmentTimestamp` field. */
  lastFulfillmentTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `routerAddress` field. */
  routerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `totalPaymentsAmount` field. */
  totalPaymentsAmount: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `Functionsv1SubscriptionsConsumer` object types. All fields are combined with a logical ‘and.’ */
export type Functionsv1SubscriptionsConsumerFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Functionsv1SubscriptionsConsumerFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Functionsv1SubscriptionsConsumerFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Functionsv1SubscriptionsConsumerFilter>>
  /** Filter by the object’s `routerAddress` field. */
  routerAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `Functionsv1SubscriptionsConsumer` values. */
export type Functionsv1SubscriptionsConsumersConnection = {
  __typename?: "Functionsv1SubscriptionsConsumersConnection"
  /** A list of edges which contains the `Functionsv1SubscriptionsConsumer` and cursor to aid in pagination. */
  edges: Array<Functionsv1SubscriptionsConsumersEdge>
  /** A list of `Functionsv1SubscriptionsConsumer` objects. */
  nodes: Array<Functionsv1SubscriptionsConsumer>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Functionsv1SubscriptionsConsumer` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Functionsv1SubscriptionsConsumer` edge in the connection. */
export type Functionsv1SubscriptionsConsumersEdge = {
  __typename?: "Functionsv1SubscriptionsConsumersEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Functionsv1SubscriptionsConsumer` at the end of the edge. */
  node: Functionsv1SubscriptionsConsumer
}

/** Methods to use when ordering `Functionsv1SubscriptionsConsumer`. */
export enum Functionsv1SubscriptionsConsumersOrderBy {
  AddedAtAsc = "ADDED_AT_ASC",
  AddedAtDesc = "ADDED_AT_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  LastFulfillmentTimestampAsc = "LAST_FULFILLMENT_TIMESTAMP_ASC",
  LastFulfillmentTimestampDesc = "LAST_FULFILLMENT_TIMESTAMP_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TotalPaymentsAmountAsc = "TOTAL_PAYMENTS_AMOUNT_ASC",
  TotalPaymentsAmountDesc = "TOTAL_PAYMENTS_AMOUNT_DESC",
}

/** A `Functionsv1Subscription` edge in the connection. */
export type Functionsv1SubscriptionsEdge = {
  __typename?: "Functionsv1SubscriptionsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Functionsv1Subscription` at the end of the edge. */
  node: Functionsv1Subscription
}

/** Methods to use when ordering `Functionsv1Subscription`. */
export enum Functionsv1SubscriptionsOrderBy {
  ActiveConsumersCountAsc = "ACTIVE_CONSUMERS_COUNT_ASC",
  ActiveConsumersCountDesc = "ACTIVE_CONSUMERS_COUNT_DESC",
  CancelledAtAsc = "CANCELLED_AT_ASC",
  CancelledAtDesc = "CANCELLED_AT_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  CurrentBalanceAsc = "CURRENT_BALANCE_ASC",
  CurrentBalanceDesc = "CURRENT_BALANCE_DESC",
  IsActiveAsc = "IS_ACTIVE_ASC",
  IsActiveDesc = "IS_ACTIVE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  NextSubscriptionOwnerAsc = "NEXT_SUBSCRIPTION_OWNER_ASC",
  NextSubscriptionOwnerDesc = "NEXT_SUBSCRIPTION_OWNER_DESC",
  RefundAmountAsc = "REFUND_AMOUNT_ASC",
  RefundAmountDesc = "REFUND_AMOUNT_DESC",
  RouterAddressAsc = "ROUTER_ADDRESS_ASC",
  RouterAddressDesc = "ROUTER_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  SubscriptionOwnerAsc = "SUBSCRIPTION_OWNER_ASC",
  SubscriptionOwnerDesc = "SUBSCRIPTION_OWNER_DESC",
  TotalFulfilledRequestsAsc = "TOTAL_FULFILLED_REQUESTS_ASC",
  TotalFulfilledRequestsDesc = "TOTAL_FULFILLED_REQUESTS_DESC",
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

export type KeepersNewUpkeep = {
  __typename?: "KeepersNewUpkeep"
  adminAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  maxValidBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  pauseStatus: Maybe<Scalars["String"]["output"]>
  proposedAdmin: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  updatedCheckData: Maybe<Scalars["String"]["output"]>
  updatedGasLimit: Maybe<Scalars["BigFloat"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
}

export type KeepersNewUpkeepBalance = {
  __typename?: "KeepersNewUpkeepBalance"
  adminAddress: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["BigFloat"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  minBalance: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersNewUpkeepBalance` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type KeepersNewUpkeepBalanceCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `minBalance` field. */
  minBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersNewUpkeepBalance` object types. All fields are combined with a logical ‘and.’ */
export type KeepersNewUpkeepBalanceFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersNewUpkeepBalanceFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersNewUpkeepBalanceFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersNewUpkeepBalanceFilter>>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersNewUpkeepBalance` values. */
export type KeepersNewUpkeepBalancesConnection = {
  __typename?: "KeepersNewUpkeepBalancesConnection"
  /** A list of edges which contains the `KeepersNewUpkeepBalance` and cursor to aid in pagination. */
  edges: Array<KeepersNewUpkeepBalancesEdge>
  /** A list of `KeepersNewUpkeepBalance` objects. */
  nodes: Array<KeepersNewUpkeepBalance>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersNewUpkeepBalance` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersNewUpkeepBalance` edge in the connection. */
export type KeepersNewUpkeepBalancesEdge = {
  __typename?: "KeepersNewUpkeepBalancesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersNewUpkeepBalance` at the end of the edge. */
  node: KeepersNewUpkeepBalance
}

/** Methods to use when ordering `KeepersNewUpkeepBalance`. */
export enum KeepersNewUpkeepBalancesOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  MinBalanceAsc = "MIN_BALANCE_ASC",
  MinBalanceDesc = "MIN_BALANCE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

/**
 * A condition to be used against `KeepersNewUpkeep` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type KeepersNewUpkeepCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedCheckData` field. */
  updatedCheckData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedGasLimit` field. */
  updatedGasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersNewUpkeep` object types. All fields are combined with a logical ‘and.’ */
export type KeepersNewUpkeepFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersNewUpkeepFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersNewUpkeepFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersNewUpkeepFilter>>
  /** Filter by the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<StringFilter>
  /** Filter by the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `updatedCheckData` field. */
  updatedCheckData: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
}

export type KeepersNewUpkeepMigration = {
  __typename?: "KeepersNewUpkeepMigration"
  adminAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  maxValidBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  pauseStatus: Maybe<Scalars["String"]["output"]>
  proposedAdmin: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  triggerConfig: Maybe<Scalars["String"]["output"]>
  updatedCheckData: Maybe<Scalars["String"]["output"]>
  updatedGasLimit: Maybe<Scalars["BigFloat"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
}

export type KeepersNewUpkeepMigrationBalance = {
  __typename?: "KeepersNewUpkeepMigrationBalance"
  adminAddress: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["BigFloat"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  minBalance: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersNewUpkeepMigrationBalance` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type KeepersNewUpkeepMigrationBalanceCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `minBalance` field. */
  minBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersNewUpkeepMigrationBalance` object types. All fields are combined with a logical ‘and.’ */
export type KeepersNewUpkeepMigrationBalanceFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersNewUpkeepMigrationBalanceFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersNewUpkeepMigrationBalanceFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersNewUpkeepMigrationBalanceFilter>>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersNewUpkeepMigrationBalance` values. */
export type KeepersNewUpkeepMigrationBalancesConnection = {
  __typename?: "KeepersNewUpkeepMigrationBalancesConnection"
  /** A list of edges which contains the `KeepersNewUpkeepMigrationBalance` and cursor to aid in pagination. */
  edges: Array<KeepersNewUpkeepMigrationBalancesEdge>
  /** A list of `KeepersNewUpkeepMigrationBalance` objects. */
  nodes: Array<KeepersNewUpkeepMigrationBalance>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersNewUpkeepMigrationBalance` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersNewUpkeepMigrationBalance` edge in the connection. */
export type KeepersNewUpkeepMigrationBalancesEdge = {
  __typename?: "KeepersNewUpkeepMigrationBalancesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersNewUpkeepMigrationBalance` at the end of the edge. */
  node: KeepersNewUpkeepMigrationBalance
}

/** Methods to use when ordering `KeepersNewUpkeepMigrationBalance`. */
export enum KeepersNewUpkeepMigrationBalancesOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  MinBalanceAsc = "MIN_BALANCE_ASC",
  MinBalanceDesc = "MIN_BALANCE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

/**
 * A condition to be used against `KeepersNewUpkeepMigration` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type KeepersNewUpkeepMigrationCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedCheckData` field. */
  updatedCheckData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `updatedGasLimit` field. */
  updatedGasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersNewUpkeepMigration` object types. All fields are combined with a logical ‘and.’ */
export type KeepersNewUpkeepMigrationFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersNewUpkeepMigrationFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersNewUpkeepMigrationFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersNewUpkeepMigrationFilter>>
  /** Filter by the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<StringFilter>
  /** Filter by the object’s `proposedAdmin` field. */
  proposedAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `triggerConfig` field. */
  triggerConfig: InputMaybe<StringFilter>
  /** Filter by the object’s `updatedCheckData` field. */
  updatedCheckData: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersNewUpkeepMigration` values. */
export type KeepersNewUpkeepMigrationsConnection = {
  __typename?: "KeepersNewUpkeepMigrationsConnection"
  /** A list of edges which contains the `KeepersNewUpkeepMigration` and cursor to aid in pagination. */
  edges: Array<KeepersNewUpkeepMigrationsEdge>
  /** A list of `KeepersNewUpkeepMigration` objects. */
  nodes: Array<KeepersNewUpkeepMigration>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersNewUpkeepMigration` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersNewUpkeepMigration` edge in the connection. */
export type KeepersNewUpkeepMigrationsEdge = {
  __typename?: "KeepersNewUpkeepMigrationsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersNewUpkeepMigration` at the end of the edge. */
  node: KeepersNewUpkeepMigration
}

/** Methods to use when ordering `KeepersNewUpkeepMigration`. */
export enum KeepersNewUpkeepMigrationsOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  MaxValidBlockNumberAsc = "MAX_VALID_BLOCK_NUMBER_ASC",
  MaxValidBlockNumberDesc = "MAX_VALID_BLOCK_NUMBER_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PauseStatusAsc = "PAUSE_STATUS_ASC",
  PauseStatusDesc = "PAUSE_STATUS_DESC",
  ProposedAdminAsc = "PROPOSED_ADMIN_ASC",
  ProposedAdminDesc = "PROPOSED_ADMIN_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  UpdatedCheckDataAsc = "UPDATED_CHECK_DATA_ASC",
  UpdatedCheckDataDesc = "UPDATED_CHECK_DATA_DESC",
  UpdatedGasLimitAsc = "UPDATED_GAS_LIMIT_ASC",
  UpdatedGasLimitDesc = "UPDATED_GAS_LIMIT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type KeepersNewUpkeepRegistration = {
  __typename?: "KeepersNewUpkeepRegistration"
  adminAddress: Maybe<Scalars["String"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  upkeepContractAddress: Maybe<Scalars["String"]["output"]>
  upkeepHash: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
  upkeepName: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersNewUpkeepRegistration` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type KeepersNewUpkeepRegistrationCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepName` field. */
  upkeepName: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersNewUpkeepRegistration` object types. All fields are combined with a logical ‘and.’ */
export type KeepersNewUpkeepRegistrationFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersNewUpkeepRegistrationFilter>>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `gasLimit` field. */
  gasLimit: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersNewUpkeepRegistrationFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersNewUpkeepRegistrationFilter>>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepName` field. */
  upkeepName: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersNewUpkeepRegistration` values. */
export type KeepersNewUpkeepRegistrationsConnection = {
  __typename?: "KeepersNewUpkeepRegistrationsConnection"
  /** A list of edges which contains the `KeepersNewUpkeepRegistration` and cursor to aid in pagination. */
  edges: Array<KeepersNewUpkeepRegistrationsEdge>
  /** A list of `KeepersNewUpkeepRegistration` objects. */
  nodes: Array<KeepersNewUpkeepRegistration>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersNewUpkeepRegistration` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersNewUpkeepRegistration` edge in the connection. */
export type KeepersNewUpkeepRegistrationsEdge = {
  __typename?: "KeepersNewUpkeepRegistrationsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersNewUpkeepRegistration` at the end of the edge. */
  node: KeepersNewUpkeepRegistration
}

/** Methods to use when ordering `KeepersNewUpkeepRegistration`. */
export enum KeepersNewUpkeepRegistrationsOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  UpkeepContractAddressAsc = "UPKEEP_CONTRACT_ADDRESS_ASC",
  UpkeepContractAddressDesc = "UPKEEP_CONTRACT_ADDRESS_DESC",
  UpkeepHashAsc = "UPKEEP_HASH_ASC",
  UpkeepHashDesc = "UPKEEP_HASH_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
  UpkeepNameAsc = "UPKEEP_NAME_ASC",
  UpkeepNameDesc = "UPKEEP_NAME_DESC",
}

/** A connection to a list of `KeepersNewUpkeep` values. */
export type KeepersNewUpkeepsConnection = {
  __typename?: "KeepersNewUpkeepsConnection"
  /** A list of edges which contains the `KeepersNewUpkeep` and cursor to aid in pagination. */
  edges: Array<KeepersNewUpkeepsEdge>
  /** A list of `KeepersNewUpkeep` objects. */
  nodes: Array<KeepersNewUpkeep>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersNewUpkeep` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersNewUpkeep` edge in the connection. */
export type KeepersNewUpkeepsEdge = {
  __typename?: "KeepersNewUpkeepsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersNewUpkeep` at the end of the edge. */
  node: KeepersNewUpkeep
}

/** Methods to use when ordering `KeepersNewUpkeep`. */
export enum KeepersNewUpkeepsOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  MaxValidBlockNumberAsc = "MAX_VALID_BLOCK_NUMBER_ASC",
  MaxValidBlockNumberDesc = "MAX_VALID_BLOCK_NUMBER_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PauseStatusAsc = "PAUSE_STATUS_ASC",
  PauseStatusDesc = "PAUSE_STATUS_DESC",
  ProposedAdminAsc = "PROPOSED_ADMIN_ASC",
  ProposedAdminDesc = "PROPOSED_ADMIN_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TriggerConfigAsc = "TRIGGER_CONFIG_ASC",
  TriggerConfigDesc = "TRIGGER_CONFIG_DESC",
  UpdatedCheckDataAsc = "UPDATED_CHECK_DATA_ASC",
  UpdatedCheckDataDesc = "UPDATED_CHECK_DATA_DESC",
  UpdatedGasLimitAsc = "UPDATED_GAS_LIMIT_ASC",
  UpdatedGasLimitDesc = "UPDATED_GAS_LIMIT_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type KeepersPerformUpkeep = {
  __typename?: "KeepersPerformUpkeep"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  keeperAddress: Maybe<Scalars["String"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  payment: Maybe<Scalars["BigFloat"]["output"]>
  performData: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  success: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  trigger: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersPerformUpkeep` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type KeepersPerformUpkeepCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `keeperAddress` field. */
  keeperAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `payment` field. */
  payment: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `performData` field. */
  performData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `success` field. */
  success: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `trigger` field. */
  trigger: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersPerformUpkeep` object types. All fields are combined with a logical ‘and.’ */
export type KeepersPerformUpkeepFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersPerformUpkeepFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `keeperAddress` field. */
  keeperAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersPerformUpkeepFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersPerformUpkeepFilter>>
  /** Filter by the object’s `performData` field. */
  performData: InputMaybe<StringFilter>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `trigger` field. */
  trigger: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersPerformUpkeep` values. */
export type KeepersPerformUpkeepsConnection = {
  __typename?: "KeepersPerformUpkeepsConnection"
  /** A list of edges which contains the `KeepersPerformUpkeep` and cursor to aid in pagination. */
  edges: Array<KeepersPerformUpkeepsEdge>
  /** A list of `KeepersPerformUpkeep` objects. */
  nodes: Array<KeepersPerformUpkeep>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersPerformUpkeep` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersPerformUpkeep` edge in the connection. */
export type KeepersPerformUpkeepsEdge = {
  __typename?: "KeepersPerformUpkeepsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersPerformUpkeep` at the end of the edge. */
  node: KeepersPerformUpkeep
}

/** Methods to use when ordering `KeepersPerformUpkeep`. */
export enum KeepersPerformUpkeepsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  KeeperAddressAsc = "KEEPER_ADDRESS_ASC",
  KeeperAddressDesc = "KEEPER_ADDRESS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  PerformDataAsc = "PERFORM_DATA_ASC",
  PerformDataDesc = "PERFORM_DATA_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  SuccessAsc = "SUCCESS_ASC",
  SuccessDesc = "SUCCESS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  TriggerAsc = "TRIGGER_ASC",
  TriggerDesc = "TRIGGER_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
}

export type KeepersRegistrationRequest = {
  __typename?: "KeepersRegistrationRequest"
  adminAddress: Maybe<Scalars["String"]["output"]>
  amount: Maybe<Scalars["BigFloat"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  encryptedEmail: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["Int"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  name: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  source: Maybe<Scalars["Int"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  upkeepContractAddress: Maybe<Scalars["String"]["output"]>
  upkeepHash: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
  upkeepName: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersRegistrationRequest` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type KeepersRegistrationRequestCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `amount` field. */
  amount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `encryptedEmail` field. */
  encryptedEmail: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `source` field. */
  source: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepName` field. */
  upkeepName: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersRegistrationRequest` object types. All fields are combined with a logical ‘and.’ */
export type KeepersRegistrationRequestFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersRegistrationRequestFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `encryptedEmail` field. */
  encryptedEmail: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `gasLimit` field. */
  gasLimit: InputMaybe<IntFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `name` field. */
  name: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersRegistrationRequestFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersRegistrationRequestFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `source` field. */
  source: InputMaybe<IntFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepName` field. */
  upkeepName: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersRegistrationRequest` values. */
export type KeepersRegistrationRequestsConnection = {
  __typename?: "KeepersRegistrationRequestsConnection"
  /** A list of edges which contains the `KeepersRegistrationRequest` and cursor to aid in pagination. */
  edges: Array<KeepersRegistrationRequestsEdge>
  /** A list of `KeepersRegistrationRequest` objects. */
  nodes: Array<KeepersRegistrationRequest>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersRegistrationRequest` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersRegistrationRequest` edge in the connection. */
export type KeepersRegistrationRequestsEdge = {
  __typename?: "KeepersRegistrationRequestsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersRegistrationRequest` at the end of the edge. */
  node: KeepersRegistrationRequest
}

/** Methods to use when ordering `KeepersRegistrationRequest`. */
export enum KeepersRegistrationRequestsOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  AmountAsc = "AMOUNT_ASC",
  AmountDesc = "AMOUNT_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EncryptedEmailAsc = "ENCRYPTED_EMAIL_ASC",
  EncryptedEmailDesc = "ENCRYPTED_EMAIL_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  SourceAsc = "SOURCE_ASC",
  SourceDesc = "SOURCE_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpkeepContractAddressAsc = "UPKEEP_CONTRACT_ADDRESS_ASC",
  UpkeepContractAddressDesc = "UPKEEP_CONTRACT_ADDRESS_DESC",
  UpkeepHashAsc = "UPKEEP_HASH_ASC",
  UpkeepHashDesc = "UPKEEP_HASH_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
  UpkeepNameAsc = "UPKEEP_NAME_ASC",
  UpkeepNameDesc = "UPKEEP_NAME_DESC",
}

export type KeepersUpkeep = {
  __typename?: "KeepersUpkeep"
  adminAddress: Maybe<Scalars["String"]["output"]>
  balance: Maybe<Scalars["BigFloat"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  canceledAt: Maybe<Scalars["Datetime"]["output"]>
  canceledBlockHash: Maybe<Scalars["String"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  checkData: Maybe<Scalars["String"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  executeGas: Maybe<Scalars["BigFloat"]["output"]>
  gasLimit: Maybe<Scalars["BigFloat"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  maxValidBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  minBalance: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  pauseStatus: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  registrarAddress: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  status: Maybe<Scalars["String"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  upkeepAdmin: Maybe<Scalars["String"]["output"]>
  upkeepContractAddress: Maybe<Scalars["String"]["output"]>
  upkeepHash: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
  upkeepName: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersUpkeep` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type KeepersUpkeepCondition = {
  /** Checks for equality with the object’s `adminAddress` field. */
  adminAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `balance` field. */
  balance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `canceledAt` field. */
  canceledAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `canceledBlockHash` field. */
  canceledBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `checkData` field. */
  checkData: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `executeGas` field. */
  executeGas: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `maxValidBlockNumber` field. */
  maxValidBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `minBalance` field. */
  minBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `upkeepAdmin` field. */
  upkeepAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepName` field. */
  upkeepName: InputMaybe<Scalars["String"]["input"]>
}

export type KeepersUpkeepEvent = {
  __typename?: "KeepersUpkeepEvent"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  canceledAtBlockHeight: Maybe<Scalars["Int"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  executeGas: Maybe<Scalars["BigFloat"]["output"]>
  fundsAddedAmount: Maybe<Scalars["BigFloat"]["output"]>
  fundsAddedFromAddress: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  registryAddress: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  timestamp: Maybe<Scalars["Datetime"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  upkeepAdmin: Maybe<Scalars["String"]["output"]>
  upkeepId: Maybe<Scalars["String"]["output"]>
  withdrawnAmount: Maybe<Scalars["BigFloat"]["output"]>
  withdrawnToAddress: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `KeepersUpkeepEvent` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type KeepersUpkeepEventCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `canceledAtBlockHeight` field. */
  canceledAtBlockHeight: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `executeGas` field. */
  executeGas: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `fundsAddedAmount` field. */
  fundsAddedAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `fundsAddedFromAddress` field. */
  fundsAddedFromAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `registryAddress` field. */
  registryAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `upkeepAdmin` field. */
  upkeepAdmin: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `upkeepId` field. */
  upkeepId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `withdrawnAmount` field. */
  withdrawnAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `withdrawnToAddress` field. */
  withdrawnToAddress: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `KeepersUpkeepEvent` object types. All fields are combined with a logical ‘and.’ */
export type KeepersUpkeepEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersUpkeepEventFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `canceledAtBlockHeight` field. */
  canceledAtBlockHeight: InputMaybe<IntFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `fundsAddedFromAddress` field. */
  fundsAddedFromAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersUpkeepEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersUpkeepEventFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `upkeepAdmin` field. */
  upkeepAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
  /** Filter by the object’s `withdrawnToAddress` field. */
  withdrawnToAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersUpkeepEvent` values. */
export type KeepersUpkeepEventsConnection = {
  __typename?: "KeepersUpkeepEventsConnection"
  /** A list of edges which contains the `KeepersUpkeepEvent` and cursor to aid in pagination. */
  edges: Array<KeepersUpkeepEventsEdge>
  /** A list of `KeepersUpkeepEvent` objects. */
  nodes: Array<KeepersUpkeepEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersUpkeepEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersUpkeepEvent` edge in the connection. */
export type KeepersUpkeepEventsEdge = {
  __typename?: "KeepersUpkeepEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersUpkeepEvent` at the end of the edge. */
  node: KeepersUpkeepEvent
}

/** Methods to use when ordering `KeepersUpkeepEvent`. */
export enum KeepersUpkeepEventsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CanceledAtBlockHeightAsc = "CANCELED_AT_BLOCK_HEIGHT_ASC",
  CanceledAtBlockHeightDesc = "CANCELED_AT_BLOCK_HEIGHT_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  ExecuteGasAsc = "EXECUTE_GAS_ASC",
  ExecuteGasDesc = "EXECUTE_GAS_DESC",
  FundsAddedAmountAsc = "FUNDS_ADDED_AMOUNT_ASC",
  FundsAddedAmountDesc = "FUNDS_ADDED_AMOUNT_DESC",
  FundsAddedFromAddressAsc = "FUNDS_ADDED_FROM_ADDRESS_ASC",
  FundsAddedFromAddressDesc = "FUNDS_ADDED_FROM_ADDRESS_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TimestampAsc = "TIMESTAMP_ASC",
  TimestampDesc = "TIMESTAMP_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpkeepAdminAsc = "UPKEEP_ADMIN_ASC",
  UpkeepAdminDesc = "UPKEEP_ADMIN_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
  WithdrawnAmountAsc = "WITHDRAWN_AMOUNT_ASC",
  WithdrawnAmountDesc = "WITHDRAWN_AMOUNT_DESC",
  WithdrawnToAddressAsc = "WITHDRAWN_TO_ADDRESS_ASC",
  WithdrawnToAddressDesc = "WITHDRAWN_TO_ADDRESS_DESC",
}

/** A filter to be used against `KeepersUpkeep` object types. All fields are combined with a logical ‘and.’ */
export type KeepersUpkeepFilter = {
  /** Filter by the object’s `adminAddress` field. */
  adminAddress: InputMaybe<StringFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<KeepersUpkeepFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `canceledBlockHash` field. */
  canceledBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `checkData` field. */
  checkData: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<KeepersUpkeepFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<KeepersUpkeepFilter>>
  /** Filter by the object’s `pauseStatus` field. */
  pauseStatus: InputMaybe<StringFilter>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `registrarAddress` field. */
  registrarAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `registryAddress` field. */
  registryAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `status` field. */
  status: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `upkeepAdmin` field. */
  upkeepAdmin: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepContractAddress` field. */
  upkeepContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepHash` field. */
  upkeepHash: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepId` field. */
  upkeepId: InputMaybe<StringFilter>
  /** Filter by the object’s `upkeepName` field. */
  upkeepName: InputMaybe<StringFilter>
}

/** A connection to a list of `KeepersUpkeep` values. */
export type KeepersUpkeepsConnection = {
  __typename?: "KeepersUpkeepsConnection"
  /** A list of edges which contains the `KeepersUpkeep` and cursor to aid in pagination. */
  edges: Array<KeepersUpkeepsEdge>
  /** A list of `KeepersUpkeep` objects. */
  nodes: Array<KeepersUpkeep>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `KeepersUpkeep` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `KeepersUpkeep` edge in the connection. */
export type KeepersUpkeepsEdge = {
  __typename?: "KeepersUpkeepsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `KeepersUpkeep` at the end of the edge. */
  node: KeepersUpkeep
}

/** Methods to use when ordering `KeepersUpkeep`. */
export enum KeepersUpkeepsOrderBy {
  AdminAddressAsc = "ADMIN_ADDRESS_ASC",
  AdminAddressDesc = "ADMIN_ADDRESS_DESC",
  BalanceAsc = "BALANCE_ASC",
  BalanceDesc = "BALANCE_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CanceledAtAsc = "CANCELED_AT_ASC",
  CanceledAtDesc = "CANCELED_AT_DESC",
  CanceledBlockHashAsc = "CANCELED_BLOCK_HASH_ASC",
  CanceledBlockHashDesc = "CANCELED_BLOCK_HASH_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  CheckDataAsc = "CHECK_DATA_ASC",
  CheckDataDesc = "CHECK_DATA_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  ExecuteGasAsc = "EXECUTE_GAS_ASC",
  ExecuteGasDesc = "EXECUTE_GAS_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  MaxValidBlockNumberAsc = "MAX_VALID_BLOCK_NUMBER_ASC",
  MaxValidBlockNumberDesc = "MAX_VALID_BLOCK_NUMBER_DESC",
  MinBalanceAsc = "MIN_BALANCE_ASC",
  MinBalanceDesc = "MIN_BALANCE_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PauseStatusAsc = "PAUSE_STATUS_ASC",
  PauseStatusDesc = "PAUSE_STATUS_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RegistrarAddressAsc = "REGISTRAR_ADDRESS_ASC",
  RegistrarAddressDesc = "REGISTRAR_ADDRESS_DESC",
  RegistryAddressAsc = "REGISTRY_ADDRESS_ASC",
  RegistryAddressDesc = "REGISTRY_ADDRESS_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  StatusAsc = "STATUS_ASC",
  StatusDesc = "STATUS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  UpkeepAdminAsc = "UPKEEP_ADMIN_ASC",
  UpkeepAdminDesc = "UPKEEP_ADMIN_DESC",
  UpkeepContractAddressAsc = "UPKEEP_CONTRACT_ADDRESS_ASC",
  UpkeepContractAddressDesc = "UPKEEP_CONTRACT_ADDRESS_DESC",
  UpkeepHashAsc = "UPKEEP_HASH_ASC",
  UpkeepHashDesc = "UPKEEP_HASH_DESC",
  UpkeepIdAsc = "UPKEEP_ID_ASC",
  UpkeepIdDesc = "UPKEEP_ID_DESC",
  UpkeepNameAsc = "UPKEEP_NAME_ASC",
  UpkeepNameDesc = "UPKEEP_NAME_DESC",
}

/** A `LatestAnswersRecord` edge in the connection. */
export type LatestAnswerEdge = {
  __typename?: "LatestAnswerEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `LatestAnswersRecord` at the end of the edge. */
  node: LatestAnswersRecord
}

/** A connection to a list of `LatestAnswersRecord` values. */
export type LatestAnswersConnection = {
  __typename?: "LatestAnswersConnection"
  /** A list of edges which contains the `LatestAnswersRecord` and cursor to aid in pagination. */
  edges: Array<LatestAnswerEdge>
  /** A list of `LatestAnswersRecord` objects. */
  nodes: Array<LatestAnswersRecord>
  /** The count of *all* `LatestAnswersRecord` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** The return type of our `latestAnswers` query. */
export type LatestAnswersRecord = {
  __typename?: "LatestAnswersRecord"
  id: Maybe<Scalars["String"]["output"]>
  latestAnswer: Maybe<Scalars["BigFloat"]["output"]>
  latestTimestamp: Maybe<Scalars["Datetime"]["output"]>
}

/** A filter to be used against `LatestAnswersRecord` object types. All fields are combined with a logical ‘and.’ */
export type LatestAnswersRecordFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<LatestAnswersRecordFilter>>
  /** Filter by the object’s `id` field. */
  id: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<LatestAnswersRecordFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<LatestAnswersRecordFilter>>
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars["ID"]["output"]
}

/** A connection to a list of `OcrFeedsChainDatum` values. */
export type OcrFeedsChainDataConnection = {
  __typename?: "OcrFeedsChainDataConnection"
  /** A list of edges which contains the `OcrFeedsChainDatum` and cursor to aid in pagination. */
  edges: Array<OcrFeedsChainDataEdge>
  /** A list of `OcrFeedsChainDatum` objects. */
  nodes: Array<OcrFeedsChainDatum>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `OcrFeedsChainDatum` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `OcrFeedsChainDatum` edge in the connection. */
export type OcrFeedsChainDataEdge = {
  __typename?: "OcrFeedsChainDataEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `OcrFeedsChainDatum` at the end of the edge. */
  node: OcrFeedsChainDatum
}

/** Methods to use when ordering `OcrFeedsChainDatum`. */
export enum OcrFeedsChainDataOrderBy {
  AggregatorRoundIdAsc = "AGGREGATOR_ROUND_ID_ASC",
  AggregatorRoundIdDesc = "AGGREGATOR_ROUND_ID_DESC",
  AnswerAsc = "ANSWER_ASC",
  AnswerDesc = "ANSWER_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ObservationsAsc = "OBSERVATIONS_ASC",
  ObservationsDesc = "OBSERVATIONS_DESC",
  ObserversIndicesAsc = "OBSERVERS_INDICES_ASC",
  ObserversIndicesDesc = "OBSERVERS_INDICES_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  TransmitterAsc = "TRANSMITTER_ASC",
  TransmitterDesc = "TRANSMITTER_DESC",
}

export type OcrFeedsChainDatum = {
  __typename?: "OcrFeedsChainDatum"
  aggregatorRoundId: Maybe<Scalars["BigFloat"]["output"]>
  answer: Maybe<Scalars["BigFloat"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  observations: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  observersIndices: Maybe<Array<Maybe<Scalars["Int"]["output"]>>>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  transmitter: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `OcrFeedsChainDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type OcrFeedsChainDatumCondition = {
  /** Checks for equality with the object’s `aggregatorRoundId` field. */
  aggregatorRoundId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `answer` field. */
  answer: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `observations` field. */
  observations: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  /** Checks for equality with the object’s `observersIndices` field. */
  observersIndices: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `transmitter` field. */
  transmitter: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `OcrFeedsChainDatum` object types. All fields are combined with a logical ‘and.’ */
export type OcrFeedsChainDatumFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<OcrFeedsChainDatumFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<OcrFeedsChainDatumFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<OcrFeedsChainDatumFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `transmitter` field. */
  transmitter: InputMaybe<StringFilter>
}

export type OcrFeedsConfig = {
  __typename?: "OcrFeedsConfig"
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  minimumRequiredAnswers: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  threshold: Maybe<Scalars["Int"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
  transmitters: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
}

/**
 * A condition to be used against `OcrFeedsConfig` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type OcrFeedsConfigCondition = {
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `minimumRequiredAnswers` field. */
  minimumRequiredAnswers: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `threshold` field. */
  threshold: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `transmitters` field. */
  transmitters: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
}

/** A filter to be used against `OcrFeedsConfig` object types. All fields are combined with a logical ‘and.’ */
export type OcrFeedsConfigFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<OcrFeedsConfigFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `minimumRequiredAnswers` field. */
  minimumRequiredAnswers: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<OcrFeedsConfigFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<OcrFeedsConfigFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `threshold` field. */
  threshold: InputMaybe<IntFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `OcrFeedsConfig` values. */
export type OcrFeedsConfigsConnection = {
  __typename?: "OcrFeedsConfigsConnection"
  /** A list of edges which contains the `OcrFeedsConfig` and cursor to aid in pagination. */
  edges: Array<OcrFeedsConfigsEdge>
  /** A list of `OcrFeedsConfig` objects. */
  nodes: Array<OcrFeedsConfig>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `OcrFeedsConfig` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `OcrFeedsConfig` edge in the connection. */
export type OcrFeedsConfigsEdge = {
  __typename?: "OcrFeedsConfigsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `OcrFeedsConfig` at the end of the edge. */
  node: OcrFeedsConfig
}

/** Methods to use when ordering `OcrFeedsConfig`. */
export enum OcrFeedsConfigsOrderBy {
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  MinimumRequiredAnswersAsc = "MINIMUM_REQUIRED_ANSWERS_ASC",
  MinimumRequiredAnswersDesc = "MINIMUM_REQUIRED_ANSWERS_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  ThresholdAsc = "THRESHOLD_ASC",
  ThresholdDesc = "THRESHOLD_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
  TransmittersAsc = "TRANSMITTERS_ASC",
  TransmittersDesc = "TRANSMITTERS_DESC",
}

export type OcrFeedsLatestAnswer = {
  __typename?: "OcrFeedsLatestAnswer"
  answer: Maybe<Scalars["String"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `OcrFeedsLatestAnswer` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type OcrFeedsLatestAnswerCondition = {
  /** Checks for equality with the object’s `answer` field. */
  answer: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `OcrFeedsLatestAnswer` object types. All fields are combined with a logical ‘and.’ */
export type OcrFeedsLatestAnswerFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<OcrFeedsLatestAnswerFilter>>
  /** Filter by the object’s `answer` field. */
  answer: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<OcrFeedsLatestAnswerFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<OcrFeedsLatestAnswerFilter>>
}

/** A connection to a list of `OcrFeedsLatestAnswer` values. */
export type OcrFeedsLatestAnswersConnection = {
  __typename?: "OcrFeedsLatestAnswersConnection"
  /** A list of edges which contains the `OcrFeedsLatestAnswer` and cursor to aid in pagination. */
  edges: Array<OcrFeedsLatestAnswersEdge>
  /** A list of `OcrFeedsLatestAnswer` objects. */
  nodes: Array<OcrFeedsLatestAnswer>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `OcrFeedsLatestAnswer` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `OcrFeedsLatestAnswer` edge in the connection. */
export type OcrFeedsLatestAnswersEdge = {
  __typename?: "OcrFeedsLatestAnswersEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `OcrFeedsLatestAnswer` at the end of the edge. */
  node: OcrFeedsLatestAnswer
}

/** Methods to use when ordering `OcrFeedsLatestAnswer`. */
export enum OcrFeedsLatestAnswersOrderBy {
  AnswerAsc = "ANSWER_ASC",
  AnswerDesc = "ANSWER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
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

/** A connection to a list of `PriceHistoryWithTimestampRecord` values. */
export type PriceHistoryWithTimestampConnection = {
  __typename?: "PriceHistoryWithTimestampConnection"
  /** A list of edges which contains the `PriceHistoryWithTimestampRecord` and cursor to aid in pagination. */
  edges: Array<PriceHistoryWithTimestampEdge>
  /** A list of `PriceHistoryWithTimestampRecord` objects. */
  nodes: Array<PriceHistoryWithTimestampRecord>
  /** The count of *all* `PriceHistoryWithTimestampRecord` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `PriceHistoryWithTimestampRecord` edge in the connection. */
export type PriceHistoryWithTimestampEdge = {
  __typename?: "PriceHistoryWithTimestampEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `PriceHistoryWithTimestampRecord` at the end of the edge. */
  node: PriceHistoryWithTimestampRecord
}

/** The return type of our `priceHistoryWithTimestamp` query. */
export type PriceHistoryWithTimestampRecord = {
  __typename?: "PriceHistoryWithTimestampRecord"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  id: Maybe<Scalars["String"]["output"]>
  latestAnswer: Maybe<Scalars["BigFloat"]["output"]>
}

/** A filter to be used against `PriceHistoryWithTimestampRecord` object types. All fields are combined with a logical ‘and.’ */
export type PriceHistoryWithTimestampRecordFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<PriceHistoryWithTimestampRecordFilter>>
  /** Filter by the object’s `id` field. */
  id: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<PriceHistoryWithTimestampRecordFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<PriceHistoryWithTimestampRecordFilter>>
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: "Query"
  /** Reads and enables pagination through a set of `AutomationContract`. */
  allAutomationContracts: Maybe<AutomationContractsConnection>
  /** Reads and enables pagination through a set of `AutomationPerformEvent`. */
  allAutomationPerformEvents: Maybe<AutomationPerformEventsConnection>
  /** Reads and enables pagination through a set of `AutomationRegistration`. */
  allAutomationRegistrations: Maybe<AutomationRegistrationsConnection>
  /** Reads and enables pagination through a set of `AutomationStageContract`. */
  allAutomationStageContracts: Maybe<AutomationStageContractsConnection>
  /** Reads and enables pagination through a set of `AutomationStagePerformEvent`. */
  allAutomationStagePerformEvents: Maybe<AutomationStagePerformEventsConnection>
  /** Reads and enables pagination through a set of `AutomationStageRegistration`. */
  allAutomationStageRegistrations: Maybe<AutomationStageRegistrationsConnection>
  /** Reads and enables pagination through a set of `AutomationStageUpkeepEvent`. */
  allAutomationStageUpkeepEvents: Maybe<AutomationStageUpkeepEventsConnection>
  /** Reads and enables pagination through a set of `AutomationStageUpkeep`. */
  allAutomationStageUpkeeps: Maybe<AutomationStageUpkeepsConnection>
  /** Reads and enables pagination through a set of `AutomationUpkeepEvent`. */
  allAutomationUpkeepEvents: Maybe<AutomationUpkeepEventsConnection>
  /** Reads and enables pagination through a set of `AutomationUpkeep`. */
  allAutomationUpkeeps: Maybe<AutomationUpkeepsConnection>
  /** Reads and enables pagination through a set of `CcipAllLaneStatus`. */
  allCcipAllLaneStatuses: Maybe<CcipAllLaneStatusesConnection>
  /** Reads and enables pagination through a set of `CcipLaneStatus`. */
  allCcipLaneStatuses: Maybe<CcipLaneStatusesConnection>
  /** Reads and enables pagination through a set of `CcipLaneTimeEstimate`. */
  allCcipLaneTimeEstimates: Maybe<CcipLaneTimeEstimatesConnection>
  /** Reads and enables pagination through a set of `CcipMessage`. */
  allCcipMessages: Maybe<CcipMessagesConnection>
  /** Reads and enables pagination through a set of `CcipSend`. */
  allCcipSends: Maybe<CcipSendsConnection>
  /** Reads and enables pagination through a set of `CcipTransaction`. */
  allCcipTransactions: Maybe<CcipTransactionsConnection>
  /** Reads and enables pagination through a set of `CcipTransactionsFlat`. */
  allCcipTransactionsFlats: Maybe<CcipTransactionsFlatsConnection>
  /** Reads and enables pagination through a set of `ConsoleContract`. */
  allConsoleContracts: Maybe<ConsoleContractsConnection>
  /** Reads and enables pagination through a set of `ConsoleInstance`. */
  allConsoleInstances: Maybe<ConsoleInstancesConnection>
  /** Reads and enables pagination through a set of `ConsoleRequest`. */
  allConsoleRequests: Maybe<ConsoleRequestsConnection>
  /** Reads and enables pagination through a set of `Functionsv1DonId`. */
  allFunctionsv1DonIds: Maybe<Functionsv1DonIdsConnection>
  /** Reads and enables pagination through a set of `Functionsv1Event`. */
  allFunctionsv1Events: Maybe<Functionsv1EventsConnection>
  /** Reads and enables pagination through a set of `Functionsv1Request`. */
  allFunctionsv1Requests: Maybe<Functionsv1RequestsConnection>
  /** Reads and enables pagination through a set of `Functionsv1Subscription`. */
  allFunctionsv1Subscriptions: Maybe<Functionsv1SubscriptionsConnection>
  /** Reads and enables pagination through a set of `Functionsv1SubscriptionsConsumer`. */
  allFunctionsv1SubscriptionsConsumers: Maybe<Functionsv1SubscriptionsConsumersConnection>
  /** Reads and enables pagination through a set of `KeepersNewUpkeepBalance`. */
  allKeepersNewUpkeepBalances: Maybe<KeepersNewUpkeepBalancesConnection>
  /** Reads and enables pagination through a set of `KeepersNewUpkeepMigrationBalance`. */
  allKeepersNewUpkeepMigrationBalances: Maybe<KeepersNewUpkeepMigrationBalancesConnection>
  /** Reads and enables pagination through a set of `KeepersNewUpkeepMigration`. */
  allKeepersNewUpkeepMigrations: Maybe<KeepersNewUpkeepMigrationsConnection>
  /** Reads and enables pagination through a set of `KeepersNewUpkeepRegistration`. */
  allKeepersNewUpkeepRegistrations: Maybe<KeepersNewUpkeepRegistrationsConnection>
  /** Reads and enables pagination through a set of `KeepersNewUpkeep`. */
  allKeepersNewUpkeeps: Maybe<KeepersNewUpkeepsConnection>
  /** Reads and enables pagination through a set of `KeepersPerformUpkeep`. */
  allKeepersPerformUpkeeps: Maybe<KeepersPerformUpkeepsConnection>
  /** Reads and enables pagination through a set of `KeepersRegistrationRequest`. */
  allKeepersRegistrationRequests: Maybe<KeepersRegistrationRequestsConnection>
  /** Reads and enables pagination through a set of `KeepersUpkeepEvent`. */
  allKeepersUpkeepEvents: Maybe<KeepersUpkeepEventsConnection>
  /** Reads and enables pagination through a set of `KeepersUpkeep`. */
  allKeepersUpkeeps: Maybe<KeepersUpkeepsConnection>
  /** Reads and enables pagination through a set of `OcrFeedsChainDatum`. */
  allOcrFeedsChainData: Maybe<OcrFeedsChainDataConnection>
  /** Reads and enables pagination through a set of `OcrFeedsConfig`. */
  allOcrFeedsConfigs: Maybe<OcrFeedsConfigsConnection>
  /** Reads and enables pagination through a set of `OcrFeedsLatestAnswer`. */
  allOcrFeedsLatestAnswers: Maybe<OcrFeedsLatestAnswersConnection>
  /** Reads and enables pagination through a set of `StakingAlert`. */
  allStakingAlerts: Maybe<StakingAlertsConnection>
  /** Reads and enables pagination through a set of `StakingFeed`. */
  allStakingFeeds: Maybe<StakingFeedsConnection>
  /** Reads and enables pagination through a set of `StakingMaxSize`. */
  allStakingMaxSizes: Maybe<StakingMaxSizesConnection>
  /** Reads and enables pagination through a set of `StakingNodeOperator`. */
  allStakingNodeOperators: Maybe<StakingNodeOperatorsConnection>
  /** Reads and enables pagination through a set of `StakingPool`. */
  allStakingPools: Maybe<StakingPoolsConnection>
  /** Reads and enables pagination through a set of `StakingTotalAmount`. */
  allStakingTotalAmounts: Maybe<StakingTotalAmountsConnection>
  /** Reads and enables pagination through a set of `Stakingv02RewardVaultEmissionRate`. */
  allStakingv02RewardVaultEmissionRates: Maybe<Stakingv02RewardVaultEmissionRatesConnection>
  /** Reads and enables pagination through a set of `Stakingv02StakingPoolPrincipal`. */
  allStakingv02StakingPoolPrincipals: Maybe<Stakingv02StakingPoolPrincipalsConnection>
  /** Reads and enables pagination through a set of `StreamMarketDatum`. */
  allStreamMarketData: Maybe<StreamMarketDataConnection>
  /** Reads and enables pagination through a set of `Vrfv2PlusActiveConsumer`. */
  allVrfv2PlusActiveConsumers: Maybe<Vrfv2PlusActiveConsumersConnection>
  /** Reads and enables pagination through a set of `Vrfv2PlusEventHistory`. */
  allVrfv2PlusEventHistories: Maybe<Vrfv2PlusEventHistoriesConnection>
  /** Reads and enables pagination through a set of `Vrfv2PlusFulfillmentHistory`. */
  allVrfv2PlusFulfillmentHistories: Maybe<Vrfv2PlusFulfillmentHistoriesConnection>
  /** Reads and enables pagination through a set of `Vrfv2PlusPendingRequest`. */
  allVrfv2PlusPendingRequests: Maybe<Vrfv2PlusPendingRequestsConnection>
  /** Reads and enables pagination through a set of `Vrfv2PlusSubscriptionDetail`. */
  allVrfv2PlusSubscriptionDetails: Maybe<Vrfv2PlusSubscriptionDetailsConnection>
  /** Reads and enables pagination through a set of `Vrfv2RandomWordsRequest`. */
  allVrfv2RandomWordsRequests: Maybe<Vrfv2RandomWordsRequestsConnection>
  /** Reads and enables pagination through a set of `Vrfv2SubscriptionConsumer`. */
  allVrfv2SubscriptionConsumers: Maybe<Vrfv2SubscriptionConsumersConnection>
  /** Reads and enables pagination through a set of `Vrfv2SubscriptionEvent`. */
  allVrfv2SubscriptionEvents: Maybe<Vrfv2SubscriptionEventsConnection>
  /** Reads and enables pagination through a set of `Vrfv2Subscription`. */
  allVrfv2Subscriptions: Maybe<Vrfv2SubscriptionsConnection>
  chainData: Maybe<ChainDataConnection>
  consoleInstanceRequestCounts: Maybe<ConsoleInstanceRequestCountsConnection>
  consoleServiceRequestCounts: Maybe<ConsoleServiceRequestCountsConnection>
  latestAnswers: Maybe<LatestAnswersConnection>
  /** Fetches an object given its globally unique `ID`. */
  node: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars["ID"]["output"]
  priceHistoryWithTimestamp: Maybe<PriceHistoryWithTimestampConnection>
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationContractsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationContractCondition>
  filter: InputMaybe<AutomationContractFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationContractsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationPerformEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationPerformEventCondition>
  filter: InputMaybe<AutomationPerformEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationPerformEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationRegistrationsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationRegistrationCondition>
  filter: InputMaybe<AutomationRegistrationFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationRegistrationsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationStageContractsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationStageContractCondition>
  filter: InputMaybe<AutomationStageContractFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationStageContractsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationStagePerformEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationStagePerformEventCondition>
  filter: InputMaybe<AutomationStagePerformEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationStagePerformEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationStageRegistrationsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationStageRegistrationCondition>
  filter: InputMaybe<AutomationStageRegistrationFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationStageRegistrationsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationStageUpkeepEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationStageUpkeepEventCondition>
  filter: InputMaybe<AutomationStageUpkeepEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationStageUpkeepEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationStageUpkeepsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationStageUpkeepCondition>
  filter: InputMaybe<AutomationStageUpkeepFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationStageUpkeepsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationUpkeepEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationUpkeepEventCondition>
  filter: InputMaybe<AutomationUpkeepEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationUpkeepEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllAutomationUpkeepsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<AutomationUpkeepCondition>
  filter: InputMaybe<AutomationUpkeepFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<AutomationUpkeepsOrderBy>>
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
export type QueryAllConsoleContractsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<ConsoleContractCondition>
  filter: InputMaybe<ConsoleContractFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<ConsoleContractsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllConsoleInstancesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<ConsoleInstanceCondition>
  filter: InputMaybe<ConsoleInstanceFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<ConsoleInstancesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllConsoleRequestsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<ConsoleRequestCondition>
  filter: InputMaybe<ConsoleRequestFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<ConsoleRequestsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllFunctionsv1DonIdsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Functionsv1DonIdCondition>
  filter: InputMaybe<Functionsv1DonIdFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Functionsv1DonIdsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllFunctionsv1EventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Functionsv1EventCondition>
  filter: InputMaybe<Functionsv1EventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Functionsv1EventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllFunctionsv1RequestsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Functionsv1RequestCondition>
  filter: InputMaybe<Functionsv1RequestFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Functionsv1RequestsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllFunctionsv1SubscriptionsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Functionsv1SubscriptionCondition>
  filter: InputMaybe<Functionsv1SubscriptionFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Functionsv1SubscriptionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllFunctionsv1SubscriptionsConsumersArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Functionsv1SubscriptionsConsumerCondition>
  filter: InputMaybe<Functionsv1SubscriptionsConsumerFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Functionsv1SubscriptionsConsumersOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersNewUpkeepBalancesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersNewUpkeepBalanceCondition>
  filter: InputMaybe<KeepersNewUpkeepBalanceFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersNewUpkeepBalancesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersNewUpkeepMigrationBalancesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersNewUpkeepMigrationBalanceCondition>
  filter: InputMaybe<KeepersNewUpkeepMigrationBalanceFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersNewUpkeepMigrationBalancesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersNewUpkeepMigrationsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersNewUpkeepMigrationCondition>
  filter: InputMaybe<KeepersNewUpkeepMigrationFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersNewUpkeepMigrationsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersNewUpkeepRegistrationsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersNewUpkeepRegistrationCondition>
  filter: InputMaybe<KeepersNewUpkeepRegistrationFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersNewUpkeepRegistrationsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersNewUpkeepsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersNewUpkeepCondition>
  filter: InputMaybe<KeepersNewUpkeepFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersNewUpkeepsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersPerformUpkeepsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersPerformUpkeepCondition>
  filter: InputMaybe<KeepersPerformUpkeepFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersPerformUpkeepsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersRegistrationRequestsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersRegistrationRequestCondition>
  filter: InputMaybe<KeepersRegistrationRequestFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersRegistrationRequestsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersUpkeepEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersUpkeepEventCondition>
  filter: InputMaybe<KeepersUpkeepEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersUpkeepEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllKeepersUpkeepsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<KeepersUpkeepCondition>
  filter: InputMaybe<KeepersUpkeepFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<KeepersUpkeepsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllOcrFeedsChainDataArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<OcrFeedsChainDatumCondition>
  filter: InputMaybe<OcrFeedsChainDatumFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<OcrFeedsChainDataOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllOcrFeedsConfigsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<OcrFeedsConfigCondition>
  filter: InputMaybe<OcrFeedsConfigFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<OcrFeedsConfigsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllOcrFeedsLatestAnswersArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<OcrFeedsLatestAnswerCondition>
  filter: InputMaybe<OcrFeedsLatestAnswerFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<OcrFeedsLatestAnswersOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingAlertsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingAlertCondition>
  filter: InputMaybe<StakingAlertFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingAlertsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingFeedsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingFeedCondition>
  filter: InputMaybe<StakingFeedFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingFeedsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingMaxSizesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingMaxSizeCondition>
  filter: InputMaybe<StakingMaxSizeFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingMaxSizesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingNodeOperatorsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingNodeOperatorCondition>
  filter: InputMaybe<StakingNodeOperatorFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingNodeOperatorsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingPoolsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingPoolCondition>
  filter: InputMaybe<StakingPoolFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingPoolsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingTotalAmountsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StakingTotalAmountCondition>
  filter: InputMaybe<StakingTotalAmountFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StakingTotalAmountsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingv02RewardVaultEmissionRatesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Stakingv02RewardVaultEmissionRateCondition>
  filter: InputMaybe<Stakingv02RewardVaultEmissionRateFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Stakingv02RewardVaultEmissionRatesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStakingv02StakingPoolPrincipalsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Stakingv02StakingPoolPrincipalCondition>
  filter: InputMaybe<Stakingv02StakingPoolPrincipalFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Stakingv02StakingPoolPrincipalsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllStreamMarketDataArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<StreamMarketDatumCondition>
  filter: InputMaybe<StreamMarketDatumFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<StreamMarketDataOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2PlusActiveConsumersArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2PlusActiveConsumerCondition>
  filter: InputMaybe<Vrfv2PlusActiveConsumerFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2PlusActiveConsumersOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2PlusEventHistoriesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2PlusEventHistoryCondition>
  filter: InputMaybe<Vrfv2PlusEventHistoryFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2PlusEventHistoriesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2PlusFulfillmentHistoriesArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2PlusFulfillmentHistoryCondition>
  filter: InputMaybe<Vrfv2PlusFulfillmentHistoryFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2PlusFulfillmentHistoriesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2PlusPendingRequestsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2PlusPendingRequestCondition>
  filter: InputMaybe<Vrfv2PlusPendingRequestFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2PlusPendingRequestsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2PlusSubscriptionDetailsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2PlusSubscriptionDetailCondition>
  filter: InputMaybe<Vrfv2PlusSubscriptionDetailFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2PlusSubscriptionDetailsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2RandomWordsRequestsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2RandomWordsRequestCondition>
  filter: InputMaybe<Vrfv2RandomWordsRequestFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2RandomWordsRequestsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2SubscriptionConsumersArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2SubscriptionConsumerCondition>
  filter: InputMaybe<Vrfv2SubscriptionConsumerFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2SubscriptionConsumersOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2SubscriptionEventsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2SubscriptionEventCondition>
  filter: InputMaybe<Vrfv2SubscriptionEventFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2SubscriptionEventsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryAllVrfv2SubscriptionsArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  condition: InputMaybe<Vrfv2SubscriptionCondition>
  filter: InputMaybe<Vrfv2SubscriptionFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<Vrfv2SubscriptionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryChainDataArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  schemaName: InputMaybe<Scalars["String"]["input"]>
}

/** The root query type which gives access points into the data universe. */
export type QueryConsoleInstanceRequestCountsArgs = {
  _admin: InputMaybe<Scalars["String"]["input"]>
  _networks: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  _service: InputMaybe<Scalars["String"]["input"]>
  _status: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
}

/** The root query type which gives access points into the data universe. */
export type QueryConsoleServiceRequestCountsArgs = {
  _admin: InputMaybe<Scalars["String"]["input"]>
  _days: InputMaybe<Scalars["Int"]["input"]>
  _networks: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  _service: InputMaybe<Scalars["String"]["input"]>
  _status: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  filter: InputMaybe<ConsoleServiceRequestCountsRecordFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
}

/** The root query type which gives access points into the data universe. */
export type QueryLatestAnswersArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  contractAddresses: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>
  filter: InputMaybe<LatestAnswersRecordFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  schemaName: InputMaybe<Scalars["String"]["input"]>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars["ID"]["input"]
}

/** The root query type which gives access points into the data universe. */
export type QueryPriceHistoryWithTimestampArgs = {
  after: InputMaybe<Scalars["Cursor"]["input"]>
  before: InputMaybe<Scalars["Cursor"]["input"]>
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  filter: InputMaybe<PriceHistoryWithTimestampRecordFilter>
  first: InputMaybe<Scalars["Int"]["input"]>
  last: InputMaybe<Scalars["Int"]["input"]>
  offset: InputMaybe<Scalars["Int"]["input"]>
  schemaName: InputMaybe<Scalars["String"]["input"]>
}

export type StakingAlert = {
  __typename?: "StakingAlert"
  feedAddress: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  poolAddress: Maybe<Scalars["String"]["output"]>
  totalAlerts: Maybe<Scalars["BigInt"]["output"]>
  totalRewards: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `StakingAlert` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type StakingAlertCondition = {
  /** Checks for equality with the object’s `feedAddress` field. */
  feedAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalAlerts` field. */
  totalAlerts: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `totalRewards` field. */
  totalRewards: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `StakingAlert` object types. All fields are combined with a logical ‘and.’ */
export type StakingAlertFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingAlertFilter>>
  /** Filter by the object’s `feedAddress` field. */
  feedAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingAlertFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingAlertFilter>>
  /** Filter by the object’s `poolAddress` field. */
  poolAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `StakingAlert` values. */
export type StakingAlertsConnection = {
  __typename?: "StakingAlertsConnection"
  /** A list of edges which contains the `StakingAlert` and cursor to aid in pagination. */
  edges: Array<StakingAlertsEdge>
  /** A list of `StakingAlert` objects. */
  nodes: Array<StakingAlert>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingAlert` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingAlert` edge in the connection. */
export type StakingAlertsEdge = {
  __typename?: "StakingAlertsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingAlert` at the end of the edge. */
  node: StakingAlert
}

/** Methods to use when ordering `StakingAlert`. */
export enum StakingAlertsOrderBy {
  FeedAddressAsc = "FEED_ADDRESS_ASC",
  FeedAddressDesc = "FEED_ADDRESS_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PoolAddressAsc = "POOL_ADDRESS_ASC",
  PoolAddressDesc = "POOL_ADDRESS_DESC",
  TotalAlertsAsc = "TOTAL_ALERTS_ASC",
  TotalAlertsDesc = "TOTAL_ALERTS_DESC",
  TotalRewardsAsc = "TOTAL_REWARDS_ASC",
  TotalRewardsDesc = "TOTAL_REWARDS_DESC",
}

export type StakingFeed = {
  __typename?: "StakingFeed"
  alertCount: Maybe<Scalars["Int"]["output"]>
  answer: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  feedAddress: Maybe<Scalars["String"]["output"]>
  minimumResponses: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  observerCount: Maybe<Scalars["Int"]["output"]>
  poolAddress: Maybe<Scalars["String"]["output"]>
  responseCount: Maybe<Scalars["Int"]["output"]>
  roundId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `StakingFeed` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type StakingFeedCondition = {
  /** Checks for equality with the object’s `alertCount` field. */
  alertCount: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `answer` field. */
  answer: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `feedAddress` field. */
  feedAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `minimumResponses` field. */
  minimumResponses: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `observerCount` field. */
  observerCount: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `responseCount` field. */
  responseCount: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `roundId` field. */
  roundId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `StakingFeed` object types. All fields are combined with a logical ‘and.’ */
export type StakingFeedFilter = {
  /** Filter by the object’s `alertCount` field. */
  alertCount: InputMaybe<IntFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingFeedFilter>>
  /** Filter by the object’s `feedAddress` field. */
  feedAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `minimumResponses` field. */
  minimumResponses: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingFeedFilter>
  /** Filter by the object’s `observerCount` field. */
  observerCount: InputMaybe<IntFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingFeedFilter>>
  /** Filter by the object’s `poolAddress` field. */
  poolAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `responseCount` field. */
  responseCount: InputMaybe<IntFilter>
}

/** A connection to a list of `StakingFeed` values. */
export type StakingFeedsConnection = {
  __typename?: "StakingFeedsConnection"
  /** A list of edges which contains the `StakingFeed` and cursor to aid in pagination. */
  edges: Array<StakingFeedsEdge>
  /** A list of `StakingFeed` objects. */
  nodes: Array<StakingFeed>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingFeed` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingFeed` edge in the connection. */
export type StakingFeedsEdge = {
  __typename?: "StakingFeedsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingFeed` at the end of the edge. */
  node: StakingFeed
}

/** Methods to use when ordering `StakingFeed`. */
export enum StakingFeedsOrderBy {
  AlertCountAsc = "ALERT_COUNT_ASC",
  AlertCountDesc = "ALERT_COUNT_DESC",
  AnswerAsc = "ANSWER_ASC",
  AnswerDesc = "ANSWER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  FeedAddressAsc = "FEED_ADDRESS_ASC",
  FeedAddressDesc = "FEED_ADDRESS_DESC",
  MinimumResponsesAsc = "MINIMUM_RESPONSES_ASC",
  MinimumResponsesDesc = "MINIMUM_RESPONSES_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  ObserverCountAsc = "OBSERVER_COUNT_ASC",
  ObserverCountDesc = "OBSERVER_COUNT_DESC",
  PoolAddressAsc = "POOL_ADDRESS_ASC",
  PoolAddressDesc = "POOL_ADDRESS_DESC",
  ResponseCountAsc = "RESPONSE_COUNT_ASC",
  ResponseCountDesc = "RESPONSE_COUNT_DESC",
  RoundIdAsc = "ROUND_ID_ASC",
  RoundIdDesc = "ROUND_ID_DESC",
}

export type StakingMaxSize = {
  __typename?: "StakingMaxSize"
  communityPoolSize: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  nopPoolSize: Maybe<Scalars["BigFloat"]["output"]>
  poolAddress: Maybe<Scalars["String"]["output"]>
  poolSize: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `StakingMaxSize` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type StakingMaxSizeCondition = {
  /** Checks for equality with the object’s `communityPoolSize` field. */
  communityPoolSize: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `nopPoolSize` field. */
  nopPoolSize: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `poolSize` field. */
  poolSize: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `StakingMaxSize` object types. All fields are combined with a logical ‘and.’ */
export type StakingMaxSizeFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingMaxSizeFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingMaxSizeFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingMaxSizeFilter>>
  /** Filter by the object’s `poolAddress` field. */
  poolAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `StakingMaxSize` values. */
export type StakingMaxSizesConnection = {
  __typename?: "StakingMaxSizesConnection"
  /** A list of edges which contains the `StakingMaxSize` and cursor to aid in pagination. */
  edges: Array<StakingMaxSizesEdge>
  /** A list of `StakingMaxSize` objects. */
  nodes: Array<StakingMaxSize>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingMaxSize` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingMaxSize` edge in the connection. */
export type StakingMaxSizesEdge = {
  __typename?: "StakingMaxSizesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingMaxSize` at the end of the edge. */
  node: StakingMaxSize
}

/** Methods to use when ordering `StakingMaxSize`. */
export enum StakingMaxSizesOrderBy {
  CommunityPoolSizeAsc = "COMMUNITY_POOL_SIZE_ASC",
  CommunityPoolSizeDesc = "COMMUNITY_POOL_SIZE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  NopPoolSizeAsc = "NOP_POOL_SIZE_ASC",
  NopPoolSizeDesc = "NOP_POOL_SIZE_DESC",
  PoolAddressAsc = "POOL_ADDRESS_ASC",
  PoolAddressDesc = "POOL_ADDRESS_DESC",
  PoolSizeAsc = "POOL_SIZE_ASC",
  PoolSizeDesc = "POOL_SIZE_DESC",
}

export type StakingNodeOperator = {
  __typename?: "StakingNodeOperator"
  answer: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  operatorAddress: Maybe<Scalars["String"]["output"]>
  roundId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `StakingNodeOperator` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type StakingNodeOperatorCondition = {
  /** Checks for equality with the object’s `answer` field. */
  answer: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `operatorAddress` field. */
  operatorAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `roundId` field. */
  roundId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `StakingNodeOperator` object types. All fields are combined with a logical ‘and.’ */
export type StakingNodeOperatorFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingNodeOperatorFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingNodeOperatorFilter>
  /** Filter by the object’s `operatorAddress` field. */
  operatorAddress: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingNodeOperatorFilter>>
}

/** A connection to a list of `StakingNodeOperator` values. */
export type StakingNodeOperatorsConnection = {
  __typename?: "StakingNodeOperatorsConnection"
  /** A list of edges which contains the `StakingNodeOperator` and cursor to aid in pagination. */
  edges: Array<StakingNodeOperatorsEdge>
  /** A list of `StakingNodeOperator` objects. */
  nodes: Array<StakingNodeOperator>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingNodeOperator` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingNodeOperator` edge in the connection. */
export type StakingNodeOperatorsEdge = {
  __typename?: "StakingNodeOperatorsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingNodeOperator` at the end of the edge. */
  node: StakingNodeOperator
}

/** Methods to use when ordering `StakingNodeOperator`. */
export enum StakingNodeOperatorsOrderBy {
  AnswerAsc = "ANSWER_ASC",
  AnswerDesc = "ANSWER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OperatorAddressAsc = "OPERATOR_ADDRESS_ASC",
  OperatorAddressDesc = "OPERATOR_ADDRESS_DESC",
  RoundIdAsc = "ROUND_ID_ASC",
  RoundIdDesc = "ROUND_ID_DESC",
}

export type StakingPool = {
  __typename?: "StakingPool"
  baseReward: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  feedAddress: Maybe<Scalars["String"]["output"]>
  maxAmount: Maybe<Scalars["BigFloat"]["output"]>
  maxCommunityStakeAmount: Maybe<Scalars["BigFloat"]["output"]>
  maxNopStakeAmount: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `StakingPool` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type StakingPoolCondition = {
  /** Checks for equality with the object’s `baseReward` field. */
  baseReward: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `feedAddress` field. */
  feedAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `maxAmount` field. */
  maxAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `maxCommunityStakeAmount` field. */
  maxCommunityStakeAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `maxNopStakeAmount` field. */
  maxNopStakeAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `StakingPool` object types. All fields are combined with a logical ‘and.’ */
export type StakingPoolFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingPoolFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `feedAddress` field. */
  feedAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingPoolFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingPoolFilter>>
}

/** A connection to a list of `StakingPool` values. */
export type StakingPoolsConnection = {
  __typename?: "StakingPoolsConnection"
  /** A list of edges which contains the `StakingPool` and cursor to aid in pagination. */
  edges: Array<StakingPoolsEdge>
  /** A list of `StakingPool` objects. */
  nodes: Array<StakingPool>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingPool` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingPool` edge in the connection. */
export type StakingPoolsEdge = {
  __typename?: "StakingPoolsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingPool` at the end of the edge. */
  node: StakingPool
}

/** Methods to use when ordering `StakingPool`. */
export enum StakingPoolsOrderBy {
  BaseRewardAsc = "BASE_REWARD_ASC",
  BaseRewardDesc = "BASE_REWARD_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  FeedAddressAsc = "FEED_ADDRESS_ASC",
  FeedAddressDesc = "FEED_ADDRESS_DESC",
  MaxAmountAsc = "MAX_AMOUNT_ASC",
  MaxAmountDesc = "MAX_AMOUNT_DESC",
  MaxCommunityStakeAmountAsc = "MAX_COMMUNITY_STAKE_AMOUNT_ASC",
  MaxCommunityStakeAmountDesc = "MAX_COMMUNITY_STAKE_AMOUNT_DESC",
  MaxNopStakeAmountAsc = "MAX_NOP_STAKE_AMOUNT_ASC",
  MaxNopStakeAmountDesc = "MAX_NOP_STAKE_AMOUNT_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
}

export type StakingTotalAmount = {
  __typename?: "StakingTotalAmount"
  network: Maybe<Scalars["String"]["output"]>
  poolAddress: Maybe<Scalars["String"]["output"]>
  totalCommunityStakedAmount: Maybe<Scalars["BigFloat"]["output"]>
  totalNopStakedAmount: Maybe<Scalars["BigFloat"]["output"]>
  totalStakedAmount: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `StakingTotalAmount` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type StakingTotalAmountCondition = {
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalCommunityStakedAmount` field. */
  totalCommunityStakedAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `totalNopStakedAmount` field. */
  totalNopStakedAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `totalStakedAmount` field. */
  totalStakedAmount: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `StakingTotalAmount` object types. All fields are combined with a logical ‘and.’ */
export type StakingTotalAmountFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StakingTotalAmountFilter>>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StakingTotalAmountFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StakingTotalAmountFilter>>
  /** Filter by the object’s `poolAddress` field. */
  poolAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `StakingTotalAmount` values. */
export type StakingTotalAmountsConnection = {
  __typename?: "StakingTotalAmountsConnection"
  /** A list of edges which contains the `StakingTotalAmount` and cursor to aid in pagination. */
  edges: Array<StakingTotalAmountsEdge>
  /** A list of `StakingTotalAmount` objects. */
  nodes: Array<StakingTotalAmount>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StakingTotalAmount` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StakingTotalAmount` edge in the connection. */
export type StakingTotalAmountsEdge = {
  __typename?: "StakingTotalAmountsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StakingTotalAmount` at the end of the edge. */
  node: StakingTotalAmount
}

/** Methods to use when ordering `StakingTotalAmount`. */
export enum StakingTotalAmountsOrderBy {
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PoolAddressAsc = "POOL_ADDRESS_ASC",
  PoolAddressDesc = "POOL_ADDRESS_DESC",
  TotalCommunityStakedAmountAsc = "TOTAL_COMMUNITY_STAKED_AMOUNT_ASC",
  TotalCommunityStakedAmountDesc = "TOTAL_COMMUNITY_STAKED_AMOUNT_DESC",
  TotalNopStakedAmountAsc = "TOTAL_NOP_STAKED_AMOUNT_ASC",
  TotalNopStakedAmountDesc = "TOTAL_NOP_STAKED_AMOUNT_DESC",
  TotalStakedAmountAsc = "TOTAL_STAKED_AMOUNT_ASC",
  TotalStakedAmountDesc = "TOTAL_STAKED_AMOUNT_DESC",
}

export type Stakingv02RewardVaultEmissionRate = {
  __typename?: "Stakingv02RewardVaultEmissionRate"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  emissionRate: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  pool: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `Stakingv02RewardVaultEmissionRate` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type Stakingv02RewardVaultEmissionRateCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `emissionRate` field. */
  emissionRate: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pool` field. */
  pool: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `Stakingv02RewardVaultEmissionRate` object types. All fields are combined with a logical ‘and.’ */
export type Stakingv02RewardVaultEmissionRateFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Stakingv02RewardVaultEmissionRateFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Stakingv02RewardVaultEmissionRateFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Stakingv02RewardVaultEmissionRateFilter>>
  /** Filter by the object’s `pool` field. */
  pool: InputMaybe<StringFilter>
}

/** A connection to a list of `Stakingv02RewardVaultEmissionRate` values. */
export type Stakingv02RewardVaultEmissionRatesConnection = {
  __typename?: "Stakingv02RewardVaultEmissionRatesConnection"
  /** A list of edges which contains the `Stakingv02RewardVaultEmissionRate` and cursor to aid in pagination. */
  edges: Array<Stakingv02RewardVaultEmissionRatesEdge>
  /** A list of `Stakingv02RewardVaultEmissionRate` objects. */
  nodes: Array<Stakingv02RewardVaultEmissionRate>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Stakingv02RewardVaultEmissionRate` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Stakingv02RewardVaultEmissionRate` edge in the connection. */
export type Stakingv02RewardVaultEmissionRatesEdge = {
  __typename?: "Stakingv02RewardVaultEmissionRatesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Stakingv02RewardVaultEmissionRate` at the end of the edge. */
  node: Stakingv02RewardVaultEmissionRate
}

/** Methods to use when ordering `Stakingv02RewardVaultEmissionRate`. */
export enum Stakingv02RewardVaultEmissionRatesOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  EmissionRateAsc = "EMISSION_RATE_ASC",
  EmissionRateDesc = "EMISSION_RATE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PoolAsc = "POOL_ASC",
  PoolDesc = "POOL_DESC",
}

export type Stakingv02StakingPoolPrincipal = {
  __typename?: "Stakingv02StakingPoolPrincipal"
  contractAddress: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  totalPrincipal: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `Stakingv02StakingPoolPrincipal` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type Stakingv02StakingPoolPrincipalCondition = {
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalPrincipal` field. */
  totalPrincipal: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `Stakingv02StakingPoolPrincipal` object types. All fields are combined with a logical ‘and.’ */
export type Stakingv02StakingPoolPrincipalFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Stakingv02StakingPoolPrincipalFilter>>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Stakingv02StakingPoolPrincipalFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Stakingv02StakingPoolPrincipalFilter>>
}

/** A connection to a list of `Stakingv02StakingPoolPrincipal` values. */
export type Stakingv02StakingPoolPrincipalsConnection = {
  __typename?: "Stakingv02StakingPoolPrincipalsConnection"
  /** A list of edges which contains the `Stakingv02StakingPoolPrincipal` and cursor to aid in pagination. */
  edges: Array<Stakingv02StakingPoolPrincipalsEdge>
  /** A list of `Stakingv02StakingPoolPrincipal` objects. */
  nodes: Array<Stakingv02StakingPoolPrincipal>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Stakingv02StakingPoolPrincipal` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Stakingv02StakingPoolPrincipal` edge in the connection. */
export type Stakingv02StakingPoolPrincipalsEdge = {
  __typename?: "Stakingv02StakingPoolPrincipalsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Stakingv02StakingPoolPrincipal` at the end of the edge. */
  node: Stakingv02StakingPoolPrincipal
}

/** Methods to use when ordering `Stakingv02StakingPoolPrincipal`. */
export enum Stakingv02StakingPoolPrincipalsOrderBy {
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  TotalPrincipalAsc = "TOTAL_PRINCIPAL_ASC",
  TotalPrincipalDesc = "TOTAL_PRINCIPAL_DESC",
}

/** A connection to a list of `StreamMarketDatum` values. */
export type StreamMarketDataConnection = {
  __typename?: "StreamMarketDataConnection"
  /** A list of edges which contains the `StreamMarketDatum` and cursor to aid in pagination. */
  edges: Array<StreamMarketDataEdge>
  /** A list of `StreamMarketDatum` objects. */
  nodes: Array<StreamMarketDatum>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `StreamMarketDatum` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `StreamMarketDatum` edge in the connection. */
export type StreamMarketDataEdge = {
  __typename?: "StreamMarketDataEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `StreamMarketDatum` at the end of the edge. */
  node: StreamMarketDatum
}

/** Methods to use when ordering `StreamMarketDatum`. */
export enum StreamMarketDataOrderBy {
  AssetAsc = "ASSET_ASC",
  AssetDesc = "ASSET_DESC",
  CirculatingSupplyAsc = "CIRCULATING_SUPPLY_ASC",
  CirculatingSupplyDesc = "CIRCULATING_SUPPLY_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  DataProviderNameAsc = "DATA_PROVIDER_NAME_ASC",
  DataProviderNameDesc = "DATA_PROVIDER_NAME_DESC",
  ImageAsc = "IMAGE_ASC",
  ImageDesc = "IMAGE_DESC",
  LastUpdatedAsc = "LAST_UPDATED_ASC",
  LastUpdatedDesc = "LAST_UPDATED_DESC",
  MarketCapAsc = "MARKET_CAP_ASC",
  MarketCapChangePercentage_24HAsc = "MARKET_CAP_CHANGE_PERCENTAGE_24H_ASC",
  MarketCapChangePercentage_24HDesc = "MARKET_CAP_CHANGE_PERCENTAGE_24H_DESC",
  MarketCapDesc = "MARKET_CAP_DESC",
  Natural = "NATURAL",
  PriceChangePercentage_24HAsc = "PRICE_CHANGE_PERCENTAGE_24H_ASC",
  PriceChangePercentage_24HDesc = "PRICE_CHANGE_PERCENTAGE_24H_DESC",
  QuoteAsc = "QUOTE_ASC",
  QuoteDesc = "QUOTE_DESC",
  TotalSupplyAsc = "TOTAL_SUPPLY_ASC",
  TotalSupplyDesc = "TOTAL_SUPPLY_DESC",
  TotalVolumeAsc = "TOTAL_VOLUME_ASC",
  TotalVolumeDesc = "TOTAL_VOLUME_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type StreamMarketDatum = {
  __typename?: "StreamMarketDatum"
  asset: Maybe<Scalars["String"]["output"]>
  circulatingSupply: Maybe<Scalars["BigFloat"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  dataProviderName: Maybe<Scalars["String"]["output"]>
  image: Maybe<Scalars["String"]["output"]>
  lastUpdated: Maybe<Scalars["Datetime"]["output"]>
  marketCap: Maybe<Scalars["BigFloat"]["output"]>
  marketCapChangePercentage24H: Maybe<Scalars["BigFloat"]["output"]>
  priceChangePercentage24H: Maybe<Scalars["BigFloat"]["output"]>
  quote: Maybe<Scalars["String"]["output"]>
  totalSupply: Maybe<Scalars["BigFloat"]["output"]>
  totalVolume: Maybe<Scalars["BigFloat"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `StreamMarketDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type StreamMarketDatumCondition = {
  /** Checks for equality with the object’s `asset` field. */
  asset: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `circulatingSupply` field. */
  circulatingSupply: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `dataProviderName` field. */
  dataProviderName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `image` field. */
  image: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `lastUpdated` field. */
  lastUpdated: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `marketCap` field. */
  marketCap: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `marketCapChangePercentage24H` field. */
  marketCapChangePercentage24H: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `priceChangePercentage24H` field. */
  priceChangePercentage24H: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `quote` field. */
  quote: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalSupply` field. */
  totalSupply: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `totalVolume` field. */
  totalVolume: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `StreamMarketDatum` object types. All fields are combined with a logical ‘and.’ */
export type StreamMarketDatumFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<StreamMarketDatumFilter>>
  /** Filter by the object’s `asset` field. */
  asset: InputMaybe<StringFilter>
  /** Filter by the object’s `dataProviderName` field. */
  dataProviderName: InputMaybe<StringFilter>
  /** Filter by the object’s `image` field. */
  image: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<StreamMarketDatumFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<StreamMarketDatumFilter>>
  /** Filter by the object’s `quote` field. */
  quote: InputMaybe<StringFilter>
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

export type Vrfv2PlusActiveConsumer = {
  __typename?: "Vrfv2PlusActiveConsumer"
  addedBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  coordinatorContractAddress: Maybe<Scalars["String"]["output"]>
  lastFulfillmentTimestamp: Maybe<Scalars["Datetime"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `Vrfv2PlusActiveConsumer` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2PlusActiveConsumerCondition = {
  /** Checks for equality with the object’s `addedBlockTimestamp` field. */
  addedBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `lastFulfillmentTimestamp` field. */
  lastFulfillmentTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `Vrfv2PlusActiveConsumer` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2PlusActiveConsumerFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2PlusActiveConsumerFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2PlusActiveConsumerFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2PlusActiveConsumerFilter>>
}

/** A connection to a list of `Vrfv2PlusActiveConsumer` values. */
export type Vrfv2PlusActiveConsumersConnection = {
  __typename?: "Vrfv2PlusActiveConsumersConnection"
  /** A list of edges which contains the `Vrfv2PlusActiveConsumer` and cursor to aid in pagination. */
  edges: Array<Vrfv2PlusActiveConsumersEdge>
  /** A list of `Vrfv2PlusActiveConsumer` objects. */
  nodes: Array<Vrfv2PlusActiveConsumer>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2PlusActiveConsumer` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2PlusActiveConsumer` edge in the connection. */
export type Vrfv2PlusActiveConsumersEdge = {
  __typename?: "Vrfv2PlusActiveConsumersEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2PlusActiveConsumer` at the end of the edge. */
  node: Vrfv2PlusActiveConsumer
}

/** Methods to use when ordering `Vrfv2PlusActiveConsumer`. */
export enum Vrfv2PlusActiveConsumersOrderBy {
  AddedBlockTimestampAsc = "ADDED_BLOCK_TIMESTAMP_ASC",
  AddedBlockTimestampDesc = "ADDED_BLOCK_TIMESTAMP_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  CoordinatorContractAddressAsc = "COORDINATOR_CONTRACT_ADDRESS_ASC",
  CoordinatorContractAddressDesc = "COORDINATOR_CONTRACT_ADDRESS_DESC",
  LastFulfillmentTimestampAsc = "LAST_FULFILLMENT_TIMESTAMP_ASC",
  LastFulfillmentTimestampDesc = "LAST_FULFILLMENT_TIMESTAMP_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
}

/** A connection to a list of `Vrfv2PlusEventHistory` values. */
export type Vrfv2PlusEventHistoriesConnection = {
  __typename?: "Vrfv2PlusEventHistoriesConnection"
  /** A list of edges which contains the `Vrfv2PlusEventHistory` and cursor to aid in pagination. */
  edges: Array<Vrfv2PlusEventHistoriesEdge>
  /** A list of `Vrfv2PlusEventHistory` objects. */
  nodes: Array<Vrfv2PlusEventHistory>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2PlusEventHistory` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2PlusEventHistory` edge in the connection. */
export type Vrfv2PlusEventHistoriesEdge = {
  __typename?: "Vrfv2PlusEventHistoriesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2PlusEventHistory` at the end of the edge. */
  node: Vrfv2PlusEventHistory
}

/** Methods to use when ordering `Vrfv2PlusEventHistory`. */
export enum Vrfv2PlusEventHistoriesOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CoordinatorContractAddressAsc = "COORDINATOR_CONTRACT_ADDRESS_ASC",
  CoordinatorContractAddressDesc = "COORDINATOR_CONTRACT_ADDRESS_DESC",
  EventArgsAsc = "EVENT_ARGS_ASC",
  EventArgsDesc = "EVENT_ARGS_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  FromAddressAsc = "FROM_ADDRESS_ASC",
  FromAddressDesc = "FROM_ADDRESS_DESC",
  FundingTypeAsc = "FUNDING_TYPE_ASC",
  FundingTypeDesc = "FUNDING_TYPE_DESC",
  LinkAmountAsc = "LINK_AMOUNT_ASC",
  LinkAmountDesc = "LINK_AMOUNT_DESC",
  NativeAmountAsc = "NATIVE_AMOUNT_ASC",
  NativeAmountDesc = "NATIVE_AMOUNT_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  NewBalanceAsc = "NEW_BALANCE_ASC",
  NewBalanceDesc = "NEW_BALANCE_DESC",
  OldBalanceAsc = "OLD_BALANCE_ASC",
  OldBalanceDesc = "OLD_BALANCE_DESC",
  OwnerAddressAsc = "OWNER_ADDRESS_ASC",
  OwnerAddressDesc = "OWNER_ADDRESS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  ToAddressAsc = "TO_ADDRESS_ASC",
  ToAddressDesc = "TO_ADDRESS_DESC",
  TxHashAsc = "TX_HASH_ASC",
  TxHashDesc = "TX_HASH_DESC",
}

export type Vrfv2PlusEventHistory = {
  __typename?: "Vrfv2PlusEventHistory"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  coordinatorContractAddress: Maybe<Scalars["String"]["output"]>
  eventArgs: Maybe<Scalars["JSON"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  fromAddress: Maybe<Scalars["String"]["output"]>
  fundingType: Maybe<Scalars["String"]["output"]>
  linkAmount: Maybe<Scalars["BigFloat"]["output"]>
  nativeAmount: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  newBalance: Maybe<Scalars["BigFloat"]["output"]>
  oldBalance: Maybe<Scalars["BigFloat"]["output"]>
  ownerAddress: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  toAddress: Maybe<Scalars["String"]["output"]>
  txHash: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `Vrfv2PlusEventHistory` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2PlusEventHistoryCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventArgs` field. */
  eventArgs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `fromAddress` field. */
  fromAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `fundingType` field. */
  fundingType: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `linkAmount` field. */
  linkAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `nativeAmount` field. */
  nativeAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `newBalance` field. */
  newBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `oldBalance` field. */
  oldBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `ownerAddress` field. */
  ownerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `toAddress` field. */
  toAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `txHash` field. */
  txHash: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `Vrfv2PlusEventHistory` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2PlusEventHistoryFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2PlusEventHistoryFilter>>
  /** Filter by the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `fromAddress` field. */
  fromAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `fundingType` field. */
  fundingType: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2PlusEventHistoryFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2PlusEventHistoryFilter>>
  /** Filter by the object’s `ownerAddress` field. */
  ownerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `toAddress` field. */
  toAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `txHash` field. */
  txHash: InputMaybe<StringFilter>
}

/** A connection to a list of `Vrfv2PlusFulfillmentHistory` values. */
export type Vrfv2PlusFulfillmentHistoriesConnection = {
  __typename?: "Vrfv2PlusFulfillmentHistoriesConnection"
  /** A list of edges which contains the `Vrfv2PlusFulfillmentHistory` and cursor to aid in pagination. */
  edges: Array<Vrfv2PlusFulfillmentHistoriesEdge>
  /** A list of `Vrfv2PlusFulfillmentHistory` objects. */
  nodes: Array<Vrfv2PlusFulfillmentHistory>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2PlusFulfillmentHistory` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2PlusFulfillmentHistory` edge in the connection. */
export type Vrfv2PlusFulfillmentHistoriesEdge = {
  __typename?: "Vrfv2PlusFulfillmentHistoriesEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2PlusFulfillmentHistory` at the end of the edge. */
  node: Vrfv2PlusFulfillmentHistory
}

/** Methods to use when ordering `Vrfv2PlusFulfillmentHistory`. */
export enum Vrfv2PlusFulfillmentHistoriesOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ConsumerAsc = "CONSUMER_ASC",
  ConsumerDesc = "CONSUMER_DESC",
  CoordinatorContractAddressAsc = "COORDINATOR_CONTRACT_ADDRESS_ASC",
  CoordinatorContractAddressDesc = "COORDINATOR_CONTRACT_ADDRESS_DESC",
  ExtraArgsAsc = "EXTRA_ARGS_ASC",
  ExtraArgsDesc = "EXTRA_ARGS_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  RequestIdAsc = "REQUEST_ID_ASC",
  RequestIdDesc = "REQUEST_ID_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  SuccessAsc = "SUCCESS_ASC",
  SuccessDesc = "SUCCESS_DESC",
  TxHashAsc = "TX_HASH_ASC",
  TxHashDesc = "TX_HASH_DESC",
}

export type Vrfv2PlusFulfillmentHistory = {
  __typename?: "Vrfv2PlusFulfillmentHistory"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  consumer: Maybe<Scalars["String"]["output"]>
  coordinatorContractAddress: Maybe<Scalars["String"]["output"]>
  extraArgs: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  payment: Maybe<Scalars["BigFloat"]["output"]>
  requestId: Maybe<Scalars["BigFloat"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  success: Maybe<Scalars["Boolean"]["output"]>
  txHash: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `Vrfv2PlusFulfillmentHistory` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2PlusFulfillmentHistoryCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumer` field. */
  consumer: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `extraArgs` field. */
  extraArgs: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `payment` field. */
  payment: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `requestId` field. */
  requestId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `success` field. */
  success: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `txHash` field. */
  txHash: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `Vrfv2PlusFulfillmentHistory` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2PlusFulfillmentHistoryFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2PlusFulfillmentHistoryFilter>>
  /** Filter by the object’s `consumer` field. */
  consumer: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `extraArgs` field. */
  extraArgs: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2PlusFulfillmentHistoryFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2PlusFulfillmentHistoryFilter>>
  /** Filter by the object’s `txHash` field. */
  txHash: InputMaybe<StringFilter>
}

export type Vrfv2PlusPendingRequest = {
  __typename?: "Vrfv2PlusPendingRequest"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  consumer: Maybe<Scalars["String"]["output"]>
  coordinatorContractAddress: Maybe<Scalars["String"]["output"]>
  extraArgs: Maybe<Scalars["String"]["output"]>
  gasLimit: Maybe<Scalars["BigFloat"]["output"]>
  keyHash: Maybe<Scalars["String"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  requestId: Maybe<Scalars["BigFloat"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  txHash: Maybe<Scalars["String"]["output"]>
}

/**
 * A condition to be used against `Vrfv2PlusPendingRequest` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2PlusPendingRequestCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `consumer` field. */
  consumer: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `extraArgs` field. */
  extraArgs: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `gasLimit` field. */
  gasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `keyHash` field. */
  keyHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `requestId` field. */
  requestId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `txHash` field. */
  txHash: InputMaybe<Scalars["String"]["input"]>
}

/** A filter to be used against `Vrfv2PlusPendingRequest` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2PlusPendingRequestFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2PlusPendingRequestFilter>>
  /** Filter by the object’s `consumer` field. */
  consumer: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `extraArgs` field. */
  extraArgs: InputMaybe<StringFilter>
  /** Filter by the object’s `keyHash` field. */
  keyHash: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2PlusPendingRequestFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2PlusPendingRequestFilter>>
  /** Filter by the object’s `txHash` field. */
  txHash: InputMaybe<StringFilter>
}

/** A connection to a list of `Vrfv2PlusPendingRequest` values. */
export type Vrfv2PlusPendingRequestsConnection = {
  __typename?: "Vrfv2PlusPendingRequestsConnection"
  /** A list of edges which contains the `Vrfv2PlusPendingRequest` and cursor to aid in pagination. */
  edges: Array<Vrfv2PlusPendingRequestsEdge>
  /** A list of `Vrfv2PlusPendingRequest` objects. */
  nodes: Array<Vrfv2PlusPendingRequest>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2PlusPendingRequest` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2PlusPendingRequest` edge in the connection. */
export type Vrfv2PlusPendingRequestsEdge = {
  __typename?: "Vrfv2PlusPendingRequestsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2PlusPendingRequest` at the end of the edge. */
  node: Vrfv2PlusPendingRequest
}

/** Methods to use when ordering `Vrfv2PlusPendingRequest`. */
export enum Vrfv2PlusPendingRequestsOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  ConsumerAsc = "CONSUMER_ASC",
  ConsumerDesc = "CONSUMER_DESC",
  CoordinatorContractAddressAsc = "COORDINATOR_CONTRACT_ADDRESS_ASC",
  CoordinatorContractAddressDesc = "COORDINATOR_CONTRACT_ADDRESS_DESC",
  ExtraArgsAsc = "EXTRA_ARGS_ASC",
  ExtraArgsDesc = "EXTRA_ARGS_DESC",
  GasLimitAsc = "GAS_LIMIT_ASC",
  GasLimitDesc = "GAS_LIMIT_DESC",
  KeyHashAsc = "KEY_HASH_ASC",
  KeyHashDesc = "KEY_HASH_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RequestIdAsc = "REQUEST_ID_ASC",
  RequestIdDesc = "REQUEST_ID_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TxHashAsc = "TX_HASH_ASC",
  TxHashDesc = "TX_HASH_DESC",
}

export type Vrfv2PlusSubscriptionDetail = {
  __typename?: "Vrfv2PlusSubscriptionDetail"
  active: Maybe<Scalars["Boolean"]["output"]>
  activeConsumersCount: Maybe<Scalars["Int"]["output"]>
  coordinatorContractAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  linkBalance: Maybe<Scalars["BigFloat"]["output"]>
  nativeBalance: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  ownerAddress: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["BigFloat"]["output"]>
  totalSuccessfulFulfillments: Maybe<Scalars["BigFloat"]["output"]>
  updatedAt: Maybe<Scalars["Datetime"]["output"]>
}

/**
 * A condition to be used against `Vrfv2PlusSubscriptionDetail` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2PlusSubscriptionDetailCondition = {
  /** Checks for equality with the object’s `active` field. */
  active: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `activeConsumersCount` field. */
  activeConsumersCount: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `linkBalance` field. */
  linkBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `nativeBalance` field. */
  nativeBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `ownerAddress` field. */
  ownerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `totalSuccessfulFulfillments` field. */
  totalSuccessfulFulfillments: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt: InputMaybe<Scalars["Datetime"]["input"]>
}

/** A filter to be used against `Vrfv2PlusSubscriptionDetail` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2PlusSubscriptionDetailFilter = {
  /** Filter by the object’s `activeConsumersCount` field. */
  activeConsumersCount: InputMaybe<IntFilter>
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2PlusSubscriptionDetailFilter>>
  /** Filter by the object’s `coordinatorContractAddress` field. */
  coordinatorContractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2PlusSubscriptionDetailFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2PlusSubscriptionDetailFilter>>
  /** Filter by the object’s `ownerAddress` field. */
  ownerAddress: InputMaybe<StringFilter>
}

/** A connection to a list of `Vrfv2PlusSubscriptionDetail` values. */
export type Vrfv2PlusSubscriptionDetailsConnection = {
  __typename?: "Vrfv2PlusSubscriptionDetailsConnection"
  /** A list of edges which contains the `Vrfv2PlusSubscriptionDetail` and cursor to aid in pagination. */
  edges: Array<Vrfv2PlusSubscriptionDetailsEdge>
  /** A list of `Vrfv2PlusSubscriptionDetail` objects. */
  nodes: Array<Vrfv2PlusSubscriptionDetail>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2PlusSubscriptionDetail` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2PlusSubscriptionDetail` edge in the connection. */
export type Vrfv2PlusSubscriptionDetailsEdge = {
  __typename?: "Vrfv2PlusSubscriptionDetailsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2PlusSubscriptionDetail` at the end of the edge. */
  node: Vrfv2PlusSubscriptionDetail
}

/** Methods to use when ordering `Vrfv2PlusSubscriptionDetail`. */
export enum Vrfv2PlusSubscriptionDetailsOrderBy {
  ActiveAsc = "ACTIVE_ASC",
  ActiveConsumersCountAsc = "ACTIVE_CONSUMERS_COUNT_ASC",
  ActiveConsumersCountDesc = "ACTIVE_CONSUMERS_COUNT_DESC",
  ActiveDesc = "ACTIVE_DESC",
  CoordinatorContractAddressAsc = "COORDINATOR_CONTRACT_ADDRESS_ASC",
  CoordinatorContractAddressDesc = "COORDINATOR_CONTRACT_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  LinkBalanceAsc = "LINK_BALANCE_ASC",
  LinkBalanceDesc = "LINK_BALANCE_DESC",
  NativeBalanceAsc = "NATIVE_BALANCE_ASC",
  NativeBalanceDesc = "NATIVE_BALANCE_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  OwnerAddressAsc = "OWNER_ADDRESS_ASC",
  OwnerAddressDesc = "OWNER_ADDRESS_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TotalSuccessfulFulfillmentsAsc = "TOTAL_SUCCESSFUL_FULFILLMENTS_ASC",
  TotalSuccessfulFulfillmentsDesc = "TOTAL_SUCCESSFUL_FULFILLMENTS_DESC",
  UpdatedAtAsc = "UPDATED_AT_ASC",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

export type Vrfv2RandomWordsRequest = {
  __typename?: "Vrfv2RandomWordsRequest"
  callbackGasLimit: Maybe<Scalars["BigFloat"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  coordinatorAddress: Maybe<Scalars["String"]["output"]>
  fulfilledBlockHash: Maybe<Scalars["String"]["output"]>
  fulfilledBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  fulfilledBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  fulfilledTransactionHash: Maybe<Scalars["String"]["output"]>
  fulfilledTransactionLogIndex: Maybe<Scalars["Int"]["output"]>
  isPending: Maybe<Scalars["Boolean"]["output"]>
  keyHash: Maybe<Scalars["String"]["output"]>
  maxCostLink: Maybe<Scalars["BigFloat"]["output"]>
  minimumRequestConfirmations: Maybe<Scalars["BigFloat"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  networkv2: Maybe<Scalars["String"]["output"]>
  numWords: Maybe<Scalars["BigFloat"]["output"]>
  outputSeed: Maybe<Scalars["String"]["output"]>
  payment: Maybe<Scalars["BigFloat"]["output"]>
  pendingBlockHash: Maybe<Scalars["String"]["output"]>
  pendingBlockNumber: Maybe<Scalars["BigFloat"]["output"]>
  pendingBlockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  pendingTransactionHash: Maybe<Scalars["String"]["output"]>
  pendingTransactionLogIndex: Maybe<Scalars["Int"]["output"]>
  preSeed: Maybe<Scalars["String"]["output"]>
  requestId: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["Int"]["output"]>
  success: Maybe<Scalars["Boolean"]["output"]>
}

/**
 * A condition to be used against `Vrfv2RandomWordsRequest` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2RandomWordsRequestCondition = {
  /** Checks for equality with the object’s `callbackGasLimit` field. */
  callbackGasLimit: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `fulfilledBlockHash` field. */
  fulfilledBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `fulfilledBlockNumber` field. */
  fulfilledBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `fulfilledBlockTimestamp` field. */
  fulfilledBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `fulfilledTransactionHash` field. */
  fulfilledTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `fulfilledTransactionLogIndex` field. */
  fulfilledTransactionLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `isPending` field. */
  isPending: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `keyHash` field. */
  keyHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `maxCostLink` field. */
  maxCostLink: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `minimumRequestConfirmations` field. */
  minimumRequestConfirmations: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `networkv2` field. */
  networkv2: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `numWords` field. */
  numWords: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `outputSeed` field. */
  outputSeed: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `payment` field. */
  payment: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `pendingBlockHash` field. */
  pendingBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingBlockNumber` field. */
  pendingBlockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `pendingBlockTimestamp` field. */
  pendingBlockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `pendingTransactionHash` field. */
  pendingTransactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `pendingTransactionLogIndex` field. */
  pendingTransactionLogIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `preSeed` field. */
  preSeed: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `requestId` field. */
  requestId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `success` field. */
  success: InputMaybe<Scalars["Boolean"]["input"]>
}

/** A filter to be used against `Vrfv2RandomWordsRequest` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2RandomWordsRequestFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2RandomWordsRequestFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `fulfilledBlockHash` field. */
  fulfilledBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `fulfilledTransactionHash` field. */
  fulfilledTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `fulfilledTransactionLogIndex` field. */
  fulfilledTransactionLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `keyHash` field. */
  keyHash: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Filter by the object’s `networkv2` field. */
  networkv2: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2RandomWordsRequestFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2RandomWordsRequestFilter>>
  /** Filter by the object’s `outputSeed` field. */
  outputSeed: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingBlockHash` field. */
  pendingBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingTransactionHash` field. */
  pendingTransactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `pendingTransactionLogIndex` field. */
  pendingTransactionLogIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `preSeed` field. */
  preSeed: InputMaybe<StringFilter>
  /** Filter by the object’s `requestId` field. */
  requestId: InputMaybe<StringFilter>
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<IntFilter>
}

/** A connection to a list of `Vrfv2RandomWordsRequest` values. */
export type Vrfv2RandomWordsRequestsConnection = {
  __typename?: "Vrfv2RandomWordsRequestsConnection"
  /** A list of edges which contains the `Vrfv2RandomWordsRequest` and cursor to aid in pagination. */
  edges: Array<Vrfv2RandomWordsRequestsEdge>
  /** A list of `Vrfv2RandomWordsRequest` objects. */
  nodes: Array<Vrfv2RandomWordsRequest>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2RandomWordsRequest` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2RandomWordsRequest` edge in the connection. */
export type Vrfv2RandomWordsRequestsEdge = {
  __typename?: "Vrfv2RandomWordsRequestsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2RandomWordsRequest` at the end of the edge. */
  node: Vrfv2RandomWordsRequest
}

/** Methods to use when ordering `Vrfv2RandomWordsRequest`. */
export enum Vrfv2RandomWordsRequestsOrderBy {
  CallbackGasLimitAsc = "CALLBACK_GAS_LIMIT_ASC",
  CallbackGasLimitDesc = "CALLBACK_GAS_LIMIT_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  CoordinatorAddressAsc = "COORDINATOR_ADDRESS_ASC",
  CoordinatorAddressDesc = "COORDINATOR_ADDRESS_DESC",
  FulfilledBlockHashAsc = "FULFILLED_BLOCK_HASH_ASC",
  FulfilledBlockHashDesc = "FULFILLED_BLOCK_HASH_DESC",
  FulfilledBlockNumberAsc = "FULFILLED_BLOCK_NUMBER_ASC",
  FulfilledBlockNumberDesc = "FULFILLED_BLOCK_NUMBER_DESC",
  FulfilledBlockTimestampAsc = "FULFILLED_BLOCK_TIMESTAMP_ASC",
  FulfilledBlockTimestampDesc = "FULFILLED_BLOCK_TIMESTAMP_DESC",
  FulfilledTransactionHashAsc = "FULFILLED_TRANSACTION_HASH_ASC",
  FulfilledTransactionHashDesc = "FULFILLED_TRANSACTION_HASH_DESC",
  FulfilledTransactionLogIndexAsc = "FULFILLED_TRANSACTION_LOG_INDEX_ASC",
  FulfilledTransactionLogIndexDesc = "FULFILLED_TRANSACTION_LOG_INDEX_DESC",
  IsPendingAsc = "IS_PENDING_ASC",
  IsPendingDesc = "IS_PENDING_DESC",
  KeyHashAsc = "KEY_HASH_ASC",
  KeyHashDesc = "KEY_HASH_DESC",
  MaxCostLinkAsc = "MAX_COST_LINK_ASC",
  MaxCostLinkDesc = "MAX_COST_LINK_DESC",
  MinimumRequestConfirmationsAsc = "MINIMUM_REQUEST_CONFIRMATIONS_ASC",
  MinimumRequestConfirmationsDesc = "MINIMUM_REQUEST_CONFIRMATIONS_DESC",
  Natural = "NATURAL",
  Networkv2Asc = "NETWORKV2_ASC",
  Networkv2Desc = "NETWORKV2_DESC",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  NumWordsAsc = "NUM_WORDS_ASC",
  NumWordsDesc = "NUM_WORDS_DESC",
  OutputSeedAsc = "OUTPUT_SEED_ASC",
  OutputSeedDesc = "OUTPUT_SEED_DESC",
  PaymentAsc = "PAYMENT_ASC",
  PaymentDesc = "PAYMENT_DESC",
  PendingBlockHashAsc = "PENDING_BLOCK_HASH_ASC",
  PendingBlockHashDesc = "PENDING_BLOCK_HASH_DESC",
  PendingBlockNumberAsc = "PENDING_BLOCK_NUMBER_ASC",
  PendingBlockNumberDesc = "PENDING_BLOCK_NUMBER_DESC",
  PendingBlockTimestampAsc = "PENDING_BLOCK_TIMESTAMP_ASC",
  PendingBlockTimestampDesc = "PENDING_BLOCK_TIMESTAMP_DESC",
  PendingTransactionHashAsc = "PENDING_TRANSACTION_HASH_ASC",
  PendingTransactionHashDesc = "PENDING_TRANSACTION_HASH_DESC",
  PendingTransactionLogIndexAsc = "PENDING_TRANSACTION_LOG_INDEX_ASC",
  PendingTransactionLogIndexDesc = "PENDING_TRANSACTION_LOG_INDEX_DESC",
  PreSeedAsc = "PRE_SEED_ASC",
  PreSeedDesc = "PRE_SEED_DESC",
  RequestIdAsc = "REQUEST_ID_ASC",
  RequestIdDesc = "REQUEST_ID_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  SuccessAsc = "SUCCESS_ASC",
  SuccessDesc = "SUCCESS_DESC",
}

export type Vrfv2Subscription = {
  __typename?: "Vrfv2Subscription"
  activeConsumersCount: Maybe<Scalars["BigInt"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  blockTimestamp: Maybe<Scalars["Datetime"]["output"]>
  canceledAt: Maybe<Scalars["Datetime"]["output"]>
  canceledBlockHash: Maybe<Scalars["String"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  contractAddress: Maybe<Scalars["String"]["output"]>
  coordinatorAddress: Maybe<Scalars["String"]["output"]>
  createdAt: Maybe<Scalars["Datetime"]["output"]>
  currentBalance: Maybe<Scalars["BigFloat"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  id: Maybe<Scalars["BigInt"]["output"]>
  initialSubscriptionOwner: Maybe<Scalars["String"]["output"]>
  inputs: Maybe<Scalars["JSON"]["output"]>
  isActive: Maybe<Scalars["Boolean"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  rawLog: Maybe<Scalars["String"]["output"]>
  refundAmount: Maybe<Scalars["BigFloat"]["output"]>
  removed: Maybe<Scalars["Boolean"]["output"]>
  subscriptionId: Maybe<Scalars["Int"]["output"]>
  subscriptionOwner: Maybe<Scalars["String"]["output"]>
  totalFulfilledRequests: Maybe<Scalars["BigFloat"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `Vrfv2Subscription` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2SubscriptionCondition = {
  /** Checks for equality with the object’s `activeConsumersCount` field. */
  activeConsumersCount: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `blockTimestamp` field. */
  blockTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `canceledAt` field. */
  canceledAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `canceledBlockHash` field. */
  canceledBlockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `contractAddress` field. */
  contractAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `currentBalance` field. */
  currentBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `initialSubscriptionOwner` field. */
  initialSubscriptionOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `inputs` field. */
  inputs: InputMaybe<Scalars["JSON"]["input"]>
  /** Checks for equality with the object’s `isActive` field. */
  isActive: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `rawLog` field. */
  rawLog: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `refundAmount` field. */
  refundAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `removed` field. */
  removed: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `totalFulfilledRequests` field. */
  totalFulfilledRequests: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
}

export type Vrfv2SubscriptionConsumer = {
  __typename?: "Vrfv2SubscriptionConsumer"
  addedAt: Maybe<Scalars["Datetime"]["output"]>
  blockHash: Maybe<Scalars["String"]["output"]>
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  chainId: Maybe<Scalars["BigFloat"]["output"]>
  consumerAddedCount: Maybe<Scalars["BigInt"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  coordinatorAddress: Maybe<Scalars["String"]["output"]>
  isActive: Maybe<Scalars["Boolean"]["output"]>
  lastFulfillmentTimestamp: Maybe<Scalars["Datetime"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  subscriptionId: Maybe<Scalars["Int"]["output"]>
  totalFulfilledRequests: Maybe<Scalars["BigInt"]["output"]>
  totalPaymentsAmount: Maybe<Scalars["BigFloat"]["output"]>
}

/**
 * A condition to be used against `Vrfv2SubscriptionConsumer` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2SubscriptionConsumerCondition = {
  /** Checks for equality with the object’s `addedAt` field. */
  addedAt: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `blockHash` field. */
  blockHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `chainId` field. */
  chainId: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `consumerAddedCount` field. */
  consumerAddedCount: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `isActive` field. */
  isActive: InputMaybe<Scalars["Boolean"]["input"]>
  /** Checks for equality with the object’s `lastFulfillmentTimestamp` field. */
  lastFulfillmentTimestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `totalFulfilledRequests` field. */
  totalFulfilledRequests: InputMaybe<Scalars["BigInt"]["input"]>
  /** Checks for equality with the object’s `totalPaymentsAmount` field. */
  totalPaymentsAmount: InputMaybe<Scalars["BigFloat"]["input"]>
}

/** A filter to be used against `Vrfv2SubscriptionConsumer` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2SubscriptionConsumerFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2SubscriptionConsumerFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2SubscriptionConsumerFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2SubscriptionConsumerFilter>>
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<IntFilter>
}

/** A connection to a list of `Vrfv2SubscriptionConsumer` values. */
export type Vrfv2SubscriptionConsumersConnection = {
  __typename?: "Vrfv2SubscriptionConsumersConnection"
  /** A list of edges which contains the `Vrfv2SubscriptionConsumer` and cursor to aid in pagination. */
  edges: Array<Vrfv2SubscriptionConsumersEdge>
  /** A list of `Vrfv2SubscriptionConsumer` objects. */
  nodes: Array<Vrfv2SubscriptionConsumer>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2SubscriptionConsumer` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2SubscriptionConsumer` edge in the connection. */
export type Vrfv2SubscriptionConsumersEdge = {
  __typename?: "Vrfv2SubscriptionConsumersEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2SubscriptionConsumer` at the end of the edge. */
  node: Vrfv2SubscriptionConsumer
}

/** Methods to use when ordering `Vrfv2SubscriptionConsumer`. */
export enum Vrfv2SubscriptionConsumersOrderBy {
  AddedAtAsc = "ADDED_AT_ASC",
  AddedAtDesc = "ADDED_AT_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ConsumerAddedCountAsc = "CONSUMER_ADDED_COUNT_ASC",
  ConsumerAddedCountDesc = "CONSUMER_ADDED_COUNT_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  CoordinatorAddressAsc = "COORDINATOR_ADDRESS_ASC",
  CoordinatorAddressDesc = "COORDINATOR_ADDRESS_DESC",
  IsActiveAsc = "IS_ACTIVE_ASC",
  IsActiveDesc = "IS_ACTIVE_DESC",
  LastFulfillmentTimestampAsc = "LAST_FULFILLMENT_TIMESTAMP_ASC",
  LastFulfillmentTimestampDesc = "LAST_FULFILLMENT_TIMESTAMP_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  TotalFulfilledRequestsAsc = "TOTAL_FULFILLED_REQUESTS_ASC",
  TotalFulfilledRequestsDesc = "TOTAL_FULFILLED_REQUESTS_DESC",
  TotalPaymentsAmountAsc = "TOTAL_PAYMENTS_AMOUNT_ASC",
  TotalPaymentsAmountDesc = "TOTAL_PAYMENTS_AMOUNT_DESC",
}

export type Vrfv2SubscriptionEvent = {
  __typename?: "Vrfv2SubscriptionEvent"
  blockNumber: Maybe<Scalars["BigFloat"]["output"]>
  consumerAddress: Maybe<Scalars["String"]["output"]>
  coordinatorAddress: Maybe<Scalars["String"]["output"]>
  eventId: Maybe<Scalars["String"]["output"]>
  eventName: Maybe<Scalars["String"]["output"]>
  logIndex: Maybe<Scalars["Int"]["output"]>
  network: Maybe<Scalars["String"]["output"]>
  newBalance: Maybe<Scalars["BigFloat"]["output"]>
  oldBalance: Maybe<Scalars["BigFloat"]["output"]>
  refundAddress: Maybe<Scalars["String"]["output"]>
  refundAmount: Maybe<Scalars["BigFloat"]["output"]>
  subscriptionId: Maybe<Scalars["Int"]["output"]>
  subscriptionOwner: Maybe<Scalars["String"]["output"]>
  timestamp: Maybe<Scalars["Datetime"]["output"]>
  transactionHash: Maybe<Scalars["String"]["output"]>
  transactionIndex: Maybe<Scalars["Int"]["output"]>
}

/**
 * A condition to be used against `Vrfv2SubscriptionEvent` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type Vrfv2SubscriptionEventCondition = {
  /** Checks for equality with the object’s `blockNumber` field. */
  blockNumber: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventId` field. */
  eventId: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `eventName` field. */
  eventName: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `logIndex` field. */
  logIndex: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `network` field. */
  network: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `newBalance` field. */
  newBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `oldBalance` field. */
  oldBalance: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `refundAddress` field. */
  refundAddress: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `refundAmount` field. */
  refundAmount: InputMaybe<Scalars["BigFloat"]["input"]>
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<Scalars["Int"]["input"]>
  /** Checks for equality with the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp: InputMaybe<Scalars["Datetime"]["input"]>
  /** Checks for equality with the object’s `transactionHash` field. */
  transactionHash: InputMaybe<Scalars["String"]["input"]>
  /** Checks for equality with the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<Scalars["Int"]["input"]>
}

/** A filter to be used against `Vrfv2SubscriptionEvent` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2SubscriptionEventFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2SubscriptionEventFilter>>
  /** Filter by the object’s `consumerAddress` field. */
  consumerAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2SubscriptionEventFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2SubscriptionEventFilter>>
  /** Filter by the object’s `refundAddress` field. */
  refundAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<IntFilter>
  /** Filter by the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `Vrfv2SubscriptionEvent` values. */
export type Vrfv2SubscriptionEventsConnection = {
  __typename?: "Vrfv2SubscriptionEventsConnection"
  /** A list of edges which contains the `Vrfv2SubscriptionEvent` and cursor to aid in pagination. */
  edges: Array<Vrfv2SubscriptionEventsEdge>
  /** A list of `Vrfv2SubscriptionEvent` objects. */
  nodes: Array<Vrfv2SubscriptionEvent>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2SubscriptionEvent` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2SubscriptionEvent` edge in the connection. */
export type Vrfv2SubscriptionEventsEdge = {
  __typename?: "Vrfv2SubscriptionEventsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2SubscriptionEvent` at the end of the edge. */
  node: Vrfv2SubscriptionEvent
}

/** Methods to use when ordering `Vrfv2SubscriptionEvent`. */
export enum Vrfv2SubscriptionEventsOrderBy {
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  ConsumerAddressAsc = "CONSUMER_ADDRESS_ASC",
  ConsumerAddressDesc = "CONSUMER_ADDRESS_DESC",
  CoordinatorAddressAsc = "COORDINATOR_ADDRESS_ASC",
  CoordinatorAddressDesc = "COORDINATOR_ADDRESS_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  NewBalanceAsc = "NEW_BALANCE_ASC",
  NewBalanceDesc = "NEW_BALANCE_DESC",
  OldBalanceAsc = "OLD_BALANCE_ASC",
  OldBalanceDesc = "OLD_BALANCE_DESC",
  RefundAddressAsc = "REFUND_ADDRESS_ASC",
  RefundAddressDesc = "REFUND_ADDRESS_DESC",
  RefundAmountAsc = "REFUND_AMOUNT_ASC",
  RefundAmountDesc = "REFUND_AMOUNT_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  SubscriptionOwnerAsc = "SUBSCRIPTION_OWNER_ASC",
  SubscriptionOwnerDesc = "SUBSCRIPTION_OWNER_DESC",
  TimestampAsc = "TIMESTAMP_ASC",
  TimestampDesc = "TIMESTAMP_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
}

/** A filter to be used against `Vrfv2Subscription` object types. All fields are combined with a logical ‘and.’ */
export type Vrfv2SubscriptionFilter = {
  /** Checks for all expressions in this list. */
  and: InputMaybe<Array<Vrfv2SubscriptionFilter>>
  /** Filter by the object’s `blockHash` field. */
  blockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `canceledBlockHash` field. */
  canceledBlockHash: InputMaybe<StringFilter>
  /** Filter by the object’s `contractAddress` field. */
  contractAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `coordinatorAddress` field. */
  coordinatorAddress: InputMaybe<StringFilter>
  /** Filter by the object’s `eventId` field. */
  eventId: InputMaybe<StringFilter>
  /** Filter by the object’s `eventName` field. */
  eventName: InputMaybe<StringFilter>
  /** Filter by the object’s `initialSubscriptionOwner` field. */
  initialSubscriptionOwner: InputMaybe<StringFilter>
  /** Filter by the object’s `logIndex` field. */
  logIndex: InputMaybe<IntFilter>
  /** Filter by the object’s `network` field. */
  network: InputMaybe<StringFilter>
  /** Negates the expression. */
  not: InputMaybe<Vrfv2SubscriptionFilter>
  /** Checks for any expressions in this list. */
  or: InputMaybe<Array<Vrfv2SubscriptionFilter>>
  /** Filter by the object’s `rawLog` field. */
  rawLog: InputMaybe<StringFilter>
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId: InputMaybe<IntFilter>
  /** Filter by the object’s `subscriptionOwner` field. */
  subscriptionOwner: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionHash` field. */
  transactionHash: InputMaybe<StringFilter>
  /** Filter by the object’s `transactionIndex` field. */
  transactionIndex: InputMaybe<IntFilter>
}

/** A connection to a list of `Vrfv2Subscription` values. */
export type Vrfv2SubscriptionsConnection = {
  __typename?: "Vrfv2SubscriptionsConnection"
  /** A list of edges which contains the `Vrfv2Subscription` and cursor to aid in pagination. */
  edges: Array<Vrfv2SubscriptionsEdge>
  /** A list of `Vrfv2Subscription` objects. */
  nodes: Array<Vrfv2Subscription>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Vrfv2Subscription` you could get from the connection. */
  totalCount: Scalars["Int"]["output"]
}

/** A `Vrfv2Subscription` edge in the connection. */
export type Vrfv2SubscriptionsEdge = {
  __typename?: "Vrfv2SubscriptionsEdge"
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars["Cursor"]["output"]>
  /** The `Vrfv2Subscription` at the end of the edge. */
  node: Vrfv2Subscription
}

/** Methods to use when ordering `Vrfv2Subscription`. */
export enum Vrfv2SubscriptionsOrderBy {
  ActiveConsumersCountAsc = "ACTIVE_CONSUMERS_COUNT_ASC",
  ActiveConsumersCountDesc = "ACTIVE_CONSUMERS_COUNT_DESC",
  BlockHashAsc = "BLOCK_HASH_ASC",
  BlockHashDesc = "BLOCK_HASH_DESC",
  BlockNumberAsc = "BLOCK_NUMBER_ASC",
  BlockNumberDesc = "BLOCK_NUMBER_DESC",
  BlockTimestampAsc = "BLOCK_TIMESTAMP_ASC",
  BlockTimestampDesc = "BLOCK_TIMESTAMP_DESC",
  CanceledAtAsc = "CANCELED_AT_ASC",
  CanceledAtDesc = "CANCELED_AT_DESC",
  CanceledBlockHashAsc = "CANCELED_BLOCK_HASH_ASC",
  CanceledBlockHashDesc = "CANCELED_BLOCK_HASH_DESC",
  ChainIdAsc = "CHAIN_ID_ASC",
  ChainIdDesc = "CHAIN_ID_DESC",
  ContractAddressAsc = "CONTRACT_ADDRESS_ASC",
  ContractAddressDesc = "CONTRACT_ADDRESS_DESC",
  CoordinatorAddressAsc = "COORDINATOR_ADDRESS_ASC",
  CoordinatorAddressDesc = "COORDINATOR_ADDRESS_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  CurrentBalanceAsc = "CURRENT_BALANCE_ASC",
  CurrentBalanceDesc = "CURRENT_BALANCE_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  EventNameAsc = "EVENT_NAME_ASC",
  EventNameDesc = "EVENT_NAME_DESC",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  InitialSubscriptionOwnerAsc = "INITIAL_SUBSCRIPTION_OWNER_ASC",
  InitialSubscriptionOwnerDesc = "INITIAL_SUBSCRIPTION_OWNER_DESC",
  InputsAsc = "INPUTS_ASC",
  InputsDesc = "INPUTS_DESC",
  IsActiveAsc = "IS_ACTIVE_ASC",
  IsActiveDesc = "IS_ACTIVE_DESC",
  LogIndexAsc = "LOG_INDEX_ASC",
  LogIndexDesc = "LOG_INDEX_DESC",
  Natural = "NATURAL",
  NetworkAsc = "NETWORK_ASC",
  NetworkDesc = "NETWORK_DESC",
  RawLogAsc = "RAW_LOG_ASC",
  RawLogDesc = "RAW_LOG_DESC",
  RefundAmountAsc = "REFUND_AMOUNT_ASC",
  RefundAmountDesc = "REFUND_AMOUNT_DESC",
  RemovedAsc = "REMOVED_ASC",
  RemovedDesc = "REMOVED_DESC",
  SubscriptionIdAsc = "SUBSCRIPTION_ID_ASC",
  SubscriptionIdDesc = "SUBSCRIPTION_ID_DESC",
  SubscriptionOwnerAsc = "SUBSCRIPTION_OWNER_ASC",
  SubscriptionOwnerDesc = "SUBSCRIPTION_OWNER_DESC",
  TotalFulfilledRequestsAsc = "TOTAL_FULFILLED_REQUESTS_ASC",
  TotalFulfilledRequestsDesc = "TOTAL_FULFILLED_REQUESTS_DESC",
  TransactionHashAsc = "TRANSACTION_HASH_ASC",
  TransactionHashDesc = "TRANSACTION_HASH_DESC",
  TransactionIndexAsc = "TRANSACTION_INDEX_ASC",
  TransactionIndexDesc = "TRANSACTION_INDEX_DESC",
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

export const LaneStatusesFilteredDocument = gql`
  query LaneStatusesFiltered(
    $sourceRouterAddress: String!
    $sourceNetworkId: String!
    $destinationNetworkIds: [String!]!
  ) {
    allCcipAllLaneStatuses(
      filter: {
        sourceNetworkName: { equalTo: $sourceNetworkId }
        routerAddress: { equalTo: $sourceRouterAddress }
        destNetworkName: { in: $destinationNetworkIds }
      }
    ) {
      nodes {
        routerAddress
        destNetworkName
        sourceNetworkName
        successRate
      }
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action()

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    LaneStatusesFiltered(
      variables: LaneStatusesFilteredQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<LaneStatusesFilteredQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<LaneStatusesFilteredQuery>(LaneStatusesFilteredDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "LaneStatusesFiltered",
        "query",
        variables
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
