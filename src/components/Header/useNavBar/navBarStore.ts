import { map } from "nanostores"

export type ScrollDirection = "up" | "down"

export type NavBarInfo = {
  height: number
  scrollDirection: ScrollDirection
}

export const navBarInfo = map<NavBarInfo>({} as NavBarInfo)
