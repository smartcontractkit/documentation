export type IconType = "token" | "remix"

export interface ILink {
  icon: IconType
  href: string
  label: string
}
export interface ICard {
  title: string
  description: string
  links?: ILink[]
}
