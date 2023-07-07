declare module "astro:content" {
  interface Render {
    ".mdx": Promise<{
      Content: import("astro").MarkdownInstance<{}>["Content"]
      headings: import("astro").MarkdownHeading[]
      remarkPluginFrontmatter: Record<string, any>
    }>
  }
}

declare module "astro:content" {
  interface Render {
    ".md": Promise<{
      Content: import("astro").MarkdownInstance<{}>["Content"]
      headings: import("astro").MarkdownHeading[]
      remarkPluginFrontmatter: Record<string, any>
    }>
  }
}

declare module "astro:content" {
  export { z } from "astro/zod"
  export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]]

  // TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
  /**
   * @deprecated
   * `astro:content` no longer provide `image()`.
   *
   * Please use it through `schema`, like such:
   * ```ts
   * import { defineCollection, z } from "astro:content";
   *
   * defineCollection({
   *   schema: ({ image }) =>
   *     z.object({
   *       image: image(),
   *     }),
   * });
   * ```
   */
  export const image: never

  // This needs to be in sync with ImageMetadata
  export type ImageFunction = () => import("astro/zod").ZodObject<{
    src: import("astro/zod").ZodString
    width: import("astro/zod").ZodNumber
    height: import("astro/zod").ZodNumber
    format: import("astro/zod").ZodUnion<
      [
        import("astro/zod").ZodLiteral<"png">,
        import("astro/zod").ZodLiteral<"jpg">,
        import("astro/zod").ZodLiteral<"jpeg">,
        import("astro/zod").ZodLiteral<"tiff">,
        import("astro/zod").ZodLiteral<"webp">,
        import("astro/zod").ZodLiteral<"gif">,
        import("astro/zod").ZodLiteral<"svg">
      ]
    >
  }>

  type BaseSchemaWithoutEffects =
    | import("astro/zod").AnyZodObject
    | import("astro/zod").ZodUnion<import("astro/zod").AnyZodObject[]>
    | import("astro/zod").ZodDiscriminatedUnion<string, import("astro/zod").AnyZodObject[]>
    | import("astro/zod").ZodIntersection<import("astro/zod").AnyZodObject, import("astro/zod").AnyZodObject>

  type BaseSchema = BaseSchemaWithoutEffects | import("astro/zod").ZodEffects<BaseSchemaWithoutEffects>

  export type SchemaContext = { image: ImageFunction }

  type DataCollectionConfig<S extends BaseSchema> = {
    type: "data"
    schema?: S | ((context: SchemaContext) => S)
  }

  type ContentCollectionConfig<S extends BaseSchema> = {
    type?: "content"
    schema?: S | ((context: SchemaContext) => S)
  }

  type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>

  export function defineCollection<S extends BaseSchema>(input: CollectionConfig<S>): CollectionConfig<S>

  type AllValuesOf<T> = T extends any ? T[keyof T] : never
  type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<ContentEntryMap[C]>["slug"]

  export function getEntryBySlug<C extends keyof ContentEntryMap, E extends ValidContentEntrySlug<C> | (string & {})>(
    collection: C,
    // Note that this has to accept a regular string too, for SSR
    entrySlug: E
  ): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>

  export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
    collection: C,
    entryId: E
  ): Promise<CollectionEntry<C>>

  export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E
  ): Promise<E[]>
  export function getCollection<C extends keyof AnyEntryMap>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown
  ): Promise<CollectionEntry<C>[]>

  export function getEntry<C extends keyof ContentEntryMap, E extends ValidContentEntrySlug<C> | (string & {})>(entry: {
    collection: C
    slug: E
  }): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>
  export function getEntry<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C] | (string & {})>(entry: {
    collection: C
    id: E
  }): E extends keyof DataEntryMap[C] ? Promise<DataEntryMap[C][E]> : Promise<CollectionEntry<C> | undefined>
  export function getEntry<C extends keyof ContentEntryMap, E extends ValidContentEntrySlug<C> | (string & {})>(
    collection: C,
    slug: E
  ): E extends ValidContentEntrySlug<C> ? Promise<CollectionEntry<C>> : Promise<CollectionEntry<C> | undefined>
  export function getEntry<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C] | (string & {})>(
    collection: C,
    id: E
  ): E extends keyof DataEntryMap[C] ? Promise<DataEntryMap[C][E]> : Promise<CollectionEntry<C> | undefined>

  /** Resolve an array of entry references from the same collection */
  export function getEntries<C extends keyof ContentEntryMap>(
    entries: {
      collection: C
      slug: ValidContentEntrySlug<C>
    }[]
  ): Promise<CollectionEntry<C>[]>
  export function getEntries<C extends keyof DataEntryMap>(
    entries: {
      collection: C
      id: keyof DataEntryMap[C]
    }[]
  ): Promise<CollectionEntry<C>[]>

  export function reference<C extends keyof AnyEntryMap>(
    collection: C
  ): import("astro/zod").ZodEffects<
    import("astro/zod").ZodString,
    C extends keyof ContentEntryMap
      ? {
          collection: C
          slug: ValidContentEntrySlug<C>
        }
      : {
          collection: C
          id: keyof DataEntryMap[C]
        }
  >
  // Allow generic `string` to avoid excessive type errors in the config
  // if `dev` is not running to update as you edit.
  // Invalid collection names will be caught at build time.
  export function reference<C extends string>(
    collection: C
  ): import("astro/zod").ZodEffects<import("astro/zod").ZodString, never>

  type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T
  type InferEntrySchema<C extends keyof AnyEntryMap> = import("astro/zod").infer<
    ReturnTypeOrOriginal<Required<ContentConfig["collections"][C]>["schema"]>
  >

  type ContentEntryMap = {
    "any-api": {
      "api-reference.mdx": {
        id: "api-reference.mdx"
        slug: "api-reference"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "find-oracle.mdx": {
        id: "find-oracle.mdx"
        slug: "find-oracle"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/examples/array-response.mdx": {
        id: "get-request/examples/array-response.mdx"
        slug: "get-request/examples/array-response"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/examples/existing-job-request.mdx": {
        id: "get-request/examples/existing-job-request.mdx"
        slug: "get-request/examples/existing-job-request"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/examples/large-responses.mdx": {
        id: "get-request/examples/large-responses.mdx"
        slug: "get-request/examples/large-responses"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/examples/multi-variable-responses.mdx": {
        id: "get-request/examples/multi-variable-responses.mdx"
        slug: "get-request/examples/multi-variable-responses"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/examples/single-word-response.mdx": {
        id: "get-request/examples/single-word-response.mdx"
        slug: "get-request/examples/single-word-response"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "get-request/introduction.mdx": {
        id: "get-request/introduction.mdx"
        slug: "get-request/introduction"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "introduction.mdx": {
        id: "introduction.mdx"
        slug: "introduction"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
      "testnet-oracles.mdx": {
        id: "testnet-oracles.mdx"
        slug: "testnet-oracles"
        body: string
        collection: "any-api"
        data: any
      } & { render(): Render[".mdx"] }
    }
    "architecture-overview": {
      "architecture-decentralized-model.mdx": {
        id: "architecture-decentralized-model.mdx"
        slug: "architecture-decentralized-model"
        body: string
        collection: "architecture-overview"
        data: any
      } & { render(): Render[".mdx"] }
      "architecture-overview.mdx": {
        id: "architecture-overview.mdx"
        slug: "architecture-overview"
        body: string
        collection: "architecture-overview"
        data: any
      } & { render(): Render[".mdx"] }
      "architecture-request-model.mdx": {
        id: "architecture-request-model.mdx"
        slug: "architecture-request-model"
        body: string
        collection: "architecture-overview"
        data: any
      } & { render(): Render[".mdx"] }
      "off-chain-reporting.mdx": {
        id: "off-chain-reporting.mdx"
        slug: "off-chain-reporting"
        body: string
        collection: "architecture-overview"
        data: any
      } & { render(): Render[".mdx"] }
    }
    "blockchain-integrations-framework": {
      "index.mdx": {
        id: "index.mdx"
        slug: "index"
        body: string
        collection: "blockchain-integrations-framework"
        data: any
      } & { render(): Render[".mdx"] }
    }
    "chainlink-automation": {
      "automation-economics.mdx": {
        id: "automation-economics.mdx"
        slug: "automation-economics"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "automation-release-notes.mdx": {
        id: "automation-release-notes.mdx"
        slug: "automation-release-notes"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "compatible-contract-best-practice.mdx": {
        id: "compatible-contract-best-practice.mdx"
        slug: "compatible-contract-best-practice"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "compatible-contracts.mdx": {
        id: "compatible-contracts.mdx"
        slug: "compatible-contracts"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "faqs.mdx": {
        id: "faqs.mdx"
        slug: "faqs"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "flexible-upkeeps.mdx": {
        id: "flexible-upkeeps.mdx"
        slug: "flexible-upkeeps"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "introduction.mdx": {
        id: "introduction.mdx"
        slug: "introduction"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "job-scheduler.mdx": {
        id: "job-scheduler.mdx"
        slug: "job-scheduler"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "manage-upkeeps.mdx": {
        id: "manage-upkeeps.mdx"
        slug: "manage-upkeeps"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "overview.mdx": {
        id: "overview.mdx"
        slug: "overview"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "register-upkeep.mdx": {
        id: "register-upkeep.mdx"
        slug: "register-upkeep"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "supported-networks.mdx": {
        id: "supported-networks.mdx"
        slug: "supported-networks"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/batch-nft.mdx": {
        id: "tutorials/batch-nft.mdx"
        slug: "tutorials/batch-nft"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/counting-dnft.mdx": {
        id: "tutorials/counting-dnft.mdx"
        slug: "tutorials/counting-dnft"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/dynamic-nft.mdx": {
        id: "tutorials/dynamic-nft.mdx"
        slug: "tutorials/dynamic-nft"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/eth-balance.mdx": {
        id: "tutorials/eth-balance.mdx"
        slug: "tutorials/eth-balance"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/vault-harvester.mdx": {
        id: "tutorials/vault-harvester.mdx"
        slug: "tutorials/vault-harvester"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/vrf-sub-monitor.mdx": {
        id: "tutorials/vrf-sub-monitor.mdx"
        slug: "tutorials/vrf-sub-monitor"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
      "util-overview.mdx": {
        id: "util-overview.mdx"
        slug: "util-overview"
        body: string
        collection: "chainlink-automation"
        data: any
      } & { render(): Render[".mdx"] }
    }
    "chainlink-functions": {
      "api-reference/Functions.mdx": {
        id: "api-reference/Functions.mdx"
        slug: "api-reference/functions"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "api-reference/FunctionsClient.mdx": {
        id: "api-reference/FunctionsClient.mdx"
        slug: "api-reference/functionsclient"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "getting-started.mdx": {
        id: "getting-started.mdx"
        slug: "getting-started"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "index.mdx": {
        id: "index.mdx"
        slug: "index"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/add-functions-to-projects.mdx": {
        id: "resources/add-functions-to-projects.mdx"
        slug: "resources/add-functions-to-projects"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/architecture.mdx": {
        id: "resources/architecture.mdx"
        slug: "resources/architecture"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/billing.mdx": {
        id: "resources/billing.mdx"
        slug: "resources/billing"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/concepts.mdx": {
        id: "resources/concepts.mdx"
        slug: "resources/concepts"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/index.mdx": {
        id: "resources/index.mdx"
        slug: "resources"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/service-limits.mdx": {
        id: "resources/service-limits.mdx"
        slug: "resources/service-limits"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/subscriptions.mdx": {
        id: "resources/subscriptions.mdx"
        slug: "resources/subscriptions"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "supported-networks.mdx": {
        id: "supported-networks.mdx"
        slug: "supported-networks"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-custom-response.mdx": {
        id: "tutorials/api-custom-response.mdx"
        slug: "tutorials/api-custom-response"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-multiple-calls.mdx": {
        id: "tutorials/api-multiple-calls.mdx"
        slug: "tutorials/api-multiple-calls"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-post-data.mdx": {
        id: "tutorials/api-post-data.mdx"
        slug: "tutorials/api-post-data"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-query-parameters.mdx": {
        id: "tutorials/api-query-parameters.mdx"
        slug: "tutorials/api-query-parameters"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-use-secrets-offchain.mdx": {
        id: "tutorials/api-use-secrets-offchain.mdx"
        slug: "tutorials/api-use-secrets-offchain"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/api-use-secrets.mdx": {
        id: "tutorials/api-use-secrets.mdx"
        slug: "tutorials/api-use-secrets"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/automate-functions.mdx": {
        id: "tutorials/automate-functions.mdx"
        slug: "tutorials/automate-functions"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/index.mdx": {
        id: "tutorials/index.mdx"
        slug: "tutorials"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
      "tutorials/simple-computation.mdx": {
        id: "tutorials/simple-computation.mdx"
        slug: "tutorials/simple-computation"
        body: string
        collection: "chainlink-functions"
        data: any
      } & { render(): Render[".mdx"] }
    }
    "chainlink-nodes": {
      "configuring-nodes.mdx": {
        id: "configuring-nodes.mdx"
        slug: "configuring-nodes"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/addresses.mdx": {
        id: "contracts/addresses.mdx"
        slug: "contracts/addresses"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/forwarder.mdx": {
        id: "contracts/forwarder.mdx"
        slug: "contracts/forwarder"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/operator.mdx": {
        id: "contracts/operator.mdx"
        slug: "contracts/operator"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/operatorfactory.mdx": {
        id: "contracts/operatorfactory.mdx"
        slug: "contracts/operatorfactory"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/ownership.mdx": {
        id: "contracts/ownership.mdx"
        slug: "contracts/ownership"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "contracts/receiver.mdx": {
        id: "contracts/receiver.mdx"
        slug: "contracts/receiver"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-adapters/contract-creators.mdx": {
        id: "external-adapters/contract-creators.mdx"
        slug: "external-adapters/contract-creators"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-adapters/developers.mdx": {
        id: "external-adapters/developers.mdx"
        slug: "external-adapters/developers"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-adapters/external-adapters.mdx": {
        id: "external-adapters/external-adapters.mdx"
        slug: "external-adapters/external-adapters"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-adapters/node-operators.mdx": {
        id: "external-adapters/node-operators.mdx"
        slug: "external-adapters/node-operators"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-initiators/building-external-initiators.mdx": {
        id: "external-initiators/building-external-initiators.mdx"
        slug: "external-initiators/building-external-initiators"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-initiators/external-initiators-in-nodes.mdx": {
        id: "external-initiators/external-initiators-in-nodes.mdx"
        slug: "external-initiators/external-initiators-in-nodes"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "external-initiators/external-initiators-introduction.mdx": {
        id: "external-initiators/external-initiators-introduction.mdx"
        slug: "external-initiators/external-initiators-introduction"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-existing-job.mdx": {
        id: "job-specs/direct-request-existing-job.mdx"
        slug: "job-specs/direct-request-existing-job"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-get-bool.mdx": {
        id: "job-specs/direct-request-get-bool.mdx"
        slug: "job-specs/direct-request-get-bool"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-get-bytes.mdx": {
        id: "job-specs/direct-request-get-bytes.mdx"
        slug: "job-specs/direct-request-get-bytes"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-get-int256.mdx": {
        id: "job-specs/direct-request-get-int256.mdx"
        slug: "job-specs/direct-request-get-int256"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-get-string.mdx": {
        id: "job-specs/direct-request-get-string.mdx"
        slug: "job-specs/direct-request-get-string"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/direct-request-get-uint256.mdx": {
        id: "job-specs/direct-request-get-uint256.mdx"
        slug: "job-specs/direct-request-get-uint256"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "job-specs/multi-word-job.mdx": {
        id: "job-specs/multi-word-job.mdx"
        slug: "job-specs/multi-word-job"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "node-versions.mdx": {
        id: "node-versions.mdx"
        slug: "node-versions"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/all-jobs.mdx": {
        id: "oracle-jobs/all-jobs.mdx"
        slug: "oracle-jobs/all-jobs"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/all-tasks.mdx": {
        id: "oracle-jobs/all-tasks.mdx"
        slug: "oracle-jobs/all-tasks"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/jobs.mdx": {
        id: "oracle-jobs/jobs.mdx"
        slug: "oracle-jobs/jobs"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/migration-v1-v2.mdx": {
        id: "oracle-jobs/migration-v1-v2.mdx"
        slug: "oracle-jobs/migration-v1-v2"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/tasks.mdx": {
        id: "oracle-jobs/tasks.mdx"
        slug: "oracle-jobs/tasks"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/v1/adapters.mdx": {
        id: "oracle-jobs/v1/adapters.mdx"
        slug: "oracle-jobs/v1/adapters"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/v1/initiators.mdx": {
        id: "oracle-jobs/v1/initiators.mdx"
        slug: "oracle-jobs/v1/initiators"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "oracle-jobs/v1/job-specifications.mdx": {
        id: "oracle-jobs/v1/job-specifications.mdx"
        slug: "oracle-jobs/v1/job-specifications"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/best-practices-aws.mdx": {
        id: "resources/best-practices-aws.mdx"
        slug: "resources/best-practices-aws"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/best-security-practices.mdx": {
        id: "resources/best-security-practices.mdx"
        slug: "resources/best-security-practices"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/connecting-to-a-remote-database.mdx": {
        id: "resources/connecting-to-a-remote-database.mdx"
        slug: "resources/connecting-to-a-remote-database"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/enabling-https-connections.mdx": {
        id: "resources/enabling-https-connections.mdx"
        slug: "resources/enabling-https-connections"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/evm-performance-configuration.mdx": {
        id: "resources/evm-performance-configuration.mdx"
        slug: "resources/evm-performance-configuration"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/miscellaneous.mdx": {
        id: "resources/miscellaneous.mdx"
        slug: "resources/miscellaneous"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/performing-system-maintenance.mdx": {
        id: "resources/performing-system-maintenance.mdx"
        slug: "resources/performing-system-maintenance"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/requirements.mdx": {
        id: "resources/requirements.mdx"
        slug: "resources/requirements"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "resources/run-an-ethereum-client.mdx": {
        id: "resources/run-an-ethereum-client.mdx"
        slug: "resources/run-an-ethereum-client"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/configuration.mdx": {
        id: "v1/configuration.mdx"
        slug: "v1/configuration"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/fulfilling-requests.mdx": {
        id: "v1/fulfilling-requests.mdx"
        slug: "v1/fulfilling-requests"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/index.mdx": {
        id: "v1/index.mdx"
        slug: "v1"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/node-config.mdx": {
        id: "v1/node-config.mdx"
        slug: "v1/node-config"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/roles-and-access.mdx": {
        id: "v1/roles-and-access.mdx"
        slug: "v1/roles-and-access"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/running-a-chainlink-node.mdx": {
        id: "v1/running-a-chainlink-node.mdx"
        slug: "v1/running-a-chainlink-node"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/secrets-config.mdx": {
        id: "v1/secrets-config.mdx"
        slug: "v1/secrets-config"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
      "v1/using-forwarder.mdx": {
        id: "v1/using-forwarder.mdx"
        slug: "v1/using-forwarder"
        body: string
        collection: "chainlink-nodes"
        data: any
      } & { render(): Render[".mdx"] }
    }
  }

  type DataEntryMap = {}

  type AnyEntryMap = ContentEntryMap & DataEntryMap

  type ContentConfig = never
}
