/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import { FunctionComponent } from "preact"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import GithubSlugger from "github-slugger"

const TemporaryNote: FunctionComponent<{ title: string }> = ({ title, children }) => {
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
    fontSize: "10x",
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
  return Object.keys(normalizedConfig).map((technology: SupportedTechnology) => {
    const config = normalizedConfig[technology]
    const technologyTitle = config?.title
    return !technologyTitle ? (
      <p />
    ) : (
      <SectionWrapper
        title={technologyTitle}
        idOverride={slugger.slug(technologyTitle)}
        depth={3}
        updateTOC={false}
        key={technology}
      >
        {Object.keys(config.chains).map((supportedChain: SupportedChain) => {
          const title = getTitle(supportedChain)
          const explorerUrl = getExplorer(supportedChain)
          const registryAddress = automationAddresses[supportedChain]
            ? automationAddresses[supportedChain]?.registryAddress
            : ""

          const config = chainlinkAutomationConfig[supportedChain]

          if (!(title && config && registryAddress && explorerUrl)) {
            return null
          }

          return (
            <SectionWrapper
              title={title}
              idOverride={slugger.slug(title)}
              depth={4}
              updateTOC={false}
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
  })
}
