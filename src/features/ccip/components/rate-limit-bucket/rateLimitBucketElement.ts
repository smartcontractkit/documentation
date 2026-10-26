import {
  AMOUNT_RANGE,
  CAPACITY_RANGE,
  CONFIG_CHANGE_STATUS,
  DRAWING,
  INITIAL_STATUS,
  RATE_RANGE,
  applyConfig,
  availableTokensAt,
  createBucket,
  describeAmountValue,
  describePreview,
  describeRefill,
  describeSliderValue,
  describeTransfer,
  errorNameChunks,
  exactTokensAt,
  formatInflow,
  formatRate,
  formatTokenAmount,
  formatTokens,
  isFullAt,
  levelToY,
  markerLayout,
  previewTransfer,
  rangeFillPercent,
  transfer,
} from "./rateLimitBucketModel.ts"
import type { BucketState, SliderRange, StatusMessage } from "./rateLimitBucketModel.ts"

export const RATE_LIMIT_BUCKET_TAG = "ccip-rate-limit-bucket"

type SliderKind = "capacity" | "rate" | "amount"

const RANGES: Record<SliderKind, SliderRange> = {
  capacity: CAPACITY_RANGE,
  rate: RATE_RANGE,
  amount: AMOUNT_RANGE,
}

/** How long the status text stays empty before a repeated result is written again (re-announces it). */
const REPEAT_ANNOUNCE_DELAY_MS = 150

interface Parts {
  sliders: Record<SliderKind, HTMLInputElement>
  values: Record<SliderKind, HTMLElement>
  liquid: SVGRectElement
  surface: SVGLineElement
  marker: SVGLineElement
  markerLabel: SVGTextElement
  maxLabel: SVGTextElement
  inflowLabel: SVGTextElement
  available: HTMLElement
  refill: HTMLElement
  previewText: HTMLElement
  status: HTMLElement
  statusTitle: HTMLElement
  statusDetail: HTMLElement
  statusError: HTMLElement
  statusCode: HTMLElement
  send: HTMLButtonElement
  reset: HTMLButtonElement
}

function requirePart<T extends Element>(root: Element, name: string): T {
  const element = root.querySelector<T>(`[data-part="${name}"]`)
  if (!element) {
    throw new Error(`${RATE_LIMIT_BUCKET_TAG}: missing [data-part="${name}"]`)
  }
  return element
}

/**
 * Interactive token bucket. The server-rendered markup (RateLimitBucket.astro) already shows the initial
 * state; this element only updates it. Rendering runs on animation frames only while the bucket is
 * refilling and visible on screen.
 */
export class RateLimitBucketElement extends HTMLElement {
  private parts: Parts | null = null
  private state: BucketState | null = null
  private frame = 0
  private visible = true
  private observer: IntersectionObserver | null = null
  private rendered = new Map<string, string>()
  private statusTimer = 0

