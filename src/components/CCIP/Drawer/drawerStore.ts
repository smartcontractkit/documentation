import { atom } from "nanostores"

export const drawerContentStore = atom<(() => JSX.Element) | null>(null)
