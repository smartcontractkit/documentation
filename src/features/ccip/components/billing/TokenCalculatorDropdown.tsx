/** @jsxImportSource preact */
import { useState, useRef, useEffect } from "preact/hooks"

export const TokenCalculatorDropdown = <OptionType,>({
  options,
  placeholder,
  onSelect,
  filterFunction,
  renderOption,
  optionToString,
  stringToOption,
  style,
  disabled,
  resetTrigger,
}: {
  options: OptionType[]
  placeholder: string
  onSelect: (option: OptionType | undefined) => void
  filterFunction: (option: OptionType, filter: string) => boolean
  renderOption: (option: OptionType) => JSX.Element
  optionToString: (option: OptionType) => string
  stringToOption: (value: string) => OptionType | undefined
  style?: object
  disabled?: boolean
  resetTrigger?: boolean
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [filter, setFilter] = useState("")
  const [value, setValue] = useState("")

  useEffect(() => {
    setFilter("")
    setValue("")
  }, [resetTrigger])

  const filteredOptions = options.filter((option) => filterFunction(option, filter))

  const dropdownRef = useRef(null)

  const handleSelect = (option: OptionType) => {
    onSelect(option)
    setValue(optionToString(option))
    setIsVisible(false)
    setFilter("")
  }

  return (
    <div style={{ ...style, position: "relative", padding: 0, margin: 0 }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onInput={(e) => {
          const inputValue = e.currentTarget.value
          setFilter(inputValue)
          setValue(inputValue)
          onSelect(stringToOption(inputValue))
        }}
        onFocus={() => setIsVisible(true)}
        onBlur={() => {
          setTimeout(() => setIsVisible(false), 200)
        }}
        disabled={disabled}
        style={{ width: "100%" }}
      />
      {isVisible && !disabled && (
        <div
          ref={dropdownRef}
          style={{
            display: "block",
            position: "absolute",
            maxHeight: "20em",
            overflowY: "auto",
            width: "100%",
            left: 0,
            top: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            zIndex: 100,
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            boxSizing: "border-box",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={`${option}-${index}`}
                onClick={() => handleSelect(option)}
                style={{
                  padding: "0.5em",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  wordBreak: "break-word",
                  boxSizing: "border-box",
                }}
              >
                {renderOption(option)}
              </div>
            ))
          ) : (
            <div style={{ padding: "0.5em", textAlign: "center" }}>No matches found</div>
          )}
        </div>
      )}
    </div>
  )
}
