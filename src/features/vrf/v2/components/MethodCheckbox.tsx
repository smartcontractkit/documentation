import { useState } from "preact/hooks"
import "./methodCheckbox.css"
import { DropDownMenu } from "./DropdownMenu"
import { supportedNetworks } from "../data"

export const MethodCheckbox = ({ apiKeys }) => {
  const [vrfMethodUsed, setVrfMethodUsed] = useState<"subscription" | "directFunding">("subscription")

  const handleChange = (event) => {
    setVrfMethodUsed(event.target.value)
  }

  return (
    <div className="wrapper-container">
      <p>Choose the method you prefer to use the VRF cost calculator:</p>
      <div class="radio-container">
        <div class="checkbox-container">
          <input
            type="radio"
            id="subscription"
            name="vrfMethod"
            value="subscription"
            checked={vrfMethodUsed === "subscription"}
            onClick={handleChange}
          />
          <label for="subscription">Subscription</label>
        </div>
        <div class="checkbox-container">
          <input
            type="radio"
            id="funding"
            name="vrfMethod"
            value="directFunding"
            checked={vrfMethodUsed === "directFunding"}
            onClick={handleChange}
          />
          <label for="funding">Direct funding</label>
        </div>
      </div>
      <DropDownMenu options={supportedNetworks[vrfMethodUsed]} keys={apiKeys} />
    </div>
  )
}
