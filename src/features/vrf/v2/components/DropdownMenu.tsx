import "./dropdown.css"
import { CostTable } from "./CostTable"
import { Dropdown } from "./Dropdown"
import { CHAINS } from "~/features/data/chains"

interface Props {
  placeholder?: string
  method: "vrfSubscription" | "vrfDirectFunding"
}

export const DropDownMenu = ({ placeholder = "Select a network...", method }: Props) => {
  const options = CHAINS.filter((chain) => chain.supportedFeatures.includes(method))
  return (
    <div className="main-container">
      <div className="dropdown">
        <div className="dropdown-btn-container">
          <div style={{ position: "relative" }}>
            <input
              className="dropInput"
              placeholder={placeholder}
              value={searchValue}
              onFocus={() => {
                setShowMenu(true)
              }}
              onInput={handleInputChange}
            />
            <img
              src="https://smartcontract.imgix.net/icons/Caret2.svg"
              alt="Caret icon"
              style={{ position: "absolute", top: "30%", right: 0, transform: "translateX(-50%)" }}
            />
          </div>
        </div>
        <div className="dropdown-content-container">
          <div
            className={showMenu && matchingOptions.length ? "dropdown-content show" : "dropdown-content"}
            ref={wrapperRef}
          >
            {matchingOptions &&
              matchingOptions.map((item: Chain, index: number) => (
                <div className="dropdown-item-container">
                  <div
                    className="dropown-main-menu-content"
                    onMouseEnter={() => {
                      setShowSubMenu(index)
                    }}
                  >
                    <img src={item.img} width="20" height="20" />
                    <a className={showMenu ? "show" : "nothing"}>{item.label}</a>
                  </div>
                  <div className="dropdown-sub-menu-content">
                    {showSubMenu === index &&
                      item.networks &&
                      item.networks.length > 0 &&
                      item.networks.map((network: ChainNetwork) => (
                        <div className="subdropdown-menu-container">
                          <a
                            onClick={() => {
                              setSelectedChain(network)
                              setSelectedMainChain(item)
                              handleSelectedChain(network)
                              setShowMenu(false)
                              setShowSubMenu(-1)
                            }}
                          >
                            {network.name.includes("Mainnet")
                              ? "Mainnet"
                              : network.name.replace(`${item.label} `, "").split(" ")[0]}
                          </a>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {selectedNet !== placeholder && selectedMainChain && selectedChain && (
        <CostTable method={method} mainChain={selectedMainChain} chain={selectedChain} />
      )}
    </div>
  )
}
