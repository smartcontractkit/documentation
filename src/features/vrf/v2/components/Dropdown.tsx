import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import "./dropdown.css"
import { vrfChain, network } from "~/features/vrf/v2/data"
import { RefObject } from "preact"

interface Props {
  placeholder?: string
  options: vrfChain[]
  setSelectedMainChain
  setSelectedChain
  setSelectNet
}

export const Dropdown = ({ placeholder, options, setSelectedMainChain, setSelectedChain, setSelectNet }: Props) => {
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

      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }

  const matchingOptions: vrfChain[] = useMemo(() => {
    const formattedSearchValue = searchValue.replaceAll(" ", "")
    const splittedSearchValueArr = formattedSearchValue.split("-")
    if (splittedSearchValueArr.length >= 2) {
      return options
    }
    return options.filter((chain: vrfChain) => {
      return searchValue === "" ? chain : chain.name.toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [searchValue, options])

  const handleSelectedChain = (net: network, chain: vrfChain) => {
    let res: string = chain.name + " - "
    if (chain.name === net.name) {
      res += net.type
    } else {
      res += net.name
    }

    setSelectNet(res)
    setSearchValue(res)
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
            matchingOptions.map((item: vrfChain, index: number) => (
              <div className="dropdown-item-container">
                <div
                  className="dropown-main-menu-content"
                  onMouseEnter={() => {
                    setShowSubMenu(index)
                  }}
                >
                  <img src={item.img} width="20" height="20" />
                  <a className={showMenu ? "show" : "nothing"}>{item.name}</a>
                </div>
                <div className="dropdown-sub-menu-content">
                  {showSubMenu === index &&
                    item.nets &&
                    item.nets.length > 0 &&
                    item.nets.map((network: network) => (
                      <div className="subdropdown-menu-container">
                        <a
                          onClick={() => {
                            setSelectedChain(network)
                            setSelectedMainChain(item)
                            handleSelectedChain(network, item)
                            setShowMenu(false)
                            setShowSubMenu(-1)
                          }}
                        >
                          {network.name !== item.name ? network.name : network.type}
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
