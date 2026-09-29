/** @jsxImportSource preact */
import { atom } from "nanostores"
import type { JSX } from "preact"

export enum DrawerWidth {
  Default = "default",
  Wide = "wide",
}

export const drawerContentStore = atom<(() => JSX.Element) | null>(null)
export const drawerWidthStore = atom<DrawerWidth>(DrawerWidth.Default)
