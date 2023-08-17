// TODO: Changing between mobile / desktop layout
// requires content height to be re-evaluated(?)
export class Accordion {
  el: HTMLDetailsElement
  summary: HTMLElement
  animation: Animation | null
  contentHeight = 0
  isClosing = false
  isExpanding = false
  constructor(el: HTMLDetailsElement) {
    this.el = el
    const content = el.querySelectorAll(":scope > :not(summary)")
    if (content.length === 0) {
      return
    }
    content.forEach((value) => {
      if (value.clientHeight > 0) {
        this.contentHeight += value.clientHeight
      }
    })
    if (this.contentHeight === 0) {
      /** Required to work on browsers (incl. Safari)
       * which don't count collapsed details elements as having height / width */
      this.el.open = true
      content.forEach((value) => {
        if (value.clientHeight > 0) {
          this.contentHeight += value.clientHeight
        }
      })
      this.el.open = false
    }
    this.summary = el.querySelector("summary") as HTMLElement
    this.summary.addEventListener("click", (e: MouseEvent) => this.onClick(e))
  }

  cancelIfAnimating() {
    if (this.animation) {
      this.animation.cancel()
    }
  }

  onClick(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (this.isClosing || !this.el.open) {
      this.open()
    } else if (this.isExpanding || this.el.open) {
      this.shrink()
    }
  }

  shrink() {
    this.el.toggleAttribute("expanded")
    this.isClosing = true
    const startHeight = `${this.el.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight}px`
    this.cancelIfAnimating()
    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration: 200, easing: "ease-out" }
    )
    this.animation.onfinish = () => this.onAnimationFinish(false)
    this.animation.oncancel = () => (this.isClosing = false)
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`
    this.el.open = true
    window.requestAnimationFrame(() => this.expand())
  }

  expand() {
    this.el.toggleAttribute("expanded")
    this.isExpanding = true
    const startHeight = `${this.el.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight + this.contentHeight}px`
    this.cancelIfAnimating()
    const duration = 150 + Math.min(this.contentHeight, 300)
    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration, easing: "ease-out" }
    )
    this.animation.onfinish = () => this.onAnimationFinish(true)
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  onAnimationFinish(open: boolean) {
    this.el.open = open
    this.animation = null
    this.isClosing = this.isExpanding = false
    this.el.style.height = ""
  }
}
