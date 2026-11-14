/**
 * Markup for VaultAdapterRoute.astro: one route, without or with the adapter, drawn in full
 * against three columns. Pure HTML strings, so the Astro component (server-rendered first paint)
 * and the custom element (re-render after a control change) produce identical markup.
 */
import {
  feesLabel,
  getHubSubsteps,
  getRoute,
  getStops,
  messagesLabel,
  summarize,
  tokenLabel,
} from "./vaultAdapterRouteModel.ts"
import type { Mode, RouteNode, Scenario, Step, StopBadge } from "./vaultAdapterRouteModel.ts"

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Inline SVG line icons, 24-unit viewBox, stroked with currentColor by the stylesheet. */
export const ICONS = {
  wallet:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7V5a2 2 0 0 1 2-2h13v4M4 7h16v14H4zM20 11h-6v6h6M17 14h.01"/></svg>',
  adapter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"/></svg>',
  vault:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 7 10-5 10 5M3 8h18M5 8v11M10 8v11M14 8v11M19 8v11M2 22h20M3 19h18"/></svg>',
  switch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12H4M10 6l-6 6 6 6"/></svg>',
}

/**
 * Stop badge buttons for one drawing node. Filled = a transaction you sign, hollow = a token
 * approval. The badge for `activeStepId` is drawn selected, so the first paint already shows
 * that stops can be selected.
 */
export function renderStops(prefix: string, badges: StopBadge[] | undefined, activeStepId?: string): string {
  if (!badges || badges.length === 0) return ""
  return badges
    .map((badge) => {
      const kind = badge.hollow ? "approval" : "send"
      const what = badge.hollow ? "token approval" : "transaction you sign"
      const active = badge.stepId === activeStepId ? ' data-active="true"' : ""
      return `<button type="button" class="${prefix}-badge" data-kind="${kind}" data-step="${badge.stepId}" aria-label="Stop ${badge.number}, ${what}: ${escapeHtml(badge.title)}" title="Stop ${badge.number}: ${escapeHtml(badge.title)}"${active} disabled>${badge.number}</button>`
    })
    .join("")
}

function describeKind(step: Step): string {
  switch (step.kind) {
    case "approval":
      return "Token approval"
    case "send":
      return "You sign"
    case "switch":
      return "Wallet action"
    case "complete":
      return "Done"
    default:
      return "Automatic"
  }
}

/** The explanation panel under a row: one step of the route, in reading order. */
export function renderInspector(prefix: string, step: Step, position: number, total: number): string {
  const detail =
    step.substeps && step.substeps.length > 0
      ? ` In order: ${step.substeps.map((item) => `${item.letter}. ${item.title.toLowerCase()}`).join(", ")}.`
      : ""
  return `<span class="${prefix}-inspector-step">Step ${position} of ${total}</span> <strong>${describeKind(step)}. ${escapeHtml(step.title)}.</strong> ${escapeHtml(step.caption)}${escapeHtml(detail)}`
}

/** The lettered list of what runs inside the adapter's one hub-chain transaction. */
export function renderMicroList(prefix: string, scenario: Scenario): string {
  return getHubSubsteps(scenario)
    .map((item) => `<li><span class="${prefix}-micro-letter">${item.letter}</span>${escapeHtml(item.title)}</li>`)
    .join("")
}

/** Labels that change with the flow: what goes out, what comes back, the vault link. */
export function routeLabels(scenario: Scenario) {
  const input = tokenLabel(scenario.flow === "deposit" ? "asset" : "shares")
  const output = tokenLabel(scenario.flow === "deposit" ? "shares" : "asset")
  const summary = summarize(scenario)
  return {
    input,
    output,
    sourceWalletSub: `${input} out · ${output} back`,
    outChip: input,
    backChip: output,
    backCaption:
      scenario.mode === "adapter" ? "2nd message · CCIP fee paid by the adapter" : "2nd message · you pay the CCIP fee",
    vaultLink: `${input} ▸ · ◂ ${output}`,
    summary,
  }
}

export function stopsFor(scenario: Scenario, node: RouteNode): StopBadge[] | undefined {
  return getStops(scenario)[node]
}

const P = "vac"

export interface RouteParts {
  text: Record<string, string>
  html: Record<string, string>
}

export function routeTitle(mode: Mode): string {
  return mode === "manual" ? "Without the adapter" : "With the adapter"
}

