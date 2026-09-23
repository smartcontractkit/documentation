export class AnchoredAccordion extends HTMLElement {
  details: HTMLDetailsElement
  summary: HTMLElement
  animation: Animation | null = null
  isClosing = false
  isExpanding = false
  private onHashChange: () => void

  constructor() {
    super()
    this.details = this.querySelector("details") as HTMLDetailsElement
    this.summary = this.details.querySelector("summary") as HTMLElement
    this.summary.addEventListener("click", (e: MouseEvent) => this.onClick(e))
    // Keep the visual "expanded" state (arrow rotation) in sync when the
    // <details> is toggled outside our click handler — e.g. when find-in-page
    // auto-expands a closed accordion to reveal a search match. This only
    // mirrors the attribute; it never changes `open`, so it can't loop.
    this.details.addEventListener("toggle", () => {
      this.details.toggleAttribute("expanded", this.details.open)
    })
    this.onHashChange = () => this.checkHash()
  }

  connectedCallback() {
    this.checkHash()
    window.addEventListener("hashchange", this.onHashChange)
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onHashChange)
  }

  checkHash() {
    const hash = decodeURIComponent(location.hash.replace("#", ""))
    if (!hash) return

    if (hash === this.id) {
      this.closeOthers()
      if (!this.details.open) {
        this.openAccordion()
      }
      setTimeout(() => {
        this.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
      return
    }

    const target = this.querySelector(`#${CSS.escape(hash)}`)
    if (target) {
      if (!this.details.open) {
        this.openAccordion()
      }
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 150)
    }
  }

  closeOthers() {
    const all = document.querySelectorAll("astro-anchored-accordion")
    all.forEach((el) => {
      if (el !== this) {
        const instance = el as AnchoredAccordion
        if (instance.details?.open) {
          instance.shrink()
        }
      }
    })
  }

  cancelIfAnimating() {
    if (this.animation) {
      this.animation.cancel()
    }
  }

  onClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest("a.permalink")) return
    e.preventDefault()
    if (this.isClosing || !this.details.open) {
      this.openAccordion()
    } else if (this.isExpanding || this.details.open) {
      this.shrink()
    }
  }

  shrink() {
    this.details.toggleAttribute("expanded", false)
    this.isClosing = true
    const startHeight = `${this.details.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight}px`
    this.cancelIfAnimating()
    this.animation = this.details.animate({ height: [startHeight, endHeight] }, { duration: 200, easing: "ease-out" })
    this.animation.onfinish = () => this.onAnimationFinish(false)
    this.animation.oncancel = () => (this.isClosing = false)
  }

  openAccordion() {
    this.details.style.height = `${this.details.offsetHeight}px`
    this.details.open = true
    window.requestAnimationFrame(() => this.expand())
  }

  expand() {
    this.details.toggleAttribute("expanded", true)
    this.isExpanding = true
    let contentHeight = 0
    const content = this.details.querySelectorAll(":scope > :not(summary)")
    content.forEach((value) => {
      if (value.clientHeight > 0) {
        contentHeight += value.clientHeight
      }
    })
    const startHeight = `${this.details.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight + contentHeight}px`
    this.cancelIfAnimating()
    const duration = 250 + Math.min(contentHeight, 300)
    this.animation = this.details.animate({ height: [startHeight, endHeight] }, { duration, easing: "ease-out" })
    this.animation.onfinish = () => this.onAnimationFinish(true)
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  onAnimationFinish(open: boolean) {
    this.details.open = open
    this.details.toggleAttribute("expanded", open)
    this.animation = null
    this.isClosing = this.isExpanding = false
    this.details.style.height = ""
  }
}
