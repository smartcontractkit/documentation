/** @jsxImportSource preact */
import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import "./dropdown.css"
import { RefObject } from "preact"
import { Chain, ChainNetwork } from "~/features/data/chains"
import useQueryString from "~/hooks/useQueryString"

interface Props {
  placeholder?: string
  options: Chain[]
}

export const Dropdown = ({ placeholder = "Select a network...", options }: Props) => {
  const [network, setNetwork] = useQueryString("network", "")
  const [searchValue, setSearchValue] = useState<string>("")
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showSubMenu, setShowSubMenu] = useState<number>(-1)
  const wrapperRef = useRef(null)

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      /**
       * quit menu if click outside of dropdown
       */
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
          setShowMenu(false)
          setShowSubMenu(-1)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside)

      // Find and set the search value based on the current network that is in the URL params.
      const currentNetwork = matchingOptions
        .flatMap((option: Chain) => option.networks)
        .find((networkObject: ChainNetwork) => networkObject.queryString === network)
      setSearchValue(currentNetwork?.name ?? "")

      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref, network])
  }

  const matchingOptions: Chain[] = useMemo(() => {
    const splittedSearchValueArr = searchValue.split(" ")
    if (splittedSearchValueArr.length >= 2) {
      return options
    }
    return options.filter((chain: Chain) => {
      return searchValue === "" ? chain : chain.label.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [searchValue, options])

  const handleSelectedChain = (net: ChainNetwork) => {
    setSearchValue(net.name)
  }

  const handleInputChange = (event: Event) => {
    const { target } = event
    if (target instanceof HTMLInputElement) {
      const inputValue = target.value
      setSearchValue(inputValue)
    }
  }

  useOutsideAlerter(wrapperRef)

  return (
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
                            setNetwork(network.queryString)
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
  )
}