/** One line of facts under the signature count, the same shape on both routes: CCIP messages, then fees. */
export function routeMeta(scenario: Scenario): string {
  const summary = summarize(scenario)
  return `${messagesLabel(summary)} · ${feesLabel(summary)}`
}

/**
 * Everything in one route that changes with Deposit | Redeem, keyed by `data-part` name. Only the
 * route without the adapter has `stops-hub`, and only the route with it has `micro`.
 */
export function computeParts(scenario: Scenario): RouteParts {
  const labels = routeLabels(scenario)
  const summary = labels.summary
  const steps = getRoute(scenario)
  const first = steps[0]
  const text: Record<string, string> = {
    count: String(summary.signatures),
    unit: summary.signatures === 1 ? "signature" : "signatures",
    meta: routeMeta(scenario),
    "source-sub": labels.sourceWalletSub,
    "chip-out": labels.outChip,
    "chip-back": labels.backChip,
    "back-caption": labels.backCaption,
    "vault-out": `${labels.input} ▸`,
    "vault-back": `◂ ${labels.output}`,
  }
  const html: Record<string, string> = {
    "stops-source": renderStops(P, stopsFor(scenario, "source-wallet"), first.id),
    inspector: renderInspector(P, first, 1, steps.length),
  }
  if (scenario.mode === "manual") html["stops-hub"] = renderStops(P, stopsFor(scenario, "hub-wallet"))
  else html.micro = renderMicroList(P, scenario)
  return { text, html }
}

function radio(name: string, part: string, value: string, label: string, checked: boolean): string {
  return `<label class="${P}-option"><input type="radio" name="${name}" value="${value}" data-part="${part}"${
    checked ? " checked" : ""
  } disabled><span class="${P}-option-text">${escapeHtml(label)}</span></label>`
}

function leg(mode: Mode, parts: RouteParts): string {
  const t = parts.text
  return `<div class="${P}-cell ${P}-cell-ccip">
  <div class="${P}-leg ${P}-leg-out" data-node="ccip-out">
    <span class="${P}-leg-chips"><span class="${P}-chip ${P}-chip-token" data-part="chip-out">${escapeHtml(t["chip-out"])}</span>${
      mode === "adapter"
        ? `<span class="${P}-chip ${P}-chip-payload"><span class="${P}-chip-full">+ 128-byte payload</span><span class="${P}-chip-short">+ payload</span></span>`
        : ""
    }</span>
    <span class="${P}-leg-line"><span class="${P}-leg-arrow">${ICONS.arrowRight}</span></span>
    <span class="${P}-leg-caption">1st message · you pay the CCIP fee</span>
  </div>
  <div class="${P}-leg ${P}-leg-back" data-node="ccip-back">
    <span class="${P}-leg-line ${P}-leg-dashed"><span class="${P}-leg-arrow">${ICONS.arrowLeft}</span></span>
    <span class="${P}-leg-chips"><span class="${P}-chip ${P}-chip-token" data-part="chip-back">${escapeHtml(t["chip-back"])}</span></span>
    <span class="${P}-leg-caption" data-part="back-caption">${escapeHtml(t["back-caption"])}</span>
  </div>
</div>`
}

function hubCell(mode: Mode, parts: RouteParts): string {
  const t = parts.text
  const h = parts.html
  const link = `<div class="${P}-link ${P}-link-vault" aria-hidden="true"><span data-part="vault-out">${escapeHtml(t["vault-out"])}</span><span data-part="vault-back">${escapeHtml(t["vault-back"])}</span></div>`
  const vault = `<div class="${P}-node ${P}-node-vault" data-node="vault">
    <span class="${P}-node-icon">${ICONS.vault}</span>
    <span class="${P}-node-name">ERC-4626 vault</span>
    <span class="${P}-node-sub">the vault, unchanged</span>
  </div>`
  if (mode === "manual") {
    return `<div class="${P}-cell ${P}-cell-hub">
  <div class="${P}-node ${P}-node-wallet" data-node="hub-wallet">
    <span class="${P}-stops" data-part="stops-hub">${h["stops-hub"]}</span>
    <span class="${P}-node-icon">${ICONS.wallet}</span>
    <span class="${P}-node-name">Your wallet on the hub chain</span>
    <span class="${P}-node-note">${ICONS.switch}<span>switch network · hold hub gas</span></span>
  </div>
  ${link}
  ${vault}
</div>`
  }
  return `<div class="${P}-cell ${P}-cell-hub">
  <div class="${P}-node ${P}-node-adapter" data-node="adapter">
    <span class="${P}-node-icon">${ICONS.adapter}</span>
    <span class="${P}-node-name">Adapter</span>
    <span class="${P}-node-sub">one hub-chain transaction</span>
    <ol class="${P}-micro" role="list" data-part="micro">${h.micro}</ol>
  </div>
  ${link}
  ${vault}
</div>`
}

