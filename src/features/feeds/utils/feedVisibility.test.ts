import { jest } from "@jest/globals"

// feedMetadata pulls in the Supabase-backed category helpers; stub the client
// so the visibility predicates can be tested without import.meta.env.
jest.unstable_mockModule("../../../db/supabase.ts", () => ({
  getSupabaseClient: () => null,
  supabase: {},
}))

const { is247Stream, get247Category, matches247StreamFilter } = await import("./twentyFourSeven.ts")
const {
  is247USEquitiesStream,
  matches247USEquitiesStreamFilter,
  is247TokenizedEquityFeed,
  isIndexStreamFeed,
  getIndexStreamRegion,
  matchesIndexStreamFilter,
  is24x5StreamFeed,
} = await import("./feedMetadata.ts")
const { isFeedVisible, shouldHideAddress, shouldHideStreamFeedId } = await import("./feedVisibility.ts")

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

  it("includes 24/7 US Equities streams only when explicitly opted in", () => {
    const feed = verifierStream({
      attributeType: "247CustomPrice",
      feedType: "247Price",
      schema: "v11",
      assetClass: "Equities",
    })

    expect(isFeedVisible(feed, "streamsRwa")).toBe(false)
    expect(isFeedVisible(feed, "streamsRwa", "", { show247USEquities: true })).toBe(true)
  })

  it("still respects the hidden flag for 24/7 US Equities streams", () => {
    const feed = verifierStream({
      attributeType: "247CustomPrice",
      feedType: "247Price",
      schema: "v11",
      assetClass: "Equities",
      hidden: true,
    })

    expect(isFeedVisible(feed, "streamsRwa", "", { show247USEquities: true })).toBe(false)
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

describe("shouldHideAddress", () => {
  it.each([
    "0xd467dc4668dd8fdd762c7d18a198e85f380d0ed7",
    "0x137ede0803edc0470a2fede55493bc66232b6670",
    "0xaf992a6ad37b4878cf9c31f082b178860e268ce3",
  ])("hides explicitly listed proxy address %s", (proxyAddress) => {
    expect(shouldHideAddress({ proxyAddress, docs: {} })).toBe(true)
  })

  it("leaves unlisted proxy addresses alone", () => {
    expect(shouldHideAddress({ proxyAddress: "0x1234", docs: {} })).toBe(false)
  })
})

describe("shouldHideStreamFeedId", () => {
  it("hides feed IDs for the 24/7 stream family", () => {
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "247", feedType: "247Price" }))).toBe(true)
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "247Perps", feedType: "247Price" }))).toBe(true)
  })

  it("hides feed IDs for 24/7 US Equities streams", () => {
    expect(
      shouldHideStreamFeedId(
        verifierStream({
          attributeType: "247CustomPrice",
          feedType: "247Price",
          schema: "v11",
          assetClass: "Equities",
        })
      )
    ).toBe(true)
  })

  it("leaves regular TWAP and ordinary streams alone", () => {
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "TWAP", feedType: "Crypto", schema: "v2" }))).toBe(
      false
    )
    expect(
      shouldHideStreamFeedId(
        verifierStream({ attributeType: "247CustomPrice", feedType: "247Price", schema: "v11", assetClass: "Crypto" })
      )
    ).toBe(false)
    expect(shouldHideStreamFeedId(verifierStream({ attributeType: "EquityPrice", feedType: "Equities" }))).toBe(false)
  })
})

describe("is247TokenizedEquityFeed", () => {
  const dataFeed = (docs: Record<string, unknown>, overrides: Record<string, unknown> = {}) => ({
    contractType: "aggregator",
    ...overrides,
    docs,
  })

  it("detects non-verifier 24/7 smoothed feeds", () => {
    expect(is247TokenizedEquityFeed(dataFeed({ attributeType: "247Smoothed", assetClass: "Equities" }))).toBe(true)
    expect(is247TokenizedEquityFeed(dataFeed({ attributeType: "247CustomPrice" }))).toBe(true)
  })

  it("excludes verifier streams and ordinary tokenized equity feeds", () => {
    expect(is247TokenizedEquityFeed(dataFeed({ attributeType: "247CustomPrice" }, { contractType: "verifier" }))).toBe(
      false
    )
    expect(is247TokenizedEquityFeed(dataFeed({ attributeType: "TotalReturnMultiplier" }))).toBe(false)
  })

  it("is visible on the tokenized equity page only when opted in", () => {
    const feed = dataFeed({ attributeType: "247Smoothed", assetClass: "Equities" })

    expect(isFeedVisible(feed, "tokenizedEquity")).toBe(false)
    expect(isFeedVisible(feed, "tokenizedEquity", "", { show247TokenizedEquity: true })).toBe(true)
  })

  it("keeps the existing tokenized-equity behavior for hidden entries", () => {
    // Tokenized equity pages have always allowed hidden entries through
    // isFeedVisible; the server still drops hidden entries earlier.
    const feed = dataFeed({ attributeType: "247Smoothed", assetClass: "Equities", hidden: true })

    expect(isFeedVisible(feed, "tokenizedEquity", "", { show247TokenizedEquity: true })).toBe(true)
  })
})

