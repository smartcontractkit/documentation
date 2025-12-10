import Address from "~/components/AddressReact.tsx"
import "./Table.css"
import Tabs from "./Tabs.tsx"
import TableSearchInput from "./TableSearchInput.tsx"
import { useEffect, useState } from "react"
import { getExplorerAddressUrl } from "~/features/utils/index.ts"
import { drawerContentStore, drawerWidthStore, DrawerWidth } from "../Drawer/drawerStore.ts"
import LaneDrawer from "../Drawer/LaneDrawer.tsx"
import { Environment, Version, LaneFilter } from "~/config/data/ccip/types.ts"
import { getLane } from "~/config/data/ccip/data.ts"
import { ExplorerInfo, SupportedChain, ChainType } from "~/config/types.ts"
import SeeMore from "../SeeMore/SeeMore.tsx"
import { Tooltip } from "~/features/common/Tooltip/Tooltip.tsx"

interface TableProps {
  environment: Environment
  sourceNetwork: {
    name: string
    logo: string
    key: string
    chainType: ChainType
  }
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
    chainType?: ChainType
  }[]
  explorer: ExplorerInfo
}

const BEFORE_SEE_MORE = 12

function ChainTable({ lanes, explorer, sourceNetwork, environment }: TableProps) {
  const [inOutbound, setInOutbound] = useState<LaneFilter>(LaneFilter.Outbound)
  const [search, setSearch] = useState("")
  const [seeMore, setSeeMore] = useState(lanes.length <= BEFORE_SEE_MORE)

  useEffect(() => {
    if (search.length > 0) {
      setSeeMore(true)
    }
  }, [search])

  return (
    <>
      <div className="ccip-table__filters ccip-table__filters--chain">
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
        <div className="ccip-table__filters__actions">
          <div className="ccip-table__filters__search-container">
            <TableSearchInput search={search} setSearch={setSearch} />
          </div>
          <a
            className="button secondary ccip-table__filters__external-button"
            href="https://ccip.chain.link/status"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/assets/icons/external-button-link.svg"
              alt=""
              className="ccip-table__filters__external-icon"
              role="presentation"
            />
            View lane status
          </a>
        </div>
      </div>
      <div className="ccip-table__wrapper">
        <table className="ccip-table">
          <thead>
            <tr>
              <th>{inOutbound === LaneFilter.Outbound ? "Destination" : "Source"} network</th>
              <th style={{ textAlign: "right" }}>
                {inOutbound === LaneFilter.Outbound ? (
                  <>
                    OnRamp address
                    {sourceNetwork.chainType === "solana" && (
                      <Tooltip
                        label=""
                        tip="Same as Router"
                        labelStyle={{ marginLeft: "8px" }}
                        style={{ display: "inline-block", verticalAlign: "middle" }}
                      />
                    )}
                  </>
                ) : (
                  "OffRamp address"
                )}
              </th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {lanes
              ?.filter((network) => network.name.toLowerCase().includes(search.toLowerCase()))
              .slice(0, seeMore ? lanes.length : BEFORE_SEE_MORE)
              .map((network, index) => (
                <tr key={index}>
                  <td>
                    <button
                      type="button"
                      className="ccip-table__network-name"
                      onClick={() => {
                        const laneData = getLane({
                          sourceChain: sourceNetwork.key as SupportedChain,
                          destinationChain: network.key as SupportedChain,
                          environment,
                          version: Version.V1_2_0,
                        })

                        drawerWidthStore.set(DrawerWidth.Wide)
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
                      aria-label={`View lane details for ${network.name}`}
                    >
                      <img src={network.logo} alt={`${network.name} blockchain logo`} className="ccip-table__logo" />
                      {network.name}
                    </button>
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    data-clipboard-type={inOutbound === LaneFilter.Outbound ? "onramp" : "offramp"}
                  >
                    <Address
                      address={inOutbound === LaneFilter.Outbound ? network.onRamp?.address : network.offRamp?.address}
                      endLength={4}
                      contractUrl={getExplorerAddressUrl(
                        explorer,
                        inOutbound === LaneFilter.Outbound ? sourceNetwork.chainType : network.chainType
                      )(
                        (inOutbound === LaneFilter.Outbound ? network.onRamp?.address : network.offRamp?.address) || ""
                      )}
                    />
                  </td>
                  <td>{inOutbound === LaneFilter.Outbound ? network.onRamp?.version : network.offRamp?.version}</td>
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
