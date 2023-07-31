import { useState } from "preact/hooks"
import "./dropdown.css"
import { CostTable } from "./CostTable"
import { Dropdown } from "./Dropdown"
import { vrfChain, network } from "~/features/vrf/v2/data"

interface Props {
  placeholder?: string
  options: vrfChain[]
  method: "subscription" | "directFunding"
}

export const DropDownMenu = ({ placeholder = "Select a network...", options, method }: Props) => {
  const [selectedMainChain, setSelectedMainChain] = useState<vrfChain | null>(null)
  const [selectedChain, setSelectedChain] = useState<network | null>(null)
  const [selectedNet, setSelectNet] = useState<string>(placeholder)

  return (
    <div className="main-container">
      <Dropdown
        placeholder={placeholder}
        setSelectedMainChain={setSelectedMainChain}
        setSelectedChain={setSelectedChain}
        setSelectNet={setSelectNet}
        options={options}
      />
      {selectedNet !== placeholder && <CostTable method={method} mainChain={selectedMainChain} chain={selectedChain} />}
    </div>
  )
}