  connectedCallback() {
    // A client script moves article nodes into <section> wrappers, so this can run more than once.
    if (!this.parts) {
      this.parts = this.queryParts()
      // Sliders moved before this script loaded must not leave stale labels.
      for (const kind of Object.keys(RANGES) as SliderKind[]) this.syncSlider(kind)
      this.state = createBucket(
        { capacity: this.sliderValue("capacity"), rate: this.sliderValue("rate") },
        performance.now()
      )
      this.bindEvents()
      this.dataset.ready = "true"
    }
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver((entries) => {
        this.visible = entries.some((entry) => entry.isIntersecting)
        if (this.visible) this.renderAndSchedule()
      })
      this.observer.observe(this)
    }
    this.renderAndSchedule()
  }

  disconnectedCallback() {
    this.observer?.disconnect()
    this.observer = null
    this.cancelFrame()
  }

  private queryParts(): Parts {
    const sliders = {
      capacity: requirePart<HTMLInputElement>(this, "capacity"),
      rate: requirePart<HTMLInputElement>(this, "rate"),
      amount: requirePart<HTMLInputElement>(this, "amount"),
    }
    const values = {
      capacity: requirePart<HTMLElement>(this, "capacity-value"),
      rate: requirePart<HTMLElement>(this, "rate-value"),
      amount: requirePart<HTMLElement>(this, "amount-value"),
    }
    return {
      sliders,
      values,
      liquid: requirePart<SVGRectElement>(this, "liquid"),
      surface: requirePart<SVGLineElement>(this, "surface"),
      marker: requirePart<SVGLineElement>(this, "marker"),
      markerLabel: requirePart<SVGTextElement>(this, "marker-label"),
      maxLabel: requirePart<SVGTextElement>(this, "max-label"),
      inflowLabel: requirePart<SVGTextElement>(this, "inflow-label"),
      available: requirePart<HTMLElement>(this, "available"),
      refill: requirePart<HTMLElement>(this, "refill"),
      previewText: requirePart<HTMLElement>(this, "preview-text"),
      status: requirePart<HTMLElement>(this, "status"),
      statusTitle: requirePart<HTMLElement>(this, "status-title"),
      statusDetail: requirePart<HTMLElement>(this, "status-detail"),
      statusError: requirePart<HTMLElement>(this, "status-error"),
      statusCode: requirePart<HTMLElement>(this, "status-code"),
      send: requirePart<HTMLButtonElement>(this, "send"),
      reset: requirePart<HTMLButtonElement>(this, "reset"),
    }
  }

  private bindEvents() {
    const parts = this.requireParts()
    parts.sliders.capacity.addEventListener("input", () => this.onConfigInput("capacity"))
    parts.sliders.rate.addEventListener("input", () => this.onConfigInput("rate"))
    parts.sliders.amount.addEventListener("input", () => {
      this.syncSlider("amount")
      this.renderAndSchedule()
    })
    parts.send.addEventListener("click", () => this.onSend())
    parts.reset.addEventListener("click", () => this.onReset())
  }

  private requireParts(): Parts {
    if (!this.parts) throw new Error(`${RATE_LIMIT_BUCKET_TAG}: not initialized`)
    return this.parts
  }

  private requireState(): BucketState {
    if (!this.state) throw new Error(`${RATE_LIMIT_BUCKET_TAG}: not initialized`)
    return this.state
  }

  private sliderValue(kind: SliderKind): number {
    return Number(this.requireParts().sliders[kind].value)
  }

  /**
   * Updates a slider's visible value and the filled part of its track, plus the assistive-technology value
   * text of the capacity and rate sliders. The amount slider's value text depends on the preview, so
   * render() writes it.
   */
  private syncSlider(kind: SliderKind) {
    const parts = this.requireParts()
    const value = this.sliderValue(kind)
    const slider = parts.sliders[kind]
    parts.values[kind].textContent = kind === "rate" ? formatRate(value) : formatTokenAmount(value)
    if (kind !== "amount") slider.setAttribute("aria-valuetext", describeSliderValue(kind, value))
    slider.style.setProperty("--rlb-fill", `${rangeFillPercent(value, RANGES[kind])}%`)
  }

  private onConfigInput(kind: "capacity" | "rate") {
    this.syncSlider(kind)
    const result = applyConfig(
      { capacity: this.sliderValue("capacity"), rate: this.sliderValue("rate") },
      performance.now()
    )
    // The slider ranges keep rate <= capacity, so an invalid config cannot be selected.
    if (!result.ok) return
    this.state = result.state
    this.showStatus(CONFIG_CHANGE_STATUS)
    this.renderAndSchedule()
  }

  private onSend() {
    const state = this.requireState()
    const result = transfer(state, this.sliderValue("amount"), performance.now())
    if (result.outcome === "accepted") {
      this.state = result.state
    }
    this.showStatus(describeTransfer(result, state), { announceRepeat: true })
    this.renderAndSchedule()
  }

  private onReset() {
    const parts = this.requireParts()
    for (const kind of Object.keys(RANGES) as SliderKind[]) {
      parts.sliders[kind].value = String(RANGES[kind].initial)
      this.syncSlider(kind)
    }
    this.state = createBucket({ capacity: CAPACITY_RANGE.initial, rate: RATE_RANGE.initial }, performance.now())
    this.showStatus(INITIAL_STATUS)
    this.renderAndSchedule()
  }

  /**
   * Writes a message into the status box (an atomic live region). An identical message is skipped, so slider
   * drags announce "Rate limit updated" once. With `announceRepeat` (Send), an identical result is emptied for
   * a moment and written again, so it is announced again and the reader sees that something happened.
   */
  private showStatus(message: StatusMessage, options: { announceRepeat?: boolean } = {}) {
    const parts = this.requireParts()
    const key = `${message.tone}|${message.title}|${message.detail}|${message.error ?? ""}`
    const repeat = this.rendered.get("status") === key
    if (repeat && !options.announceRepeat) return
    this.rendered.set("status", key)
    window.clearTimeout(this.statusTimer)
    this.statusTimer = 0
    parts.status.dataset.tone = message.tone

    const apply = () => {
      this.statusTimer = 0
      parts.statusTitle.textContent = message.title
      parts.statusDetail.textContent = message.detail
      // Word break opportunities between the words of the error name, for narrow screens.
      const nodes: (string | Node)[] = []
      errorNameChunks(message.error ?? "").forEach((chunk, index) => {
        if (index > 0) nodes.push(document.createElement("wbr"))
        nodes.push(chunk)
      })
      parts.statusCode.replaceChildren(...nodes)
      parts.statusError.hidden = !message.error
      parts.status.style.minHeight = ""
    }

    if (!repeat) {
      apply()
      return
    }
    // Keep the box height while it is empty, so the page does not jump.
    parts.status.style.minHeight = `${parts.status.offsetHeight}px`
    parts.statusTitle.textContent = ""
    parts.statusDetail.textContent = ""
    parts.statusError.hidden = true
    this.statusTimer = window.setTimeout(apply, REPEAT_ANNOUNCE_DELAY_MS)
  }

  /** Writes `value` into `apply` only when it changed since the last frame. */
  private write(key: string, value: string, apply: (value: string) => void) {
    if (this.rendered.get(key) === value) return
    this.rendered.set(key, value)
    apply(value)
  }

  private render(now: number) {
    const parts = this.requireParts()
    const state = this.requireState()
    const amount = this.sliderValue("amount")

    const surfaceY = String(levelToY(exactTokensAt(state, now), state.capacity))
    this.write("surface", surfaceY, (y) => {
      parts.liquid.setAttribute("y", y)
      parts.liquid.setAttribute("height", String(Math.max(0, DRAWING.innerBottom - Number(y))))
      parts.surface.setAttribute("y1", y)
      parts.surface.setAttribute("y2", y)
    })

    this.write("available", formatTokens(availableTokensAt(state, now)), (text) => {
      parts.available.textContent = text
    })
    this.write("refill", describeRefill(state, now), (text) => {
      parts.refill.textContent = text
    })
    this.write("refilling", String(!isFullAt(state, now)), (refilling) => {
      this.dataset.refilling = refilling
    })
    this.write("inflow", formatInflow(state.rate), (text) => {
      parts.inflowLabel.textContent = text
    })

    const marker = markerLayout(amount, state.capacity)
    this.write("marker", `${marker.lineStartX}|${marker.lineY}|${marker.labelY}|${marker.label}`, () => {
      parts.marker.setAttribute("x1", String(marker.lineStartX))
      parts.marker.setAttribute("y1", String(marker.lineY))
      parts.marker.setAttribute("y2", String(marker.lineY))
      parts.markerLabel.setAttribute("y", String(marker.labelY))
      parts.markerLabel.textContent = marker.label
      parts.maxLabel.style.visibility = marker.showMaxLabel ? "" : "hidden"
    })

    const preview = previewTransfer(state, amount, now)
    this.write("preview-kind", preview.kind, (kind) => {
      this.dataset.preview = kind
    })
    this.write("preview-text", describePreview(preview), (text) => {
      parts.previewText.textContent = text
    })
    this.write("amount-valuetext", describeAmountValue(amount, preview.kind), (text) => {
      parts.sliders.amount.setAttribute("aria-valuetext", text)
    })
  }

  /** Renders at `now` and keeps animating only if the bucket was still refilling at that same moment. */
  private renderAndSchedule(now = performance.now()) {
    this.render(now)
    this.schedule(now)
  }

  private schedule(renderedAt: number) {
    if (this.frame !== 0 || !this.visible || !this.isConnected) return
    if (isFullAt(this.requireState(), renderedAt)) return
    this.frame = requestAnimationFrame(() => {
      this.frame = 0
      this.renderAndSchedule(performance.now())
    })
  }

  private cancelFrame() {
    if (this.frame !== 0) {
      cancelAnimationFrame(this.frame)
      this.frame = 0
    }
  }
}
