import Address from "~/components/AddressReact"
import "./Table.css"
import Tabs from "./Tabs"
import TableSearchInput from "./TableSearchInput"
import { useState } from "react"
import { getExplorerAddressUrl } from "~/features/utils"
import { drawerContentStore } from "../Drawer/drawerStore"
import LaneDrawer from "../Drawer/LaneDrawer"
import { Environment, Version } from "~/config/data/ccip/types"
import { getLane, LaneFilter } from "~/config/data/ccip"
import { SupportedChain } from "~/config"
import { clsx } from "~/lib"

interface TableProps {
  environment: Environment
  sourceNetwork: { name: string; logo: string; key: string }
  lanes: {
    name: string
    logo: string
    onRamp?: {
      address: string
      version: string
    }
    offRamp?: {
      address: string
      version: string
    }
    key: string
    directory: SupportedChain
    status: string | undefined
  }[]
  explorerUrl: string
}

function ChainTable({ lanes, explorerUrl, sourceNetwork, environment }: TableProps) {
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)
  const [search, setSearch] = useState("")

  return (
    <>
      <div className="ccip-table__filters">
        <Tabs
          tabs={[
            {
              name: "Outbound lanes",
              key: LaneFilter.Outbound,
            },
            {
              name: "Inbound lanes",
              key: LaneFilter.Inbound,
            },
          ]}
          onChange={(key) => setInOutbound(key as LaneFilter)}
        />
        <TableSearchInput search={search} setSearch={setSearch} />
      </div>
      <div className="ccip-table__wrapper">
        <table className="ccip-table">
          <thead>
            <tr>
              <th>{inOutbound === LaneFilter.Outbound ? "Destination" : "Source"} network</th>
              <th>{inOutbound === LaneFilter.Outbound ? "OnRamp" : "OffRamp"} address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lanes
              ?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase()))
              .map((network, index) => (
                <tr key={index}>
                  <td>
                    <div
                      className="ccip-table__network-name"
                      role="button"
                      onClick={() => {
                        const laneData = getLane({
                          sourceChain: sourceNetwork.key as SupportedChain,
                          destinationChain: network.key as SupportedChain,
                          environment,
                          version: Version.V1_2_0,
                        })

                        drawerContentStore.set(() => (
                          <LaneDrawer
                            environment={environment}
                            lane={laneData}
                            sourceNetwork={sourceNetwork}
                            destinationNetwork={{
                              name: network?.name || "",
                              logo: network?.logo || "",
                              key: network.key,
                            }}
                            inOutbound={inOutbound}
                            explorerUrl={explorerUrl}
                          />
                        ))
                      }}
                    >
                      <img src={network.logo} alt={network.name} className="ccip-table__logo" />
                      {network.name}
                    </div>
                  </td>
                  <td data-clipboard-type={inOutbound === LaneFilter.Outbound ? "onramp" : "offramp"}>
                    <Address
                      address={inOutbound === LaneFilter.Outbound ? network.onRamp?.address : network.offRamp?.address}
                      endLength={4}
                      contractUrl={getExplorerAddressUrl(explorerUrl)(
                        (inOutbound === LaneFilter.Outbound ? network.onRamp?.address : network.offRamp?.address) || ""
                      )}
                    />
                  </td>
                  <td>
                    <span
                      className={clsx(
                        "ccip-table__status",
                        `ccip-table__status-${network.status?.toLocaleLowerCase() || "none"}`
                      )}
                    >
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.83329 8.49996L7.16663 10.8333L11.1666 5.83329M0.666626 8.49996C0.666626 10.4449 1.43925 12.3102 2.81451 13.6854C4.18978 15.0607 6.05504 15.8333 7.99996 15.8333C9.94489 15.8333 11.8102 15.0607 13.1854 13.6854C14.5607 12.3102 15.3333 10.4449 15.3333 8.49996C15.3333 6.55504 14.5607 4.68978 13.1854 3.31451C11.8102 1.93925 9.94489 1.16663 7.99996 1.16663C6.05504 1.16663 4.18978 1.93925 2.81451 3.31451C1.43925 4.68978 0.666626 6.55504 0.666626 8.49996Z"
                          stroke="inherit"
                        />
                      </svg>
                      {network.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="ccip-table__notFound">
        {lanes.filter((network) => network.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
          <>No lanes found</>
        )}
      </div>
    </>
  )
}

export default ChainTable
