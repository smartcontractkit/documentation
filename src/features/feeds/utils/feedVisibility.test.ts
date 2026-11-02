import { jest } from "@jest/globals"

// feedMetadata pulls in the Supabase-backed category helpers; stub the client
// so the visibility predicates can be tested without import.meta.env.
jest.unstable_mockModule("../../../db/supabase.ts", () => ({
  getSupabaseClient: () => null,
  supabase: {},
}))

const { is247Stream, get247Category, matches247StreamFilter } = await import("./twentyFourSeven.ts")
const { isFeedVisible, shouldHideStreamFeedId } = await import("./feedVisibility.ts")

const verifierStream = (docs: Record<string, unknown>, overrides: Record<string, unknown> = {}) => ({
  contractType: "verifier",
  feedId: "0xfeed",
  pair: ["AAPL", "USD"],
  ...overrides,
  docs,
})

describe("is247Stream", () => {
  it.each(["247", "247Perps", "247-TWAP"])("detects stream attributeType %s", (attributeType) => {
    expect(is247Stream(verifierStream({ attributeType }))).toBe(true)
  })

  it.each(["247CustomPrice", "247Smoothed"])("excludes Data Feeds attributeType %s", (attributeType) => {
    expect(is247Stream(verifierStream({ attributeType }))).toBe(false)
  })

  it("detects the 247Price feed type", () => {
    expect(is247Stream(verifierStream({ feedType: "247Price" }))).toBe(true)
    expect(is247Stream(verifierStream({}, { feedType: "247Price" }))).toBe(true)
  })

  it.each(["PerpsPrice", "TWAP", "Equities", undefined])("rejects attributeType %s", (attributeType) => {
    expect(is247Stream(verifierStream({ attributeType, feedType: "Crypto" }))).toBe(false)
  })
})

describe("get247Category", () => {
  it.each([
    ["247", "twap"],
    ["247-TWAP", "twap"],
    ["247Perps", "perps"],
    ["247CustomPrice", "smoothed"],
    ["247Smoothed", "smoothed"],
  ])("maps attributeType %s to %s", (attributeType, category) => {
    // get247Category still recognises the Data Feeds product even though the
    // streams family excludes it.
    expect(get247Category(verifierStream({ attributeType }))).toBe(category)
  })

  it.each(["PerpsPrice", "TWAP", "EquityPrice", undefined])("does not classify attributeType %s", (attributeType) => {
    expect(get247Category(verifierStream({ attributeType }))).toBeUndefined()
  })

  it("does not infer a product from the 247Price feed type alone", () => {
    expect(get247Category(verifierStream({ feedType: "247Price" }))).toBeUndefined()
    expect(is247Stream(verifierStream({ feedType: "247Price" }))).toBe(true)
  })
})

describe("isFeedVisible for streamsRwa", () => {
  it("shows 24/7 stream products", () => {
    expect(
      isFeedVisible(verifierStream({ attributeType: "247", feedType: "247Price", schema: "v2" }), "streamsRwa")
    ).toBe(true)
    expect(
      isFeedVisible(verifierStream({ attributeType: "247Perps", feedType: "247Price", schema: "v3" }), "streamsRwa")
    ).toBe(true)
  })

  it("keeps the 24/7 Smoothed Data Feeds product off the streams page", () => {
    expect(
      isFeedVisible(
        verifierStream({ attributeType: "247CustomPrice", feedType: "247Price", schema: "v11" }),
        "streamsRwa"
      )
    ).toBe(false)
  })

  it("still hides streams flagged hidden in the reference data", () => {
    expect(
      isFeedVisible(
        verifierStream({ attributeType: "247", feedType: "247Price", schema: "v2", hidden: true }),
        "streamsRwa"
      )
    ).toBe(false)
  })

  it("keeps PerpsPrice streams off the RWA page for now", () => {
    expect(
      isFeedVisible(verifierStream({ attributeType: "PerpsPrice", feedType: "PerpsPrice", schema: "v3" }), "streamsRwa")
    ).toBe(false)
  })

  it("excludes 24/7 streams from the other category filters", () => {
    const twentyFourSeven = verifierStream({ attributeType: "247", feedType: "247Price", schema: "v2" })

    expect(isFeedVisible(twentyFourSeven, "streamsRwa", "", { streamCategoryFilter: "equities" })).toBe(false)
    expect(isFeedVisible(twentyFourSeven, "streamsRwa", "", { streamCategoryFilter: "all" })).toBe(true)
  })
})

describe("shouldHideStreamFeedId", () => {
  it("hides feed IDs for the 24/7 stream family", () => {
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "247", feedType: "247Price" }))).toBe(true)
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "247Perps", feedType: "247Price" }))).toBe(true)
  })

  it("leaves regular TWAP, smoothed, and ordinary streams alone", () => {
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "TWAP", feedType: "Crypto", schema: "v2" }))).toBe(
      false
    )
    expect(
      shouldHideStreamFeedId(verifierStream({ attributeType: "247CustomPrice", feedType: "247Price", schema: "v11" }))
    ).toBe(false)
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "EquityPrice", feedType: "Equities" }))).toBe(false)
  })
})

describe("matches247StreamFilter", () => {
  const twap = verifierStream({ attributeType: "247", feedType: "247Price" })
  const perps = verifierStream({ attributeType: "247Perps", feedType: "247Price" })
  const smoothed = verifierStream({ attributeType: "247CustomPrice", feedType: "247Price" })
  const equities = verifierStream({ attributeType: "EquityPrice", feedType: "Equities" })

  it("passes every stream through when the 24/7 filter is off", () => {
    expect(matches247StreamFilter(twap, false, "all")).toBe(true)
    expect(matches247StreamFilter(equities, false, "all")).toBe(true)
  })

  it("keeps only 24/7 stream products when the 24/7 filter is on", () => {
    expect(matches247StreamFilter(twap, true, "all")).toBe(true)
    expect(matches247StreamFilter(perps, true, "all")).toBe(true)
    expect(matches247StreamFilter(smoothed, true, "all")).toBe(false)
    expect(matches247StreamFilter(equities, true, "all")).toBe(false)
  })

  it("splits the 24/7 stream products by attribute type", () => {
    expect(matches247StreamFilter(twap, true, "twap")).toBe(true)
    expect(matches247StreamFilter(perps, true, "twap")).toBe(false)

    expect(matches247StreamFilter(perps, true, "perps")).toBe(true)
    expect(matches247StreamFilter(twap, true, "perps")).toBe(false)
  })
})
