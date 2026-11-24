/**
 * Model and custom element for RateLimitHeadroom.astro: why a token pool's inbound limit should be 10% higher than
 * the outbound limit on the other chain's pool.
 *
 * Only the A → B lane plays. Chain A's pool spends its outbound bucket when a transfer is sent; Chain B's pool spends
 * its inbound bucket when Chain B executes it. Chain A finalizes both transfers at once, so they reach Chain B closer
 * together than they left Chain A. Checked against chainlink-ccip contracts-ccip-v2.0.0 (TokenPool, RateLimiter): a
 * bucket refills at `rate` up to `capacity`, and a transfer larger than what it holds is rejected and consumes
 * nothing. "10% higher" raises capacity and rate, like the deployment tooling's 1.1x.
 */

type Mode = "ten" | "same"
type Run = "idle" | "playing" | "paused" | "done"
type TransferState = "flight" | "ok" | "fail"

interface Limit {
  capacity: number
  rate: number
}

interface Bucket extends Limit {
  tokens: number
  at: number
}

interface Send {
  t: number
  exec: number
  amount: number
}

interface Transfer {
  send: Send
  state: TransferState
}

interface Scene {
  t: number
  ms: number
  outbound: Bucket
  inbound: Bucket
  transfers: (Transfer | null)[]
}

const TAG = "ccip-rate-limit-headroom"
const OUTBOUND: Limit = { capacity: 100_000, rate: 1_000 }
const INBOUND: Record<Mode, Limit> = {
  ten: { capacity: 110_000, rate: 1_100 },
  same: { capacity: 100_000, rate: 1_000 },
}
/** `t`: Chain A sends it. `exec`: Chain B executes it. In simulated seconds. */
const SENDS: Send[] = [
  { t: 0, exec: 10, amount: 100_000 },
  { t: 8, exec: 14, amount: 8_000 },
]
const END_T = 14
const MS_PER_S = 600 // 14 simulated seconds play in 8.4 s
const END_MS = END_T * MS_PER_S + 700 // the last frame holds 0.7 s before Replay shows
const GUARD_MS = 400 // Play splits into pause and reset under the pointer, so they ignore clicks right after it

// Drawing, in px: a bucket holds 1 px per 1,000 tokens; transfers move in stage coordinates.
const PX_PER_TOKEN = 0.001
const SPAWN = 160 // a transfer leaves just below Chain A's band,
const DOCK = 212 // reaches Chain B's band when Chain B executes it,
const SINK = 34 // and sinks into the bucket if it lands
const SINK_MS = 500
const BUMP_MS = 320 // a failed transfer bumps the bucket and stays put

const BUTTON: Record<Run, { label: string; name: string; tip: string }> = {
  idle: { label: "Play", name: "Play", tip: "" },
  playing: { label: "Play", name: "Pause", tip: "Pause" },
  paused: { label: "Play", name: "Resume", tip: "Resume" },
  done: { label: "Replay", name: "Replay", tip: "" },
}
const BUCKETS = ["outA", "inB", "inA", "outB"] as const

const full = (limit: Limit): Bucket => ({ ...limit, tokens: limit.capacity, at: 0 })
const level = (bucket: Bucket, t: number) => Math.min(bucket.capacity, bucket.tokens + (t - bucket.at) * bucket.rate)
const format = (tokens: number) => Math.floor(tokens + 1e-6).toLocaleString("en-US")
const round = (value: number) => Math.round(value * 100) / 100
const smooth = (p: number) => {
  const x = Math.max(0, Math.min(1, p))
  return x * x * (3 - 2 * x)
}

function take(bucket: Bucket, amount: number, t: number): Bucket | null {
  const available = level(bucket, t)
  return amount <= available ? { ...bucket, tokens: available - amount, at: t } : null
}

/** The A → B lane `ms` after Play. Before Play, pass ms < 0. */
function sceneAt(mode: Mode, ms: number): Scene {
  const t = Math.max(0, Math.min(END_T, ms / MS_PER_S))
  let outbound = full(OUTBOUND)
  let inbound = full(INBOUND[mode])
  const transfers = SENDS.map((send): Transfer | null => {
    if (ms < 0 || send.t > t) return null
    outbound = take(outbound, send.amount, send.t) ?? outbound
    if (send.exec > t) return { send, state: "flight" }
    const landed = take(inbound, send.amount, send.exec)
    inbound = landed ?? inbound
    return { send, state: landed ? "ok" : "fail" }
  })
  return { t, ms, outbound, inbound, transfers }
}

