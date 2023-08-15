import { useState } from "preact/hooks"
import "./methodCheckbox.css"
import { DropDownMenu } from "./DropdownMenu"

export const MethodCheckbox = () => {
  const [vrfMethodUsed, setVrfMethodUsed] = useState<"vrfSubscription" | "vrfDirectFunding">("vrfSubscription")

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
            id="vrfSubscription"
            name="vrfMethod"
            value="vrfSubscription"
            checked={vrfMethodUsed === "vrfSubscription"}
            onClick={handleChange}
          />
          <label for="subscription">Subscription</label>
        </div>
        <div class="checkbox-container">
          <input
            type="radio"
            id="vrfDirectFunding"
            name="vrfMethod"
            value="vrfDirectFunding"
            checked={vrfMethodUsed === "vrfDirectFunding"}
            onClick={handleChange}
          />
          <label for="funding">Direct funding</label>
        </div>
      </div>

      <DropDownMenu method={vrfMethodUsed} />
    </div>
  )
}
