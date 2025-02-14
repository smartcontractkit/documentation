import { useStore } from "@nanostores/react"
import { navBarInfo, NavBarInfo } from "./navBarStore.ts"

export const useNavBar = () => ({
  $navBarInfo: useStore(navBarInfo),
  setNavBarInfo: (info: NavBarInfo) => navBarInfo.set(info),
})
