export interface CommunityEvent {
  id: string
  title: string
  date: string // ISO date string
  month: string
  day: string
  location: string
  country: string
  flagUrl: string
  eventUrl: string
  backgroundColor?: string
}

export interface GalleryImage {
  id: string
  imageUrl: string
  alt: string
}
