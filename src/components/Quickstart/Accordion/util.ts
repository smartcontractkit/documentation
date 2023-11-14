export class Accordion extends HTMLElement {
  details: HTMLDetailsElement
  summary: HTMLElement
  animation: Animation | null
  isClosing = false
  isExpanding = false
  contentReference: string | null = null

  constructor() {
    super()
    this.details = this.querySelector("details") as HTMLDetailsElement
    this.summary = this.details.querySelector("summary") as HTMLElement
    this.summary.addEventListener("click", (e: MouseEvent) => this.onClick(e))
  }

  connectedCallback() {
    this.contentReference = this.getAttribute("contentReference")
  }

  cancelIfAnimating() {
    if (this.animation) {
      this.animation.cancel()
    }
  }

  onClick(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (this.isClosing || !this.details.open) {
      this.open()
    } else if (this.isExpanding || this.details.open) {
      this.shrink()
    }
  }

  shrink() {
    this.details.toggleAttribute("expanded")
    this.isClosing = true
    const startHeight = `${this.details.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight}px`
    this.cancelIfAnimating()
    this.animation = this.details.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration: 200, easing: "ease-out" }
    )
    this.animation.onfinish = () => this.onAnimationFinish(false)
    this.animation.oncancel = () => (this.isClosing = false)
  }

  open() {
    this.details.style.height = `${this.details.offsetHeight}px`
    this.details.open = true
    window.requestAnimationFrame(() => this.expand())
  }

  expand() {
    this.details.toggleAttribute("expanded")
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
    this.animation = this.details.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration, easing: "ease-out" }
    )
    this.animation.onfinish = () => this.finishAnimationAndUpdateHash()
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  onAnimationFinish(open: boolean) {
    this.details.open = open
    this.animation = null
    this.isClosing = this.isExpanding = false
    this.details.style.height = ""
  }

  finishAnimationAndUpdateHash() {
    this.onAnimationFinish(true)

    if (this.contentReference) {
      const newHash = `#${this.contentReference}`
      if (window.location.hash !== newHash) {
        window.location.hash = newHash

        // this will scroll to the content but should be adjusted due to the fixed navbar
        setTimeout(() => {
          const targetElement = document.getElementById(this.contentReference as string)
          if (targetElement) {
            const offset = 150
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }
        }, 0)
      }
    }
  }
}
