declare global {
  interface Window {
    dataLayer: Array<{
      event: string
      [key: string]: any
    }>
  }
}

export {}
