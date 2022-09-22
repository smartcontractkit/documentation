/** @jsxImportSource preact */
import h from "preact"
import { useEffect, useState } from "preact/hooks"
import { Addresses } from "../types"
import { MainnetTable, TestnetTable } from "./Tables"
import useFetch from "../../../hooks/useFetch"

export const FeedList = ({
  stub = "ethereum-addresses",
  ecosystem = "",
  l2healthflag = "",
  networkstatusurl,
}: {
  stub: string
  ecosystem?: string
  l2healthflag?: "arbitrum" | "optimism" | "metis" | ""
  networkstatusurl?: string
}) => {
  const [path, setPath] = useState<string | undefined>()

  useEffect(() => {
    // no window during SSG build step
    if (!window) return
    setPath(
      window.location.host === "localhost:3000"
        ? "/addresses/addresses.json"
        : window.location.host.includes("chainlinklabs.vercel.app")
        ? "https://raw.githubusercontent.com/smartcontractkit/documentation/addresses-preview/_src/addresses/addresses-preview.json"
        : "https://cl-docs-addresses.web.app/addresses.json"
    )
  }, [])

  const feeds = useFetch<Addresses>(path)
  const [showExtraDetails, setShowExtraDetails] = useState(false)

  return (
    <>
      {ecosystem === "solana" ? (
        <>
          <p>
            To learn how to implement these feeds, see the{" "}
            <a href="/docs/solana/using-data-feeds-solana/">Solana Examples</a>{" "}
            for Consuming Data Feeds.
          </p>
          <p>
            To learn how to obtain SOL tokens on the Solana Devnet, see the{" "}
            <a href="https://docs.solana.com/cli/transfer-tokens#airdrop-some-tokens-to-get-started">
              Solana Documentation
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <p>
            To learn how to implement these feeds, see the{" "}
            <a href="/docs/get-the-latest-price/">
              Ethereum Examples for Consuming Data Feeds
            </a>
            .
          </p>
          <p>
            For LINK token and Faucet details, see the{" "}
            <a href="/docs/link-token-contracts/">LINK Token Contracts</a> page.
          </p>
        </>
      )}
      <h4>Best practices for ETF and Forex feeds</h4>
      <ul>
        <li>
          Off-chain equity and ETF assets are traded only during standard market
          hours from 9:30AM to 4:00PM EDT Monday through Friday.{" "}
          <strong>Do not</strong> use these feeds outside of those windows.
        </li>
        <li>
          Assets on the Forex (Foreign Exchange) markets are traded only from
          5PM EDT on Sunday through 4PM EDT on Friday. Additionally, some
          currencies might trade only during local banking hours.{" "}
          <strong>Do not</strong> use Forex feeds outside of market hours for
          the specific currency.
        </li>
      </ul>

      <div id="categories">
        <h4>Data feed categories</h4>
        <ul>
          <li>
            🟢{" "}
            <a href="/docs/selecting-data-feeds/#🟢-verified-feeds">
              <strong>Verified Feeds</strong>
            </a>
            : Feeds that follow a standardized data feeds workflow
          </li>
          <li>
            🟡{" "}
            <a href="/docs/selecting-data-feeds/#🟡-monitored-feeds">
              <strong>Monitored Feeds</strong>
            </a>
            : Feeds under review by the Chainlink Labs team to support the
            stability of the broader ecosystem
          </li>
          <li>
            🔵{" "}
            <a href="/docs/selecting-data-feeds/#-custom-feeds">
              <strong>Custom Feeds</strong>
            </a>
            : Feeds built to serve a specific use case and might not be suitable
            for general use
          </li>
          <li>
            ⚫{" "}
            <a href="/docs/selecting-data-feeds/#-specialized-feeds">
              <strong>Specialized Feeds</strong>
            </a>
            : Purpose-built feeds that might rely on contracts maintained by
            external entities and require in-depth understanding of composition
            methodology before use
          </li>
          <li>
            ⭕{" "}
            <a href="/docs/reference-contracts/#deprecation-of-chainlink-data-feeds">
              <strong>Deprecating</strong>
            </a>
            : These feeds are scheduled for deprecation.
          </li>
        </ul>
        <p>
          See the{" "}
          <a href="/docs/selecting-data-feeds/">Selecting Quality Data Feeds</a>{" "}
          page for complete details about each category.
        </p>
      </div>

      {l2healthflag === "arbitrum" ||
        l2healthflag === "optimism" ||
        (l2healthflag === "metis" && (
          <p>
            This is an L2 network. As a best practice, use the L2 sequencer feed
            to verify the status of the sequencer when running applications on
            L2 networks. See the{" "}
            <a href="/docs/l2-sequencer-flag/">L2 Sequencer Uptime Feeds</a>{" "}
            page for examples.
          </p>
        ))}

      {networkstatusurl && (
        <div>
          <p>
            Track the status of this network at{" "}
            <a href={networkstatusurl}>{networkstatusurl}.</a>
          </p>
        </div>
      )}

      {feeds.error && "There was an error loading the feeds..."}
      {!feeds.data && "Loading..."}
      {feeds.data?.[stub]?.networks?.map((network) => (
        <div key={network.name}>
          <h2 id={network.name}>
            {network.name}{" "}
            <a className="anchor" href={`#${network.name}`}>
              <img src="/images/link.svg" alt="Link to this section" />
            </a>
          </h2>
          <label>
            <input
              type="checkbox"
              className="extra"
              checked={showExtraDetails}
              onChange={() => setShowExtraDetails((old) => !old)}
            />
            Show more details
          </label>
          {network.networkType === "mainnet" && (
            <MainnetTable
              network={network}
              showExtraDetails={showExtraDetails}
              feedType={feeds.data[stub].feedType}
            />
          )}
          {network.networkType !== "mainnet" && (
            <TestnetTable
              network={network}
              showExtraDetails={showExtraDetails}
              feedType={feeds.data[stub].feedType}
            />
          )}
        </div>
      ))}
    </>
  )
}
