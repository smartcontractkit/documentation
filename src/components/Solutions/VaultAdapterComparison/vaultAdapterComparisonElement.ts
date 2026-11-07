import { DEFAULT_SCENARIO, getRoute, isFlow } from "./vaultAdapterComparisonModel.ts"
import type { Mode, Scenario, Step } from "./vaultAdapterComparisonModel.ts"
import { ROW_MODES, computeParts, renderInspector } from "./vaultAdapterComparisonView.ts"

const TAG = "vault-adapter-comparison"
const SETTLE_MS = 210
const P = "vac"

/**
 * Both routes drawn at once. A native radio group (Deposit | Redeem) reshapes both rows. Each
 * row keeps one selected step: the numbered stops are buttons that select their step, and the
 * arrows beside the explanation move through the route in order.
 *
 * The server renders the default state (step 1 selected in both rows) from the same pure
 * functions this element calls, so connectedCallback only binds controls and seeds the memo.
 */
export class VaultAdapterComparisonElement extends HTMLElement {
  private scenario: Scenario = { flow: DEFAULT_SCENARIO.flow, mode: "manual" }
  private selected: Record<Mode, number> = { manual: 0, adapter: 0 }
  private initialized = false
  private rendered = new Map<string, string>()
  private listeners = new AbortController()

  connectedCallback() {
    if (this.initialized) return
    this.initialized = true
    const { flow } = this.dataset
    this.scenario = {
      flow: isFlow(flow) ? flow : DEFAULT_SCENARIO.flow,
      mode: "manual",
    }
    const { signal } = this.listeners

    this.querySelectorAll<HTMLInputElement>('input[data-part="flow"]').forEach((input) => {
      input.addEventListener(
        "change",
        () => {
          if (!input.checked) return
          if (isFlow(input.value)) this.scenario = { ...this.scenario, flow: input.value }
          this.render()
        },
        { signal }
      )
    })
    this.getPart<HTMLButtonElement>("reset").addEventListener(
      "click",
      () => {
        this.scenario = { ...this.scenario, flow: DEFAULT_SCENARIO.flow }
        this.render()
      },
      { signal }
    )
    for (const mode of ROW_MODES) {
      this.getPart<HTMLButtonElement>(`prev-${mode}`).addEventListener(
        "click",
        () => {
          this.select(mode, this.selected[mode] - 1)
        },
        { signal }
      )
      this.getPart<HTMLButtonElement>(`next-${mode}`).addEventListener(
        "click",
        () => {
          this.select(mode, this.selected[mode] + 1)
        },
        { signal }
      )
      this.getPart<HTMLElement>(`track-${mode}`).addEventListener(
        "click",
        (event) => {
          const badge = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-step]")
          if (!badge) return
          const index = this.rowSteps(mode).findIndex((item) => item.id === badge.dataset.step)
          if (index >= 0) this.select(mode, index)
        },
        { signal }
      )
    }

    const parts = computeParts(this.scenario)
    for (const [name, value] of Object.entries(parts.text)) this.rendered.set(`text:${name}`, value)
    for (const [name, value] of Object.entries(parts.html)) this.rendered.set(`html:${name}`, value)
    this.syncControls()
    this.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input, button").forEach((control) => {
      control.disabled = false
    })
    for (const mode of ROW_MODES) this.syncSteppers(mode)
    this.dataset.ready = "true"
  }

  disconnectedCallback() {
    this.listeners.abort()
    this.listeners = new AbortController()
    this.initialized = false
  }

  private rowSteps(mode: Mode): Step[] {
    return getRoute({ ...this.scenario, mode })
  }

  private getPart<T extends HTMLElement>(name: string): T {
    const element = this.querySelector<T>(`[data-part="${name}"]`)
    if (!element) throw new Error(`${TAG}: missing part ${name}`)
    return element
  }

  private writeText(name: string, value: string): boolean {
    if (this.rendered.get(`text:${name}`) === value) return false
    this.rendered.set(`text:${name}`, value)
    this.getPart(name).textContent = value
    return true
  }

  private writeHtml(name: string, value: string): boolean {
    if (this.rendered.get(`html:${name}`) === value) return false
    this.rendered.set(`html:${name}`, value)
    this.getPart(name).innerHTML = value
    return true
  }

  private syncControls() {
    const { flow } = this.scenario
    this.dataset.flow = flow
    this.querySelectorAll<HTMLInputElement>("input[type=radio][data-part]").forEach((input) => {
      input.checked = input.value === flow
    })
  }

  private render() {
    this.syncControls()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const parts = computeParts(this.scenario)
    for (const [name, value] of Object.entries(parts.text)) {
      if (this.writeText(name, value) && name.startsWith("count-") && !reducedMotion) this.settle(this.getPart(name))
    }
    for (const [name, value] of Object.entries(parts.html)) {
      if (name.startsWith("inspector-")) continue
      if (this.writeHtml(name, value) && !reducedMotion) this.settle(this.getPart(name))
    }
    this.querySelectorAll<HTMLButtonElement>(`.${P}-stops button`).forEach((button) => {
      button.disabled = false
    })
    for (const mode of ROW_MODES) this.select(mode, 0)
  }

  private settle(element: HTMLElement) {
    element.animate(
      [
        { opacity: 0.35, transform: "translateY(2px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: SETTLE_MS,
        easing: "ease-out",
      }
    )
  }

  private clearActive(mode: Mode) {
    const track = this.getPart<HTMLElement>(`track-${mode}`)
    track.querySelectorAll<HTMLElement>("[data-active]").forEach((node) => {
      delete node.dataset.active
      delete node.dataset.token
    })
  }

  /** Writes the explanation only when it changes, so the live region stays quiet otherwise. */
  private setInspector(mode: Mode, html: string) {
    if (this.rendered.get(`html:inspector-${mode}`) === html) return
    this.rendered.set(`html:inspector-${mode}`, html)
    this.getPart<HTMLElement>(`inspector-${mode}`).innerHTML = html
  }

  private syncSteppers(mode: Mode) {
    const last = this.rowSteps(mode).length - 1
    this.getPart<HTMLButtonElement>(`prev-${mode}`).disabled = this.selected[mode] <= 0
    this.getPart<HTMLButtonElement>(`next-${mode}`).disabled = this.selected[mode] >= last
  }

  /** Selects one step of a row: highlights its node and badge and writes its explanation. */
  private select(mode: Mode, index: number) {
    const steps = this.rowSteps(mode)
    const clamped = Math.max(0, Math.min(index, steps.length - 1))
    this.selected[mode] = clamped
    const step = steps[clamped]
    const track = this.getPart<HTMLElement>(`track-${mode}`)
    this.clearActive(mode)
    const node = track.querySelector<HTMLElement>(`[data-node="${step.node}"]`)
    if (node) {
      node.dataset.active = "true"
      node.dataset.token = step.token
    }
    if (step.number !== undefined) {
      const badge = track.querySelector<HTMLElement>(`button[data-step="${step.id}"]`)
      if (badge) badge.dataset.active = "true"
    }
    this.setInspector(mode, renderInspector(P, step, clamped + 1, steps.length))
    this.syncSteppers(mode)
  }
}

export function defineVaultAdapterComparison() {
  if (!customElements.get(TAG)) customElements.define(TAG, VaultAdapterComparisonElement)
}
