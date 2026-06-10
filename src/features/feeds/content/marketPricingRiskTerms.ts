export type MarketPricingRiskProduct = "feeds" | "streams"

export type MarketPricingRiskTerms = {
  productName: string
  productPlural: string
  productSingular: string
  categoriesHeading: string
  categoriesIntro: string
  categoriesListIntro: string
  sectionIntro: string
  newTokenListLabel: string
  customListLabel: string
  deprecatingPage: string
  riskMitigationHref: string
  evaluatingSourcesHref: string
  customSectionHref: string
  anchorSuffix: string
  contactRefId: string
}

const FEEDS_TERMS: MarketPricingRiskTerms = {
  productName: "Data Feeds",
  productPlural: "feeds",
  productSingular: "feed",
  categoriesHeading: "Data Feed Categories",
  categoriesIntro:
    "This categorization is put in place to inform users about the intended use cases of feeds and help highlight some of the inherent market integrity risks surrounding the data quality of these feeds.",
  categoriesListIntro:
    "Data feeds are grouped into the following categories based on the level of market pricing risk, based on multiple factors, from lowest to highest:",
  sectionIntro:
    "These subsections describe standard market price feeds at each pricing risk level and correspond to the [category list](#data-feed-categories) above.",
  newTokenListLabel: "New Token Feeds",
  customListLabel: "Custom Feeds",
  deprecatingPage: "/data-feeds/deprecating-feeds",
  riskMitigationHref: "#risk-mitigation",
  evaluatingSourcesHref: "#evaluating-data-sources-and-risks",
  customSectionHref: "#-custom-feeds",
  anchorSuffix: "feeds",
  contactRefId: "DataFeed",
}

const STREAMS_TERMS: MarketPricingRiskTerms = {
  productName: "Data Streams",
  productPlural: "streams",
  productSingular: "stream",
  categoriesHeading: "Data Stream Categories",
  categoriesIntro:
    "This categorization is put in place to inform users about the intended use cases of streams and help highlight some of the inherent market integrity risks surrounding the data quality of these streams.",
  categoriesListIntro:
    "Data streams are grouped into the following categories based on the level of market pricing risk, based on multiple factors, from lowest to highest:",
  sectionIntro:
    "These subsections describe standard market price streams at each pricing risk level and correspond to the [category list](#data-stream-categories) above.",
  newTokenListLabel: "New Token Streams",
  customListLabel: "Custom Streams",
  deprecatingPage: "/data-streams/deprecating-streams",
  riskMitigationHref: "/data-streams/concepts/best-practices",
  evaluatingSourcesHref: "/data-streams/developer-responsibilities#market-integrity-risks",
  customSectionHref: "#-custom-streams",
  anchorSuffix: "streams",
  contactRefId: "DataStreams",
}

export function getMarketPricingRiskTerms(product: MarketPricingRiskProduct): MarketPricingRiskTerms {
  return product === "streams" ? STREAMS_TERMS : FEEDS_TERMS
}

export function tierAnchor(tier: string, terms: MarketPricingRiskTerms): string {
  return `#-${tier}-market-pricing-risk-${terms.anchorSuffix}`
}
