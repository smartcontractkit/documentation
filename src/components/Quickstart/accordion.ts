export class Accordion {
  el: HTMLDetailsElement
  summary: HTMLElement
  animation: Animation | null
  contentHeight = 0
  isClosing = false
  isExpanding = false
  constructor(el: HTMLDetailsElement) {
    this.el = el
    this.summary = el.querySelector("summary") as HTMLElement
    const content = el.querySelectorAll(":scope > :not(summary)")
    content.forEach((value) => {
      if (value.clientHeight > 0) {
        this.contentHeight += value.clientHeight
      }
    })
    this.summary.addEventListener("click", (e: MouseEvent) => this.onClick(e))
  }

  cancelIfAnimating() {
    if (this.animation) {
      this.animation.cancel()
    }
  }

  onClick(e: { preventDefault: () => void }) {
    e.preventDefault()
    this.el.style.overflow = "hidden"
    if (this.isClosing || !this.el.open) {
      this.open()
    } else if (this.isExpanding || this.el.open) {
      this.shrink()
    }
  }

  shrink() {
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
    this.isExpanding = true
    const startHeight = `${this.el.offsetHeight}px`
    const endHeight = `${this.summary.offsetHeight + this.contentHeight}px`
    this.cancelIfAnimating()
    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      { duration: 400, easing: "ease-out" }
    )
    this.animation.onfinish = () => this.onAnimationFinish(true)
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  onAnimationFinish(open: boolean) {
    this.el.open = open
    this.animation = null
    this.isClosing = this.isExpanding = false
    this.el.style.height = this.el.style.overflow = ""
  }
}