function statusOf(mode: Mode, scene: Scene, started: boolean) {
  if (!started) {
    return {
      tone: "info",
      title: mode === "ten" ? "Both inbound limits are 10% higher" : "Inbound limits match outbound limits",
      detail: "Press Play to send two transfers from Chain A to Chain B.",
    }
  }
  const [first, second] = scene.transfers
  if (second && second.state !== "flight") {
    const gap = SENDS[1].exec - SENDS[0].exec
    const left = format(level(scene.inbound, scene.t))
    return second.state === "ok"
      ? {
          tone: "success",
          title: "Both transfers land",
          detail: `The 8,000 lands ${gap} seconds later and fits, with ${left} to spare.`,
        }
      : {
          tone: "error",
          title: "The 8,000 fails on Chain B",
          detail: `Its bucket refilled only ${left} in ${gap} seconds. The tokens already left Chain A, so someone has to execute the transfer manually later.`,
        }
  }
  if (first && first.state !== "flight") {
    const drain = mode === "ten" ? "It drains the bucket down to the extra 10%" : "It empties the bucket"
    return { tone: "info", title: "The 100,000 lands on Chain B", detail: `${drain}, and refilling starts.` }
  }
  if (second) {
    return {
      tone: "info",
      title: "Chain A sends 8,000 more",
      detail:
        "Its bucket refilled 8,000 in 8 seconds. Chain A finalizes both at once, so they reach Chain B close together.",
    }
  }
  return {
    tone: "info",
    title: "Chain A sends 100,000",
    detail: "That empties its bucket. The transfer waits until Chain A finalizes it.",
  }
}

function bucketView(bucket: Bucket, t: number) {
  const tokens = level(bucket, t)
  return {
    height: round(bucket.capacity * PX_PER_TOKEN + 2), // plus the 2 px bottom border
    liquid: round(tokens * PX_PER_TOKEN),
    amount: format(tokens),
    refilling: tokens < bucket.capacity,
  }
}

function transferView(transfer: Transfer | null, scene: Scene, index: number) {
  const amount = format(SENDS[index].amount)
  if (!transfer) return { amount, hidden: true, top: SPAWN, opacity: 1, state: "flight" }
  const { send, state } = transfer
  const since = scene.ms - send.exec * MS_PER_S // ms since Chain B executed it
  if (state === "flight") {
    const top = SPAWN + ((DOCK - SPAWN) * (scene.t - send.t)) / (send.exec - send.t)
    return { amount, hidden: false, top: round(top), opacity: 1, state }
  }
  if (state === "ok") {
    const sunk = smooth(since / SINK_MS)
    return { amount, hidden: sunk >= 1, top: round(DOCK + SINK * sunk), opacity: round(1 - sunk), state }
  }
  const bump = 6 * Math.sin(Math.PI * Math.min(1, since / BUMP_MS))
  return { amount, hidden: false, top: round(DOCK + bump), opacity: 1, state }
}

/** Everything the diagram shows for a mode, run and time. The server render and the element both use it. */
export function viewAt(mode: Mode, run: Run, ms: number) {
  const started = run !== "idle"
  const scene = sceneAt(mode, started ? ms : -1)
  return {
    outA: bucketView(scene.outbound, scene.t),
    inB: bucketView(scene.inbound, scene.t),
    inA: bucketView(full(INBOUND[mode]), 0),
    outB: bucketView(full(OUTBOUND), 0),
    rateB: `+${format(INBOUND[mode].rate)}/s`,
    transfers: scene.transfers.map((transfer, index) => transferView(transfer, scene, index)),
    clock: started ? `t = ${Math.floor(scene.t + 1e-6)} s` : "",
    status: statusOf(mode, scene, started),
    button: BUTTON[run],
  }
}

function write(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value)
}

function text(element: Element, value: string) {
  if (element.textContent !== value) element.textContent = value
}

