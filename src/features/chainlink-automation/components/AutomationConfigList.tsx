/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import GithubSlugger from "github-slugger"

export const AutomationConfigList = () => {
  const slugger = new GithubSlugger()
  const normalizedConfig = normalizeConfig(chainlinkAutomationConfig)
  return Object.keys(normalizedConfig).map((technology: SupportedTechnology) => {
    const config = normalizedConfig[technology]
    const technologyTitle = config.title
    return !technologyTitle ? (
      <p />
    ) : (
      <div key={technology}>
        <h3 id={slugger.slug(technologyTitle)}>{technologyTitle}</h3>
        {Object.keys(config.chains).map((supportedChain: SupportedChain) => {
          const title = getTitle(supportedChain)
          const explorerUrl = getExplorer(supportedChain)
          const registryAddress = automationAddresses[supportedChain]
            ? automationAddresses[supportedChain].registryAddress
            : ""
          return !title ? (
            <p />
          ) : (
            <div key={supportedChain}>
              <h4 id={slugger.slug(title)}>{title}</h4>
              {technologyTitle === "Optimism" && (
              <aside class="content danger astro-DUQFCLOB" aria-label="Optimism Bedrock Upgrade">
                <div class="icon astro-DUQFCLOB">
                  <img
                    src="/_astro/danger-icon.1d4263e7.svg"
                    style="width: 1.5em;height: 1.5em;"
                    alt="danger"
                    class="astro-DUQFCLOB"
                  ></img>
                </div>
                <section class="asideContent astro-DUQFCLOB">
                  <p class="title heading-100 astro-DUQFCLOB" aria-hidden="true">
                    Optimism Bedrock Upgrade
                  </p>
                  <p>
                    Optimism Mainnet will{" "}
                    <a
                      href="https://community.optimism.io/docs/developers/bedrock/explainer/"
                      target="_blank"
                      rel="noopener"
                    >
                      migrate to Bedrock
                    </a>{" "}
                    on June 6th at 16:00 UTC. During this process, Optimism Mainnet will have an estimated 2-4 hour
                    downtime as the Optimism team performs the upgrade.
                  </p>
                  <p>
                    <strong>
                      PLEASE NOTE: During the downtime, please do not consume Chainlink Data Feeds or use Chainlink
                      Automation services on Optimism Mainnet until we update you of the services availability. If you
                      are actively consuming Chainlink Data Feeds or using Chainlink Automation on Optimism, we advise
                      pausing your protocol operation in advance of the Bedrock upgrade. You can resume once Chainlink
                      services are available for use.
                    </strong>
                  </p>
                </section>
              </aside>
              )}
              <AutomationConfig
                config={chainlinkAutomationConfig[supportedChain]}
                registryAddress={registryAddress}
                getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
              />
            </div>
          )
        })}
      </div>
    )
  })
}