/** The route name sits beside its signature count, and also names the whole diagram (`${uid}-title`). */
function row(uid: string, parts: RouteParts, scenario: Scenario): string {
  const { mode } = scenario
  const t = parts.text
  const h = parts.html
  const first = getRoute(scenario)[0]
  return `<div class="${P}-row" data-row="${mode}">
  <div class="${P}-row-head">
    <div class="${P}-row-titles">
      <p class="${P}-row-name" id="${uid}-title">${routeTitle(mode)}</p>
      <p class="${P}-row-count"><span class="${P}-row-number" data-part="count">${t.count}</span> <span class="${P}-row-unit" data-part="unit">${t.unit}</span></p>
      <p class="${P}-row-meta" data-part="meta">${escapeHtml(t.meta)}</p>
    </div>
  </div>
  <div class="${P}-track" data-part="track">
    <div class="${P}-cell ${P}-cell-source">
      <div class="${P}-node ${P}-node-wallet" data-node="source-wallet" data-active="true" data-token="${first.token}">
        <span class="${P}-stops" data-part="stops-source">${h["stops-source"]}</span>
        <span class="${P}-node-icon">${ICONS.wallet}</span>
        <span class="${P}-node-name">Your wallet</span>
        <span class="${P}-node-sub" data-part="source-sub">${escapeHtml(t["source-sub"])}</span>
      </div>
    </div>
    ${leg(mode, parts)}
    ${hubCell(mode, parts)}
  </div>
  <div class="${P}-inspector-row">
    <div class="${P}-steppers">
      <button type="button" class="${P}-step-btn" data-part="prev" aria-label="Previous step" disabled>${ICONS.arrowLeft}</button>
      <button type="button" class="${P}-step-btn" data-part="next" aria-label="Next step" disabled>${ICONS.arrowRight}</button>
    </div>
    <p class="${P}-inspector" role="status" aria-live="polite" aria-atomic="true" data-part="inspector">${h.inspector}</p>
  </div>
</div>`
}

/** Icon key for the marks this route draws. The network-switch entry appears only on a route that switches. */
function legend(scenario: Scenario): string {
  const switches = getRoute(scenario).some((step) => step.kind === "switch")
  const switchEntry = switches ? ` <span class="${P}-legend-switch">${ICONS.switch}</span> wallet network switch` : ""
  return `<p class="${P}-legend"><span class="${P}-badge" data-kind="send" aria-hidden="true">1</span> transaction you sign <span class="${P}-badge" data-kind="approval" aria-hidden="true">1</span> token approval${switchEntry} <span class="${P}-legend-dash"></span> second CCIP message</p>`
}

/** The interactive region. The host element and the hidden text fallback (the slot) live in the Astro file. */
export function renderRoute(uid: string, scenario: Scenario): string {
  const parts = computeParts(scenario)
  return `<div class="${P}-interactive" data-copy-exclude>
  <div class="${P}-header">
    <div class="${P}-seg" role="radiogroup" aria-label="Action">
      ${radio(`${uid}-flow`, "flow", "deposit", "Deposit", scenario.flow === "deposit")}
      ${radio(`${uid}-flow`, "flow", "redeem", "Redeem", scenario.flow === "redeem")}
    </div>
    <button type="button" class="${P}-reset" data-part="reset" disabled>Reset</button>
  </div>

  <div class="${P}-columns" aria-hidden="true">
    <span class="${P}-col ${P}-col-source">Source chain <em>you are here</em></span>
    <span class="${P}-col ${P}-col-ccip"><span class="${P}-col-full">Chainlink CCIP</span><span class="${P}-col-short">CCIP</span></span>
    <span class="${P}-col ${P}-col-hub">Hub chain <em>the vault is here</em></span>
  </div>

  ${row(uid, parts, scenario)}

  ${legend(scenario)}
</div>`
}
