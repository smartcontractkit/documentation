import { useStore } from "@nanostores/react"
import { laneStore, setSourceContract, setDestinationContract } from "@stores/lanes"
import type { DeployedContracts } from "@stores/lanes"
import { utils } from "ethers"
import "./ContractAddress.css"
import { useState, useCallback, useEffect, useMemo } from "react"

interface ContractAddressProps {
  type: keyof DeployedContracts
  chain: "source" | "destination"
  placeholder?: string
}

export const ContractAddress = ({ type, chain, placeholder }: ContractAddressProps) => {
  const state = useStore(laneStore)
  const contracts = useMemo(
    () => (chain === "source" ? state.sourceContracts : state.destinationContracts),
    [chain, state]
  )
  const setValue = useMemo(() => (chain === "source" ? setSourceContract : setDestinationContract), [chain])

  const [inputValue, setInputValue] = useState<string>(contracts[type]?.toString() || "")
  const [isDirty, setIsDirty] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const newValue = contracts[type]?.toString() || ""
    if (newValue !== inputValue) {
      setInputValue(newValue)
    }
  }, [contracts, type, inputValue])

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const address = e.target.value
      if (isUpdating || inputValue === address) return

      setInputValue(address)
      setIsDirty(true)

      if (address === "" || utils.isAddress(address)) {
        setIsUpdating(true)
        try {
          await new Promise((resolve) => setTimeout(resolve, 0))
          setValue(type, address)
        } finally {
          setIsUpdating(false)
        }
      }
    },
    [inputValue, setValue, type, isUpdating]
  )

  const isValidAddress = useCallback((address: string) => {
    return address === "" || utils.isAddress(address)
  }, [])

  const showError = isDirty && inputValue !== "" && !isValidAddress(inputValue)

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
