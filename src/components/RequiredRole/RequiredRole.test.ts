import { describe, it, expect } from "@jest/globals"
import { transformMarkdown } from "@lib/markdown/transformMarkdown.js"
import { REQUIRED_ROLE_PRODUCTS, describeRequiredRole } from "./roles.js"

describe("describeRequiredRole", () => {
  it("names the role with its product and links to the product-scoped RBAC section", () => {
    expect(describeRequiredRole("ace", "operator")).toEqual({
      name: "ACE Operator",
      orHigher: true,
      url: "/chainlink-platform/rbac?parent=ace#ace",
    })
  })

  it("does not say 'or higher' for the most privileged role", () => {
    expect(describeRequiredRole("ace", "admin")?.orHigher).toBe(false)
    expect(describeRequiredRole("cre", "admin")?.orHigher).toBe(false)
  })

  it("uses the roles of each product", () => {
    expect(describeRequiredRole("cre", "developer")?.name).toBe("CRE Developer")
    expect(describeRequiredRole("crec", "operator")?.name).toBe("CRE Connect Operator")
    expect(describeRequiredRole("crec", "viewer")?.url).toBe("/chainlink-platform/rbac?parent=crec#cre-connect")
  })

  it("returns null for an unknown product or role", () => {
    expect(describeRequiredRole("ace", "developer")).toBeNull()
    expect(describeRequiredRole("dataStreams", "admin")).toBeNull()
    expect(describeRequiredRole("toString", "admin")).toBeNull()
    expect(describeRequiredRole(undefined, "admin")).toBeNull()
    expect(describeRequiredRole("ace", 1)).toBeNull()
  })

  it("lists the most privileged role first for every product", () => {
    for (const config of Object.values(REQUIRED_ROLE_PRODUCTS)) {
      expect(Object.keys(config.roles)[0]).toBe("admin")
    }
  })
})

describe("RequiredRole in the Markdown export", () => {
  it("projects the role and the link as a sentence", async () => {
    const result = await transformMarkdown('<RequiredRole product="ace" role="operator" />', "/fake/path.mdx")
    expect(result).toContain("**Required role:** ACE Operator or higher.")
    expect(result).toContain("[What each role can do](/chainlink-platform/rbac?parent=ace#ace)")
  })

  it("keeps the optional body after the sentence", async () => {
    const markdown = `<RequiredRole product="ace" role="admin">
  Creating a wallet needs the \`ace:core:wallet:write\` permission.
</RequiredRole>`
    const result = await transformMarkdown(markdown, "/fake/path.mdx")
    expect(result).toContain("**Required role:** ACE Admin.")
    expect(result).not.toContain("ACE Admin or higher")
    expect(result).toContain("Creating a wallet needs the `ace:core:wallet:write` permission.")
  })

  it("drops a component with an unknown role instead of leaking JSX", async () => {
    const result = await transformMarkdown(
      'Before\n\n<RequiredRole product="ace" role="owner" />\n\nAfter',
      "/fake/path.mdx"
    )
    expect(result).toContain("Before")
    expect(result).toContain("After")
    expect(result).not.toContain("RequiredRole")
    expect(result).not.toContain("Required role")
  })
})
