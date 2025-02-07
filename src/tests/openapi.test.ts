import { describe, it, expect, beforeAll } from "@jest/globals"
import fs from "fs"
import path from "path"
import { OpenAPIV3 } from "openapi-types"
import SwaggerParser from "@apidevtools/swagger-parser"

describe("OpenAPI Specification", () => {
  let openApiDoc: OpenAPIV3.Document

  beforeAll(async () => {
    const specPath = path.join(process.cwd(), "public/api/ccip/v1/openapi.json")
    const specContent = fs.readFileSync(specPath, "utf-8")
    openApiDoc = JSON.parse(specContent)
  })

  it("should be valid OpenAPI 3.0 specification", async () => {
    await expect(SwaggerParser.validate(openApiDoc)).resolves.toBeDefined()
  })

  it("should have required info fields", () => {
    expect(openApiDoc.info).toBeDefined()
    expect(openApiDoc.info.title).toBe("CCIP Chains API")
    expect(openApiDoc.info.version).toBeDefined()
    expect(openApiDoc.info.description).toBeDefined()
  })

  it("should have server configurations", () => {
    expect(openApiDoc.servers).toBeDefined()
    expect(openApiDoc.servers).toHaveLength(2)
    expect(openApiDoc.servers?.map((s) => s.url)).toContain("https://docs.chain.link/api/ccip/v1")
  })

  it("should have /chains endpoint", () => {
    const chainPath = openApiDoc.paths?.["/chains"]
    expect(chainPath).toBeDefined()
    expect(chainPath?.get).toBeDefined()
  })

  it("should have required parameters for /chains endpoint", () => {
    const chainPath = openApiDoc.paths?.["/chains"]
    const params = chainPath?.get?.parameters as OpenAPIV3.ParameterObject[]
    expect(params).toBeDefined()

    const envParam = params.find((p) => p.name === "environment") as OpenAPIV3.ParameterObject
    expect(envParam).toBeDefined()
    expect(envParam.required).toBe(true)
    expect((envParam.schema as OpenAPIV3.SchemaObject).enum).toEqual(["mainnet", "testnet"])
  })

  it("should have all required schemas", () => {
    const schemas = openApiDoc.components?.schemas
    expect(schemas).toBeDefined()

    const requiredSchemas = ["ChainMetadata", "ChainDetails", "ChainConfigError", "ChainApiResponse", "ErrorResponse"]

    requiredSchemas.forEach((schema) => {
      expect(schemas?.[schema]).toBeDefined()
    })
  })

  it("should have proper response schemas", () => {
    const chainPath = openApiDoc.paths?.["/chains"]
    const responses = chainPath?.get?.responses
    expect(responses).toBeDefined()
    expect(responses?.["200"]).toBeDefined()
    expect(responses?.["400"]).toBeDefined()
    expect(responses?.["500"]).toBeDefined()
  })
})