/** Registers <ccip-rate-limit-headroom>. A function, so the server render can import viewAt from this module. */
export function defineRateLimitHeadroom() {
  if (customElements.get(TAG)) return

  /** The server render shows the idle state; this element plays the run and updates the markup in place. */
  class RateLimitHeadroomElement extends HTMLElement {
    private mode: Mode = "ten"
    private run: Run = "idle"
    private ms = 0
    private t0 = 0
    private armed = 0
    private frame = 0
    private picks: HTMLButtonElement[] = []
    private refs = new Map<string, HTMLElement>()

    connectedCallback() {
      // A client script moves article nodes into <section> wrappers, so this can run more than once.
      if (!this.picks.length) {
        this.picks = [...this.querySelectorAll<HTMLButtonElement>('[data-part="pick"]')]
        for (const pick of this.picks) {
          pick.addEventListener("click", () => this.pick(pick.dataset.mode === "same" ? "same" : "ten"))
        }
        this.ref("main").addEventListener("click", () => this.onMain())
        this.ref("reset").addEventListener("click", () => this.onReset())
      }
      if (this.run === "playing") this.schedule()
      this.render()
    }

    disconnectedCallback() {
      this.stop()
    }

    private onMain() {
      if (this.run === "playing") {
        if (performance.now() >= this.armed) this.pause()
      } else if (this.run === "paused") {
        this.t0 = performance.now() - this.ms
        this.set("playing", this.ms)
        this.schedule()
      } else {
        this.t0 = performance.now()
        this.armed = this.t0 + GUARD_MS
        this.set("playing", 0)
        this.schedule()
      }
    }

    private pause() {
      this.stop()
      const ms = Math.min(END_MS, performance.now() - this.t0)
      this.set(ms < END_MS ? "paused" : "done", ms)
    }

    private onReset() {
      if (performance.now() < this.armed) return
      this.stop()
      this.set("idle", 0)
    }

    private pick(mode: Mode) {
      if (mode === this.mode) return
      this.stop()
      this.mode = mode
      this.set("idle", 0)
    }

    private tick = () => {
      this.frame = 0
      const ms = Math.min(END_MS, performance.now() - this.t0)
      if (ms < END_MS) {
        this.ms = ms
        this.render()
        this.schedule()
      } else {
        this.set("done", END_MS)
      }
    }

    private schedule() {
      if (!this.frame) this.frame = requestAnimationFrame(this.tick)
    }

    private stop() {
      cancelAnimationFrame(this.frame)
      this.frame = 0
    }

    private set(run: Run, ms: number) {
      // Reset hides once the run stops, so hand keyboard focus to the main button first.
      if (run !== "playing" && run !== "paused" && document.activeElement === this.ref("reset")) {
        this.ref("main").focus()
      }
      this.run = run
      this.ms = ms
      this.render()
    }

    /** The element marked data-part="name". Not `part`, which HTMLElement already has. */
    private ref(name: string): HTMLElement {
      let element = this.refs.get(name)
      if (!element) {
        element = this.querySelector<HTMLElement>(`[data-part="${name}"]`) ?? undefined
        if (!element) throw new Error(`${TAG}: missing [data-part="${name}"]`)
        this.refs.set(name, element)
      }
      return element
    }

    private render() {
      const view = viewAt(this.mode, this.run, this.ms)
      write(this, "data-mode", this.mode)
      write(this, "data-run", this.run)
      for (const pick of this.picks) write(pick, "aria-pressed", String(pick.dataset.mode === this.mode))
      for (const key of BUCKETS) {
        write(this.ref(key), "style", `height: ${view[key].height}px`)
        write(this.ref(`${key}-liquid`), "style", `height: ${view[key].liquid}px`)
        text(this.ref(`${key}-amount`), view[key].amount)
      }
      write(this.ref("outA-rate"), "data-refilling", String(view.outA.refilling))
      write(this.ref("inB-rate"), "data-refilling", String(view.inB.refilling))
      text(this.ref("inB-rate"), view.rateB)
      view.transfers.forEach((transfer, index) => {
        const chip = this.ref(`transfer-${index}`)
        chip.hidden = transfer.hidden
        write(chip, "data-state", transfer.state)
        write(chip, "style", `top: ${transfer.top}px; opacity: ${transfer.opacity}`)
      })
      text(this.ref("clock"), view.clock)
      write(this.ref("status"), "data-tone", view.status.tone)
      text(this.ref("status-title"), view.status.title)
      text(this.ref("status-detail"), view.status.detail)
      text(this.ref("main-label"), view.button.label)
      write(this.ref("main"), "aria-label", view.button.name)
      write(this.ref("main"), "title", view.button.tip)
    }
  }

  customElements.define(TAG, RateLimitHeadroomElement)
}
