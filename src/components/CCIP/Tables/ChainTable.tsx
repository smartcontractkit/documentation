import Address from "~/components/CCIP/Address/Address"
import "./Table.css"
import Tabs from "./Tabs"
import TableSearchInput from "./TableSearchInput"

interface TableProps {
  lanes: {
    name: string
    logo: string
    onRamp?: string
  }[]
}

function ChainTable({ lanes }: TableProps) {
  return (
    <>
      <div className="ccip-table__filters">
        <Tabs
          tabs={[
            {
              name: "Outbound lanes",
              key: "outbound",
            },
            {
              name: "Inbound lanes",
              key: "inbound",
            },
          ]}
          onChange={(key) => console.log(key)}
        />
        <TableSearchInput />
      </div>
      <table className="ccip-table">
        <thead>
          <tr>
            <th>Destination network</th>
            <th>OnRamp address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lanes?.map((network, index) => (
            <tr key={index}>
              <td>
                <div className="ccip-table__network-name">
                  <img src={network.logo} alt={network.name} className="ccip-table__logo" />
                  {network.name}
                </div>
              </td>
              <td>
                <Address address={network.onRamp} endLength={4} />
              </td>
              <td>
                <span className="ccip-table__status">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.83329 8.49996L7.16663 10.8333L11.1666 5.83329M0.666626 8.49996C0.666626 10.4449 1.43925 12.3102 2.81451 13.6854C4.18978 15.0607 6.05504 15.8333 7.99996 15.8333C9.94489 15.8333 11.8102 15.0607 13.1854 13.6854C14.5607 12.3102 15.3333 10.4449 15.3333 8.49996C15.3333 6.55504 14.5607 4.68978 13.1854 3.31451C11.8102 1.93925 9.94489 1.16663 7.99996 1.16663C6.05504 1.16663 4.18978 1.93925 2.81451 3.31451C1.43925 4.68978 0.666626 6.55504 0.666626 8.49996Z"
                      stroke="#267E46"
                    />
                  </svg>
                  Operational
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default ChainTable
