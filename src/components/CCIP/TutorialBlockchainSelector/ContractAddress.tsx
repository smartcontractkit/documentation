import { useStore } from "@nanostores/react"
import { laneStore, setSourceContract, setDestinationContract } from "@stores/lanes"
import type { DeployedContracts } from "@stores/lanes"
import { utils } from "ethers"
import "./ContractAddress.css"
import { useState } from "react"

interface ContractAddressProps {
  type: keyof DeployedContracts
  chain: "source" | "destination"
  placeholder?: string
}

export const ContractAddress = ({ type, chain, placeholder }: ContractAddressProps) => {
  const state = useStore(laneStore)
  const contracts = chain === "source" ? state.sourceContracts : state.destinationContracts
  const setValue = chain === "source" ? setSourceContract : setDestinationContract
  const [inputValue, setInputValue] = useState(contracts[type] || "")
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value
    setInputValue(address)
    setIsDirty(true)

    if (address === "" || utils.isAddress(address)) {
      setValue(type, address)
    }
  }

  const isValidAddress = (address: string) => {
    return address === "" || utils.isAddress(address)
  }

  const showError = isDirty && inputValue && !isValidAddress(inputValue)

  return (
    <div className="contract-address-container">
      <input
        type="string"
        spellCheck="false"
        autoComplete="off"
        value={inputValue}
        onChange={handleChange}
        onBlur={() => setIsDirty(true)}
        placeholder={placeholder || `Enter ${type} address`}
        className={`contract-address-input ${showError ? "invalid-address" : ""}`}
      />
      {showError && <div className="validation-message">⚠️ Please enter a valid Ethereum address</div>}
    </div>
  )
}
