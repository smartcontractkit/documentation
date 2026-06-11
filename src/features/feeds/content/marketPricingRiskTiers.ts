import type { MarketPricingRiskTerms } from "./marketPricingRiskTerms.ts"
import { tierAnchor } from "./marketPricingRiskTerms.ts"

export type MarketPricingRiskTierBlock = {
  id: string
  icon: string
  title: string
  leadParagraphs: string[]
  bullets?: string[]
  closingParagraphs: string[]
}

function riskFooter(terms: MarketPricingRiskTerms, tierLabel: string, includeCustom = true): string {
  const customNote = includeCustom
    ? ` For users integrating a custom ${terms.productSingular}, please review the [${terms.customListLabel}](${terms.customSectionHref}) section for additional considerations.`
    : ""

  return `Developers remain responsible for ensuring that protocol [risk parameters are configured appropriately](${terms.riskMitigationHref}) and that the operation and performance of ${tierLabel} match expectations.${customNote}`
}

export function getMarketPricingRiskTiers(terms: MarketPricingRiskTerms): MarketPricingRiskTierBlock[] {
  const shutdownPolicyLink =
    terms.anchorSuffix === "feeds"
      ? "[Data Feed Shutdown Policy](#data-feed-shutdown-policy)"
      : `[stream deprecation policy](${terms.deprecatingPage})`

  return [
    {
      id: tierAnchor("low", terms).slice(1),
      icon: "🟢",
      title: `Low Market Pricing Risk ${capitalize(terms.productPlural)}`,
      leadParagraphs: [
        `These are data ${terms.productPlural} that follow a standardized data ${terms.productPlural} workflow to report market prices for an asset pair. Chainlink node operators each query several sources for the market price and aggregate the estimates provided by those sources.`,
        `Low Market Pricing Risk ${terms.productPlural} have the following characteristics:`,
      ],
      bullets: [
        `More resilient to disruption than other ${terms.productPlural}`,
        "Leverage multiple data sources when they are available",
        "Higher volumes across multiple markets enables price discovery",
      ],
      closingParagraphs: [
        `While Market Pricing Risk may be categorized as low, other risks might still exist based on your use case, data provider availability or performance, the blockchain on which the ${terms.productSingular} is deployed, and the conditions on that chain. ${riskFooter(terms, `Low Market Pricing Risk ${terms.productName.toLowerCase()}`)}`,
      ],
    },
    {
      id: tierAnchor("medium", terms).slice(1),
      icon: "🟡",
      title: `Medium Market Pricing Risk ${capitalize(terms.productPlural)}`,
      leadParagraphs: [
        `These ${terms.productPlural} also follow a standardized data ${terms.productPlural} workflow to report market prices for an asset pair. The pair in question may have features that make it more challenging to reliably price, or potentially subject it to volatility, which may pose a risk in some use cases. While the architecture of these ${terms.productPlural} is resilient and distributed, these ${terms.productPlural} carry additional Market Pricing Risk.`,
        `Types of Market Pricing Risk that may lead to a ${terms.productSingular} being categorized as Medium Market Pricing Risk include:`,
      ],
      bullets: [
        "Lower or inconsistent asset volume may result in periods of low liquidity in the market for such assets. This, in turn, can lead to volatile price movements.",
        "A spread between the price for this asset on different trading venues or liquidity pools.",
        `Market Concentration Risk: If the volume for a given asset is excessively concentrated on a single exchange, that trading venue could become a single point of failure for the ${terms.productSingular}.`,
        "Cross-Rate Risk: The base asset trades in large volumes against assets that are not pegged to the quote asset. As a result, the price of this specific asset pair may fluctuate even if the underlying asset is not being traded.",
        "The asset is going through a significant market event such as a token or liquidity migration.",
        "The asset has a high spread between data providers, the root cause of which is often one of the above factors.",
        "The availability of pricing sources may be subject to change based on concentration, trading venue location, and currency pairs.",
      ],
      closingParagraphs: [riskFooter(terms, `Medium Market Pricing Risk ${terms.productName.toLowerCase()}`)],
    },
    {
      id: tierAnchor("high", terms).slice(1),
      icon: "🟠",
      title: `High Market Pricing Risk ${capitalize(terms.productPlural)}`,
      leadParagraphs: [
        `These ${terms.productPlural} also follow a standardized data ${terms.productPlural} workflow to report market prices for an asset pair. However, the pair in question often exhibits a heightened degree of some of the risk factors outlined under Medium Market Pricing Risk, or a separate risk that makes the market price subject to uncertainty or volatility. In using a High Market Pricing Risk data ${terms.productSingular} you acknowledge that you understand the risks associated with such a ${terms.productSingular} and that you are solely responsible for monitoring and mitigating such risks.`,
      ],
      closingParagraphs: [
        `${riskFooter(terms, `High Market Pricing Risk ${terms.productName.toLowerCase()}`)} High Market Pricing Risk ${terms.productPlural} may be deprecated. See the ${shutdownPolicyLink} for more information.`,
      ],
    },
    {
      id: tierAnchor("very-high", terms).slice(1),
      icon: "🔴",
      title: `Very High Market Pricing Risk ${capitalize(terms.productPlural)}`,
      leadParagraphs: [
        `Very High Market Pricing Risk ${terms.productPlural} price assets with quotes that are subject to extreme levels of risk, greater than those outlined above for High Market Pricing Risk. Types of Market Pricing Risk that may lead to a ${terms.productSingular} being categorized as Very High Market Pricing Risk include, but are not limited to:`,
      ],
      bullets: [
        "The asset is going through a significant market event such as a hack, bridge failure, or a delisting from a major exchange.",
        "The asset or project is being deprecated in the market.",
        "Volumes have dropped to extremely low levels.",
        "Reliable pricing sources for asset are extremely limited.",
      ],
      closingParagraphs: [
        `Users should wind down their reliance on these ${terms.productPlural} and/or implement strict capital and risk management policies accounting for extreme price and market structure volatility. Very High Market Pricing Risk ${terms.productPlural} will be wound down over time in accordance with the ${shutdownPolicyLink}. In using a Very High Market Pricing Risk data ${terms.productSingular} you acknowledge that you understand the risks associated with such a ${terms.productSingular} and that you are solely responsible for monitoring and mitigating such risks. You understand that Chainlink may not provide separate monitoring for these ${terms.productPlural}. ${riskFooter(terms, `Very High Market Pricing Risk ${terms.productName.toLowerCase()}`)}`,
      ],
    },
    {
      id: tierAnchor("new-token", terms).slice(1),
      icon: "🆕",
      title: terms.newTokenListLabel,
      leadParagraphs: [
        `When a token is newly launched, the historical data required to implement a rigorous risk assessment framework that would allow the categorization of a market data ${terms.productSingular} for that token as Low, Medium, or High Pricing Risk is unavailable. Consistent price discovery may involve an indeterminate amount of time. Users must understand the additional [market and volatility risks](${terms.evaluatingSourcesHref}) inherent with such assets. Users of ${terms.newTokenListLabel} are responsible for independently verifying the liquidity and stability of the assets priced by the ${terms.productPlural} that they use. At the end of a probationary period, the status of ${terms.newTokenListLabel} may be adjusted to Very High, High, Medium, or Low Market Pricing Risk, or in rare cases be deprecated entirely.`,
      ],
      closingParagraphs: [riskFooter(terms, terms.newTokenListLabel)],
    },
    {
      id: tierAnchor("custom", terms).slice(1),
      icon: "🔵",
      title: terms.customListLabel,
      leadParagraphs: [
        `${terms.customListLabel} are built to serve a specific use case and might not be suitable for general use or your use case's risk parameters. Users must evaluate the properties of a ${terms.productSingular} to make sure it aligns with their intended use case. [Contact the Chainlink Labs team](https://chain.link/contact?ref_id=${terms.contactRefId}) if you want more detail on any specific ${terms.productPlural} in this category.`,
      ],
      closingParagraphs:
        terms.anchorSuffix === "feeds"
          ? [
              `${terms.customListLabel} have the following categories and compositions:`,
              "If you plan on using one of these feeds and would like to get a more detailed understanding, [contact the Chainlink Labs team](https://chain.link/contact?ref_id=DataFeed). Using feeds that were not specifically designed for your use case involves risk. Their use might pose risks that could result in harm to your project. Users are responsible for thoroughly vetting and validating such deployments and determining their suitability. You bear responsibility for any manner in which you use the Chainlink Network, its software, and documentation.",
            ]
          : [
              `If you plan on using one of these ${terms.productPlural} and would like to get a more detailed understanding, [contact the Chainlink Labs team](https://chain.link/contact?ref_id=${terms.contactRefId}). Using ${terms.productPlural} that were not specifically designed for your use case involves risk. Users are responsible for thoroughly vetting and validating such deployments and determining their suitability.`,
            ],
    },
    {
      id: "-deprecating",
      icon: "⭕",
      title: "Deprecating",
      leadParagraphs: [
        `These ${terms.productPlural} are being deprecated. To find the deprecation dates for specific ${terms.productPlural}, see the [${terms.productName} Scheduled For Deprecation](${terms.deprecatingPage}) page.`,
      ],
      closingParagraphs: [],
    },
  ]
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getCategoryListItems(terms: MarketPricingRiskTerms) {
  return [
    { icon: "🟢", label: "Low Market Pricing Risk", href: tierAnchor("low", terms) },
    { icon: "🟡", label: "Medium Market Pricing Risk", href: tierAnchor("medium", terms) },
    { icon: "🟠", label: "High Market Pricing Risk", href: tierAnchor("high", terms) },
    { icon: "🔴", label: "Very High Market Pricing Risk", href: tierAnchor("very-high", terms) },
    { icon: "🆕", label: terms.newTokenListLabel, href: tierAnchor("new-token", terms) },
    { icon: "🔵", label: terms.customListLabel, href: tierAnchor("custom", terms) },
    { icon: "⭕", label: "Deprecating", href: "#-deprecating" },
  ]
}
