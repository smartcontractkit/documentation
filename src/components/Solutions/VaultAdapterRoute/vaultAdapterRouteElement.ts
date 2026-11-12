import { DEFAULT_SCENARIO, getRoute, isFlow, isMode } from "./vaultAdapterRouteModel.ts"
import type { Flow, Scenario, Step } from "./vaultAdapterRouteModel.ts"
import { computeParts, renderInspector } from "./vaultAdapterRouteView.ts"

const TAG = "vault-adapter-route"
/** Dispatched (bubbling) by the route a reader switches, so every other route on the page follows. */
const FLOW_EVENT = "vault-adapter-route:flow"
const SETTLE_MS = 210
const P = "vac"

/**
 * One route, without or with the adapter (`data-mode`). A native radio group (Deposit | Redeem)
 * reshapes it, and the other routes on the page switch with it, so the two diagrams always show
 * the same action. The route keeps one selected step: the numbered stops are buttons that select
 * their step, and the arrows beside the explanation move through the route in order.
 *
 * The server renders the default state (step 1 selected) from the same pure functions this
 * element calls, so connectedCallback only binds controls and seeds the memo.
 */
export class VaultAdapterRouteElement extends HTMLElement {
  private scenario: Scenario = DEFAULT_SCENARIO
  private selected = 0
  private initialized = false
  private rendered = new Map<string, string>()
  private listeners = new AbortController()

  connectedCallback() {
    if (this.initialized) return
    this.initialized = true
    const { flow, mode } = this.dataset
    this.scenario = {
      flow: isFlow(flow) ? flow : DEFAULT_SCENARIO.flow,
      mode: isMode(mode) ? mode : DEFAULT_SCENARIO.mode,
    }
    const { signal } = this.listeners

    this.querySelectorAll<HTMLInputElement>('input[data-part="flow"]').forEach((input) => {
      input.addEventListener(
        "change",
        () => {
          if (input.checked && isFlow(input.value)) this.chooseFlow(input.value)
        },
        { signal }
      )
    })
    this.getPart<HTMLButtonElement>("reset").addEventListener(
      "click",
      () => {
        this.chooseFlow(DEFAULT_SCENARIO.flow)
      },
      { signal }
    )
    // Another route on the page switched: follow it, without announcing it back.
    document.addEventListener(
      FLOW_EVENT,
      (event) => {
        const flow = (event as CustomEvent<{ flow?: unknown }>).detail?.flow
        if (event.target === this || !isFlow(flow) || flow === this.scenario.flow) return
        this.scenario = { ...this.scenario, flow }
        this.render()
      },
      { signal }
    )
    this.getPart<HTMLButtonElement>("prev").addEventListener(
      "click",
      () => {
        this.select(this.selected - 1)
      },
      { signal }
    )
    this.getPart<HTMLButtonElement>("next").addEventListener(
      "click",
      () => {
        this.select(this.selected + 1)
      },
      { signal }
    )
    this.getPart<HTMLElement>("track").addEventListener(
      "click",
      (event) => {
        const badge = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-step]")
        if (!badge) return
        const index = this.steps().findIndex((item) => item.id === badge.dataset.step)
        if (index >= 0) this.select(index)
      },
      { signal }
    )

    const parts = computeParts(this.scenario)
    for (const [name, value] of Object.entries(parts.text)) this.rendered.set(`text:${name}`, value)
    for (const [name, value] of Object.entries(parts.html)) this.rendered.set(`html:${name}`, value)
    // On a reconnect (the page moves both diagrams into their sections on load) the explanation
    // still shows the selected step, not step 1, so the memo must match it.
    const steps = this.steps()
    const index = Math.min(this.selected, steps.length - 1)
    this.rendered.set("html:inspector", renderInspector(P, steps[index], index + 1, steps.length))
    this.syncControls()
    this.querySelectorAll<HTMLInputElement | HTMLButtonElement>("input, button").forEach((control) => {
      control.disabled = false
    })
    this.syncSteppers()
    this.dataset.ready = "true"
  }

  disconnectedCallback() {
    this.listeners.abort()
    this.listeners = new AbortController()
    this.initialized = false
  }

  private steps(): Step[] {
    return getRoute(this.scenario)
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

  /** A reader picked Deposit or Redeem here (or pressed Reset): redraw, then tell the other routes. */
  private chooseFlow(flow: Flow) {
    this.scenario = { ...this.scenario, flow }
    this.render()
    this.dispatchEvent(new CustomEvent(FLOW_EVENT, { bubbles: true, detail: { flow } }))
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
      if (this.writeText(name, value) && name === "count" && !reducedMotion) this.settle(this.getPart(name))
    }
    for (const [name, value] of Object.entries(parts.html)) {
      if (name === "inspector") continue
      if (this.writeHtml(name, value) && !reducedMotion) this.settle(this.getPart(name))
    }
    this.querySelectorAll<HTMLButtonElement>(`.${P}-stops button`).forEach((button) => {
      button.disabled = false
    })
    this.select(0)
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

  private clearActive() {
    const track = this.getPart<HTMLElement>("track")
    track.querySelectorAll<HTMLElement>("[data-active]").forEach((node) => {
      delete node.dataset.active
      delete node.dataset.token
    })
  }

  /** Writes the explanation only when it changes, so the live region stays quiet otherwise. */
  private setInspector(html: string) {
    if (this.rendered.get("html:inspector") === html) return
    this.rendered.set("html:inspector", html)
    this.getPart<HTMLElement>("inspector").innerHTML = html
  }

  private syncSteppers() {
    const last = this.steps().length - 1
    this.getPart<HTMLButtonElement>("prev").disabled = this.selected <= 0
    this.getPart<HTMLButtonElement>("next").disabled = this.selected >= last
  }

  /** Selects one step of the route: highlights its node and badge and writes its explanation. */
  private select(index: number) {
    const steps = this.steps()
    const clamped = Math.max(0, Math.min(index, steps.length - 1))
    this.selected = clamped
    const step = steps[clamped]
    const track = this.getPart<HTMLElement>("track")
    this.clearActive()
    const node = track.querySelector<HTMLElement>(`[data-node="${step.node}"]`)
    if (node) {
      node.dataset.active = "true"
      node.dataset.token = step.token
    }
    if (step.number !== undefined) {
      const badge = track.querySelector<HTMLElement>(`button[data-step="${step.id}"]`)
      if (badge) badge.dataset.active = "true"
    }
    this.setInspector(renderInspector(P, step, clamped + 1, steps.length))
    this.syncSteppers()
  }
}

export function defineVaultAdapterRoute() {
  if (!customElements.get(TAG)) customElements.define(TAG, VaultAdapterRouteElement)
}
