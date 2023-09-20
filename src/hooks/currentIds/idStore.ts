import { atom } from "nanostores"

export const currentIds = atom<Record<string, boolean>>({})
