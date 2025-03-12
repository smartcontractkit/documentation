/** @jsxImportSource preact */
import { AutomationConfig } from "./AutomationConfig.tsx"
import { chainlinkAutomationConfig, automationAddresses } from "../data/index.ts"
import { SupportedChain, SupportedTechnology } from "@config/index.ts"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils/index.ts"
import { FunctionComponent } from "preact"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper.tsx"
import GithubSlugger from "github-slugger"
import NetworkIcons from "./NetworkIcons.tsx"

const TemporaryNote: FunctionComponent<{ title: string; children: any }> = ({ title, children }) => {
  // Inline styles to mimic Aside.astro styling
  const containerStyle = {
    padding: "16px",
    gap: "16px",
    backgroundColor: "rgb(245, 247, 253)",
    border: "1px solid #eee",
    borderRadius: "4px",
    color: "#333",
    display: "flex",
    marginBottom: "14px",
  }

  const iconStyle = {
    flexShrink: 0,
    marginRight: "4px",
    marginTop: "2px",
  }

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
  }

  const titleStyle = {
    fontWeight: "700",
    textTransform: "uppercase",
    color: "rgb(22, 25, 29)",
    marginBottom: "7px",
    fontSize: "14px",
  }

  const contentTextStyle = {
    fontSize: "14px",
    fontWeight: "400",
    color: "rgb(88, 100, 116)",
  }

  return (
    <div style={containerStyle} aria-label={title}>
      <div style={iconStyle}>
        <img src="/images/info-icon.svg" alt="Note" style={{ width: "24px", height: "24px" }} />
      </div>
      <div style={contentStyle}>
        <p style={titleStyle}>{title}</p>
        <div style={contentTextStyle}>{children}</div>
      </div>
    </div>
  )
}

export const AutomationConfigList = () => {
  const slugger = new GithubSlugger()
  const normalizedConfig = normalizeConfig(chainlinkAutomationConfig)

  // Get all technologies and sort them alphabetically by their display title
  const sortedTechnologies = Object.keys(normalizedConfig)
    .filter((technology: SupportedTechnology) => normalizedConfig[technology]?.title)
    .sort((a: SupportedTechnology, b: SupportedTechnology) => {
      const titleA = normalizedConfig[a]?.title || ""
      const titleB = normalizedConfig[b]?.title || ""
      return titleA.localeCompare(titleB)
    })

  return (
    <div>
      <NetworkIcons />
      {sortedTechnologies.map((technology: SupportedTechnology) => {
        const config = normalizedConfig[technology]
        const technologyTitle = config?.title

        if (!technologyTitle) {
          return null
        }

        const sortedChains = Object.keys(config.chains)
          .filter((chain: SupportedChain) => {
            const title = getTitle(chain)
            const explorerUrl = getExplorer(chain)
            const registryAddress = automationAddresses[chain] ? automationAddresses[chain]?.registryAddress : ""
            const chainConfig = chainlinkAutomationConfig[chain]

            return title && chainConfig && registryAddress && explorerUrl
          })
          .sort((a: SupportedChain, b: SupportedChain) => {
            const titleA = getTitle(a) || ""
            const titleB = getTitle(b) || ""
            return titleA.localeCompare(titleB)
          })

        return (
          <SectionWrapper
            title={technologyTitle}
            idOverride={slugger.slug(technologyTitle)}
            depth={2}
            updateTOC={true}
            key={technology}
          >
            {sortedChains.map((supportedChain: SupportedChain) => {
              const title = getTitle(supportedChain) as string
              const explorerUrl = getExplorer(supportedChain) as any
              const registryAddress = automationAddresses[supportedChain]?.registryAddress as string
              const config = chainlinkAutomationConfig[supportedChain] as any

              return (
                <SectionWrapper
                  title={title}
                  idOverride={slugger.slug(title)}
                  depth={3}
                  updateTOC={true}
                  key={supportedChain}
                >
                  {title === "Fantom mainnet" || title === "Fantom testnet" ? (
                    <>
                      <TemporaryNote title="New Fantom upkeeps not supported">
                        Creating new Fantom upkeeps is no longer supported. Existing Fantom upkeeps are still supported.
                      </TemporaryNote>
                      <AutomationConfig
                        config={config}
                        registryAddress={registryAddress}
                        getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                      />
                    </>
                  ) : (
                    <AutomationConfig
                      config={config}
                      registryAddress={registryAddress}
                      getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                    />
                  )}
                </SectionWrapper>
              )
            })}
          </SectionWrapper>
        )
      })}
    </div>
  )
}
