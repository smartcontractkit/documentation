/** @jsxImportSource preact */
import { atom } from "nanostores"
import type { JSX } from "preact"

export const drawerContentStore = atom<(() => JSX.Element) | null>(null)
