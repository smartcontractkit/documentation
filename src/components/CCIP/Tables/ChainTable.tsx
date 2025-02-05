import Address from "~/components/AddressReact"
import "./Table.css"
import Tabs from "./Tabs"
import TableSearchInput from "./TableSearchInput"
import { useEffect, useState } from "react"
import { getExplorerAddressUrl } from "~/features/utils"
import { drawerContentStore } from "../Drawer/drawerStore"
import LaneDrawer from "../Drawer/LaneDrawer"
import { Environment, Version } from "~/config/data/ccip/types"
import { getLane, LaneFilter } from "~/config/data/ccip"
import { ExplorerInfo, SupportedChain } from "~/config"
import { clsx } from "~/lib"
import SeeMore from "../SeeMore/SeeMore"
import { getOperationalState } from "~/config/data/ccip/data"

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
  }[]
  explorer: ExplorerInfo
}

const BEFORE_SEE_MORE = 12 // Number of networks to show before the "See more" button, 7 rows

function ChainTable({ lanes, explorer, sourceNetwork, environment }: TableProps) {
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)
  const [search, setSearch] = useState("")
  const [seeMore, setSeeMore] = useState(lanes.length <= BEFORE_SEE_MORE)
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [loadingStatuses, setLoadingStatuses] = useState<boolean>(true)

  useEffect(() => {
    if (search.length > 0) {
      setSeeMore(true)
    }
  }, [search])

  useEffect(() => {
    const fetchOperationalState = async (network) => {
      if (network) {
        const result = await getOperationalState(network)
        setStatuses(result)
        setLoadingStatuses(false)
      }
    }
    fetchOperationalState(sourceNetwork.key)
  }, [sourceNetwork])

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
              .slice(0, seeMore ? lanes.length : BEFORE_SEE_MORE)
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
                            explorer={explorer}
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
                      contractUrl={getExplorerAddressUrl(explorer)(
                        (inOutbound === LaneFilter.Outbound ? network.onRamp?.address : network.offRamp?.address) || ""
                      )}
                    />
                  </td>
                  <td>
                    {loadingStatuses ? (
                      "Loading..."
                    ) : (
                      <span
                        className={clsx(
                          "ccip-table__status",
                          `ccip-table__status-${statuses[network.key]?.toLocaleLowerCase() || "none"}`
                        )}
                      >
                        {statuses[network.key]?.toLocaleLowerCase() && (
                          <img
                            src={`/assets/icons/ccip-${statuses[network.key]?.toLocaleLowerCase()}.svg`}
                            alt="Cursed"
                          />
                        )}
                        {statuses[network.key]?.toLocaleLowerCase() || "Status unavailable"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!seeMore && <SeeMore onClick={() => setSeeMore(!seeMore)} />}
      <div className="ccip-table__notFound">
        {lanes.filter((network) => network.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
          <>No lanes found</>
        )}
      </div>
    </>
  )
}

export default ChainTable
