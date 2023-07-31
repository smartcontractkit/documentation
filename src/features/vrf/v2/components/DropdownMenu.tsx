import "./dropdown.css"
import { CostTable } from "./CostTable"
import { Dropdown } from "./Dropdown"
import { vrfChain } from "~/features/vrf/v2/data"

interface Props {
  placeholder?: string
  options: vrfChain[]
  method: "subscription" | "directFunding"
}

export const DropDownMenu = ({ placeholder = "Select a network...", options, method }: Props) => {
  return (
    <div className="main-container">
      <Dropdown placeholder={placeholder} options={options} />
      <CostTable method={method} options={options} />
    </div>
  )
}
