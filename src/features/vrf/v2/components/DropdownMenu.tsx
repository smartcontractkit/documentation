import { useEffect, useRef, useState } from "preact/hooks"
import "./dropdown.css"
import { CostTable } from "./CostTable"
import { vrfChain, network } from "~/features/vrf/v2/data"
import { RefObject } from "preact"
import { APIKeys } from "./Dropdown.astro"

interface Props {
  placeholder?: string
  options: vrfChain[]
  keys: APIKeys
}

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  )
}

const SubIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-arrow-right-short"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
      />
    </svg>
  )
}

export const DropDownMenu = ({ placeholder = "Select a network...", options, keys }: Props) => {
  const [selectedChain, setSelectedChain] = useState<network | null>(null)
  const [selectedNet, setSelectNet] = useState<string>(placeholder)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showSubMenu, setShowSubMenu] = useState<number>(-1)
  const wrapperRef = useRef(null)

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      /**
       * quit menu if click outside of dropdown
       */
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
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

  const handleSelectedChain = (net: network, chain: vrfChain) => {
    let res: string = chain.name + " - "
    if (chain.name === net.name) {
      res += net.type
    } else {
      res += net.name
    }

    setSelectNet(res)
  }

  useOutsideAlerter(wrapperRef)

  return (
    <div className="container">
      <div className="dropdown">
        <div className="dropdown-btn-container">
          <button
            className="dropbtn"
            onClick={() => {
              setShowMenu(!showMenu)
            }}
          >
            <p>{selectedNet}</p>
            <Icon />
          </button>
        </div>
        <div className={showMenu ? "dropdown-content show" : "dropdown-content"} ref={wrapperRef}>
          {options &&
            options.map((item: vrfChain, index: number) => (
              <div className="dropdown-item-container">
                <div
                  className="droprown-main-menu-content"
                  onMouseEnter={() => {
                    setShowSubMenu(index)
                  }}
                >
                  <a class={showMenu ? "show" : "nothing"}>{item.name}</a>
                  <div className="sub-icon-container">
                    <SubIcon />
                  </div>
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
                            handleSelectedChain(network, item)
                            setShowMenu(!showMenu)
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
      <div>{selectedNet !== placeholder && <CostTable chain={selectedChain} apiKeys={keys} />}</div>
    </div>
  )
}
