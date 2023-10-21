import { map } from "nanostores"

export type NavBarInfo = {
  height: number
  hidden: boolean
}

export const navBarInfo = map<NavBarInfo>({} as NavBarInfo)
