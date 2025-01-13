import { useState, useCallback } from "react"
import { utils } from "ethers"
import { setSourceContract, setDestinationContract } from "@stores/lanes"
import type { DeployedContracts } from "@stores/lanes"
import "./ContractAddress.css"

interface ContractAddressProps {
  type: keyof DeployedContracts
  chain: "source" | "destination"
  placeholder: string
}

export const ContractAddress = ({ type, chain, placeholder }: ContractAddressProps) => {
  const [inputValue, setInputValue] = useState("")
  const [isValid, setIsValid] = useState(true)
  const setValue = chain === "source" ? setSourceContract : setDestinationContract

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      setInputValue(value)

      if (value === "") {
        // Reset validation and clear store when empty
        setIsValid(true)
        setValue(type, "") // Clear the store value
        return
      }

      // Validate non-empty values
      const valid = utils.isAddress(value)
      setIsValid(valid)

      // Only update store if it's a valid address
      if (valid) {
        setValue(type, value)
      } else {
        // Clear store if value becomes invalid
        setValue(type, "")
      }
    },
    [type, setValue]
  )

  return (
    <div className="contract-address-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`contract-address-input ${!isValid ? "invalid-address" : ""}`}
      />
      {!isValid && <span className="validation-message">Please enter a valid Ethereum address</span>}
    </div>
  )
}