describe("is247USEquitiesStream", () => {
  const usEquities = (docs: Record<string, unknown>) =>
    verifierStream({
      attributeType: "247CustomPrice",
      feedType: "247Price",
      schema: "v11",
      assetClass: "Equities",
      ...docs,
    })

  it("detects both v2 24/7 TWAP and v11 fast/slow equity streams", () => {
    expect(is247USEquitiesStream(usEquities({}))).toBe(true)
    expect(is247USEquitiesStream(usEquities({ attributeType: "247Smoothed" }))).toBe(true)
    expect(is247USEquitiesStream(usEquities({ attributeType: "247", schema: "v2" }))).toBe(true)
  })

  it("rejects non-equity 24/7 products and ordinary equity streams", () => {
    expect(is247USEquitiesStream(usEquities({ assetClass: "Futures" }))).toBe(false)
    expect(is247USEquitiesStream(usEquities({ assetClass: "Forex" }))).toBe(false)
    expect(is247USEquitiesStream(usEquities({ attributeType: "EquityPrice" }))).toBe(false)
  })

  it("filters rows only when the 24/7 US Equities filter is on", () => {
    const ordinary = verifierStream({ attributeType: "EquityPrice", feedType: "Equities" })
    const v2 = usEquities({ attributeType: "247", schema: "v2" })

    expect(matches247USEquitiesStreamFilter(ordinary, false)).toBe(true)
    expect(matches247USEquitiesStreamFilter(ordinary, true)).toBe(false)
    expect(matches247USEquitiesStreamFilter(usEquities({}), true)).toBe(true)
    expect(matches247USEquitiesStreamFilter(v2, true)).toBe(true)
  })

  it("makes v2 24/7 equity streams visible on the dedicated page", () => {
    const v2 = verifierStream({ attributeType: "247", feedType: "247Price", schema: "v2", assetClass: "Equities" })

    expect(isFeedVisible(v2, "streamsRwa", "", { show247USEquities: true })).toBe(true)
  })

  it("splits the 24/7 equity family into product sections", () => {
    const twap = usEquities({ attributeType: "247", schema: "v2" })
    const perps = usEquities({ attributeType: "247Perps" })
    const lending = usEquities({ attributeType: "247CustomPrice" })

    expect(matches247USEquitiesStreamFilter(twap, true, "twap")).toBe(true)
    expect(matches247USEquitiesStreamFilter(twap, true, "perps")).toBe(false)
    expect(matches247USEquitiesStreamFilter(perps, true, "perps")).toBe(true)
    expect(matches247USEquitiesStreamFilter(perps, true, "twap")).toBe(false)
    expect(matches247USEquitiesStreamFilter(lending, true, "lending")).toBe(true)
    expect(matches247USEquitiesStreamFilter(lending, true, "perps")).toBe(false)
  })
})

describe("index streams", () => {
  const usIndex = verifierStream({
    assetClass: "Equities",
    assetSubClass: "Index",
    feedType: "Equities",
    marketHours: "US Equities Regular",
    schema: "v11",
  })
  const apacIndex = verifierStream({
    assetClass: "Equities",
    assetSubClass: "Index",
    feedType: "Equities",
    marketHours: "Tokyo",
    schema: "v11",
  })
  const singleName = verifierStream({
    assetClass: "Equities",
    feedType: "Equities",
    marketHours: "Tokyo",
    schema: "v11",
  })

  it("detects index streams by assetSubClass", () => {
    expect(isIndexStreamFeed(usIndex)).toBe(true)
    expect(isIndexStreamFeed(apacIndex)).toBe(true)
    expect(isIndexStreamFeed(singleName)).toBe(false)
  })

  it("groups index streams by exchange market hours", () => {
    expect(getIndexStreamRegion(usIndex)).toBe("us")
    expect(getIndexStreamRegion(apacIndex)).toBe("apac")
    expect(getIndexStreamRegion(singleName)).toBeUndefined()
  })

  it("filters rows to the requested index region", () => {
    expect(matchesIndexStreamFilter(singleName, true, "us")).toBe(false)
    expect(matchesIndexStreamFilter(apacIndex, true, "us")).toBe(false)
    expect(matchesIndexStreamFilter(usIndex, true, "us")).toBe(true)
    expect(matchesIndexStreamFilter(apacIndex, true, "apac")).toBe(true)
    expect(matchesIndexStreamFilter(usIndex, true)).toBe(true)
  })

  it("passes every stream through when the index filter is off", () => {
    expect(matchesIndexStreamFilter(singleName, false)).toBe(true)
    expect(matchesIndexStreamFilter(usIndex, undefined)).toBe(true)
  })

  it("keeps index streams out of the 24/5 family tables", () => {
    expect(is24x5StreamFeed(usIndex)).toBe(false)
    expect(is24x5StreamFeed(verifierStream({ assetSubClass: "Regular Hours", schema: "v11" }))).toBe(true)
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
