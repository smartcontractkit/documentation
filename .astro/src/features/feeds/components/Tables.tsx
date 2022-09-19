/** @jsxImportSource preact */
import h from "preact"
import { Network } from "../types"
import feedList from "./FeedList.module.css"
import { clsx } from "../../../lib"

const feedCategories = {
  verified: (
    <span
      className={clsx(feedList.hoverText, "feed-category")}
      title="Verified"
    >
      <a
        href="/docs/selecting-data-feeds/#🟢-verified-feeds"
        alt="Verified"
        target="_blank"
      >
        🟢
      </a>
    </span>
  ),
  monitored: (
    <span
      className={clsx(feedList.hoverText, "feed-category")}
      title="Monitored"
    >
      <a
        href="/docs/selecting-data-feeds/#🟡-monitored-feeds"
        alt="Monitored"
        target="_blank"
      >
        🟡
      </a>
    </span>
  ),
  custom: (
    <span className={clsx(feedList.hoverText, "feed-category")} title="Custom">
      <a
        href="/docs/selecting-data-feeds/#-custom-feeds"
        alt="Custom"
        target="_blank"
      >
        🔵
      </a>
    </span>
  ),
  specialized: (
    <span
      className={clsx(feedList.hoverText, "feed-category")}
      title="Specialized"
    >
      <a
        href="/docs/selecting-data-feeds/#-specialized-feeds"
        alt="Specialized"
        target="_blank"
      >
        ⚫
      </a>
    </span>
  ),
  deprecating: (
    <span
      className={clsx(feedList.hoverText, "feed-category")}
      title="Deprecating"
    >
      <a href="#categories" alt="Deprecating" target="_blank">
        ⭕
      </a>
    </span>
  ),
}
export const MainnetTable = ({
  network,
  showExtraDetails,
  feedType,
}: {
  network: Network
  showExtraDetails: boolean
  feedType: string
}) => {
  return (
    <table style={{ overflowX: "auto" }}>
      <thead>
        <tr>
          <th>Pair</th>
          <th>Asset</th>
          <th>Type</th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>
            Deviation
          </th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>
            Heartbeat
          </th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>Dec</th>
          <th>{feedType}</th>
        </tr>
      </thead>
      <tbody>
        {network.proxies.map((proxy) => (
          <tr id={`${network.name} ${proxy.pair}`}>
            <td>
              <div className="proxy-pair-column">
                {feedCategories[proxy.feedCategory] || ""}
                {proxy.pair}
              </div>

              {proxy.shutdownDate && (
                <>
                  <hr className="shutDate" />
                  <div className="shutDate">
                    Deprecating:
                    <br />
                    {proxy.shutdownDate}
                  </div>
                </>
              )}
            </td>
            <td>{proxy.assetName}</td>
            <td>{proxy.feedType}</td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.deviationThreshold
                ? proxy.deviationThreshold + "%"
                : "N/A"}
            </td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.heartbeat ? proxy.heartbeat : "N/A"}
            </td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.decimals ? proxy.decimals : "N/A"}
            </td>
            <td>
              <a href={network.url.replace("%s", proxy.proxy)}>{proxy.proxy}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const TestnetTable = ({
  network,
  showExtraDetails,
  feedType,
}: {
  network: Network
  showExtraDetails: boolean
  feedType: string
}) => {
  return (
    <table style={{ overflowX: "auto" }}>
      <thead>
        <tr>
          <th>Pair</th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>
            Deviation
          </th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>
            Heartbeat
          </th>
          <th className={showExtraDetails ? "" : feedList.detailHidden}>Dec</th>
          <th>{feedType}</th>
        </tr>
      </thead>
      <tbody>
        {network.proxies.map((proxy) => (
          <tr id={`${network.name} ${proxy.pair}`}>
            <td className="proxy-column">{proxy.pair}</td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.deviationThreshold
                ? proxy.deviationThreshold + "%"
                : "N/A"}
            </td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.heartbeat ? proxy.heartbeat : "N/A"}
            </td>
            <td className={showExtraDetails ? "" : feedList.detailHidden}>
              {proxy.decimals ? proxy.decimals : "N/A"}
            </td>
            <td>
              <a href={network.url.replace("%s", proxy.proxy)}>{proxy.proxy}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
