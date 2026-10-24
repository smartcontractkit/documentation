/**
 * Route model for the Cross-Chain Vault Adapter comparison widget (VaultAdapterComparison.astro).
 *
 * Pure functions, no DOM. The widget renders these facts:
 *
 * - A successful, unbatched request from an EVM wallet that uses CCIP directly and
 *   pays CCIP fees in the native gas token. The user already holds the input token
 *   and gas on every chain their wallet signs on, and is the beneficiary.
 * - "Manual" is the baseline without the adapter: the user bridges the token to
 *   their own hub-chain wallet, calls the vault, and bridges the output back.
 * - Every approval is drawn and counted (a hollow stop). Router.ccipSend pulls tokens with
 *   safeTransferFrom, so each sender approves the Router it sends through. A wallet whose
 *   allowance already covers the amount skips the hollow stops.
 * - Wallet network switches, CCIP execution, and the adapter's own calls are not user
 *   transactions, but switches and hub gas are reported as facts.
 *
 * Adapter call order follows CrossChainERC4626Adapter.sol at 67c94bc:
 * ccipReceive -> processMessage -> _processTarget -> safeTransfer or sendToken.
 */

export type Flow = "deposit" | "redeem"
export type Mode = "manual" | "adapter"
export type Token = "asset" | "shares"

export interface Scenario {
  flow: Flow
  mode: Mode
}

/** Where a step happens on the drawing. */
export type RouteNode = "source-wallet" | "ccip-out" | "hub-wallet" | "adapter" | "vault" | "ccip-back"

export type StepKind = "approval" | "send" | "switch" | "automatic" | "hub-transaction" | "complete"

export interface HubSubstep {
  letter: string
  title: string
  detail: string
  call: string
}

export interface Step {
  id: string
  kind: StepKind
  chain: "source" | "transit" | "hub"
  node: RouteNode
  /** The token the user or the adapter holds at this step. */
  token: Token
  /** Stop badge number. Only signed steps (approval, send) carry one. */
  number?: number
  title: string
  /** At most 20 words. */
  caption: string
  /** Contract call shown in inline code in the sequence list. */
  call?: string
  /** The step is identical on both routes. */
  sameOnBothRoutes?: boolean
  /** Only on hub-transaction steps: what runs inside the one hub-chain transaction. */
  substeps?: HubSubstep[]
}

export interface Summary {
  /** Transactions the user's wallet signs, approvals included. */
  signatures: number
  /** Token approvals among the signatures. */
  approvals: number
  /** Signatures a wallet with existing allowances submits. */
  signaturesWithoutApprovals: number
  /** Distinct chains the wallet signs on. */
  chainsSigned: number
  /** Wallet network switches. */
  switches: number
  /** Chains the user needs the native gas token on. */
  gasChains: number
  /** CCIP messages on the route. */
  messages: number
  /** CCIP fees the user pays directly. */
  ccipFeesPaid: number
  /** Any configured adapter fee applies (adapter route). */
  adapterFeeApplies: boolean
}

export interface StopBadge {
  number: number
  hollow: boolean
  stepId: string
  title: string
}

export const FLOWS: Flow[] = ["deposit", "redeem"]
export const MODES: Mode[] = ["manual", "adapter"]

export const DEFAULT_SCENARIO: Scenario = { flow: "deposit", mode: "manual" }

export function isFlow(value: unknown): value is Flow {
  return value === "deposit" || value === "redeem"
}

export function inputToken(flow: Flow): Token {
  return flow === "deposit" ? "asset" : "shares"
}

export function outputToken(flow: Flow): Token {
  return flow === "deposit" ? "shares" : "asset"
}

export function tokenLabel(token: Token): string {
  return token === "asset" ? "asset" : "shares"
}

/** Ordered steps of one route. Signed steps are numbered from 1 in route order. */
export function getRoute(scenario: Scenario): Step[] {
  const { flow, mode } = scenario
  const input = inputToken(flow)
  const output = outputToken(flow)
  const inputWord = tokenLabel(input)
  const outputWord = tokenLabel(output)
  const steps: Step[] = []
  let number = 0
  const add = (step: Omit<Step, "number">) => {
    const signed = step.kind === "approval" || step.kind === "send"
    steps.push(signed ? { ...step, number: ++number } : step)
  }

  add({
    id: "approve-source-router",
    kind: "approval",
    chain: "source",
    node: "source-wallet",
    token: input,
    title: "Approve the source Router",
    caption: `Approve the source-chain Router to spend your ${inputWord}. Skipped when your allowance already covers the amount.`,
    call: `approve(sourceRouter, amount)`,
    sameOnBothRoutes: true,
  })

  if (mode === "manual") {
    add({
      id: "send-to-hub",
      kind: "send",
      chain: "source",
      node: "source-wallet",
      token: input,
      title: `Send the ${inputWord} to your hub wallet`,
      caption: `Send the ${inputWord} through CCIP to your own wallet on the hub chain. You pay the CCIP fee.`,
      call: `ccipSend(hubChain, { receiver: you, tokenAmounts: [${inputWord}] })`,
    })
    add({
      id: "ccip-out",
      kind: "automatic",
      chain: "transit",
      node: "ccip-out",
      token: input,
      title: "Crossing to the hub chain",
      caption: `CCIP verifies the message and delivers the ${inputWord} to your wallet on the hub chain.`,
    })
    add({
      id: "switch-network",
      kind: "switch",
      chain: "hub",
      node: "hub-wallet",
      token: input,
      title: "Switch network and hold hub gas",
      caption: "Switch your wallet to the hub chain and hold its gas token for the next transactions.",
    })
    if (flow === "deposit") {
      add({
        id: "approve-vault",
        kind: "approval",
        chain: "hub",
        node: "hub-wallet",
        token: input,
        title: "Approve the vault",
        caption: "Approve the vault to spend the asset. Skipped when your allowance already covers the amount.",
        call: `approve(vault, amount)`,
      })
    }
    add(
      flow === "deposit"
        ? {
            id: "vault-call",
            kind: "send",
            chain: "hub",
            node: "vault",
            token: output,
            title: "Deposit into the vault",
            caption: "Deposit the asset and receive shares at the vault's exchange rate at execution time.",
            call: `deposit(assets, you)`,
          }
        : {
            id: "vault-call",
            kind: "send",
            chain: "hub",
            node: "vault",
            token: output,
            title: "Redeem your shares",
            caption: "Redeem as the owner, so no vault approval is needed. The vault sends you the asset.",
            call: `redeem(shares, you, you)`,
          }
    )
    add({
      id: "approve-hub-router",
      kind: "approval",
      chain: "hub",
      node: "hub-wallet",
      token: output,
      title: "Approve the hub Router",
      caption: `Approve the hub-chain Router to spend your ${outputWord}. Skipped when your allowance already covers the amount.`,
      call: `approve(hubRouter, amount)`,
    })
    add({
      id: "send-back",
      kind: "send",
      chain: "hub",
      node: "hub-wallet",
      token: output,
      title: `Send the ${outputWord} back`,
      caption: `Send the ${outputWord} through CCIP to your wallet on the source chain. You pay this second CCIP fee.`,
      call: `ccipSend(sourceChain, { receiver: you, tokenAmounts: [${outputWord}] })`,
    })
  } else {
    add({
      id: "send-request",
      kind: "send",
      chain: "source",
      node: "source-wallet",
      token: input,
      title: `Send the ${inputWord} and instructions`,
      caption: `Send the ${inputWord} plus a 128-byte payload to the adapter. You pay the CCIP fee and sign nothing else.`,
      call: `ccipSend(hubChain, { receiver: adapter, tokenAmounts: [${inputWord}], data: payload })`,
    })
    add({
      id: "ccip-out",
      kind: "automatic",
      chain: "transit",
      node: "ccip-out",
      token: input,
      title: "Crossing to the adapter",
      caption: `CCIP verifies the message, transfers the ${inputWord} to the adapter, and calls ccipReceive.`,
    })
    add({
      id: "hub-transaction",
      kind: "hub-transaction",
      chain: "hub",
      node: "adapter",
      token: output,
      title: "One hub-chain transaction",
      caption:
        "The adapter does all of this inside the transaction that delivers your message. Nothing here needs your wallet.",
      call: "ccipReceive",
      substeps: getHubSubsteps(scenario),
    })
  }

  add({
    id: "ccip-back",
    kind: "automatic",
    chain: "transit",
    node: "ccip-back",
    token: output,
    title: "Crossing back to the source chain",
    caption:
      mode === "adapter"
        ? `CCIP verifies the return message and delivers the ${outputWord} to your source-chain wallet. No wallet transaction needed.`
        : `CCIP verifies the return message and delivers the ${outputWord} to your wallet on the source chain.`,
  })
  add({
    id: "complete",
    kind: "complete",
    chain: "source",
    node: "source-wallet",
    token: output,
    title: `Done: ${outputWord} on the source chain`,
    caption:
      mode === "adapter"
        ? `You hold the ${outputWord} in your wallet on the source chain. Your wallet never left it.`
        : `You hold the ${outputWord} in your wallet on the source chain, the chain you started on.`,
  })

  return steps
}

/** What the adapter does inside the one hub-chain transaction, in contract order. */
export function getHubSubsteps(scenario: Scenario): HubSubstep[] {
  const { flow } = scenario
  const outputWord = tokenLabel(outputToken(flow))
  const list: Omit<HubSubstep, "letter">[] = []

  list.push({
    title: "Validate",
    detail:
      flow === "deposit"
        ? "processMessage runs in try/catch: source chain allowed, one token, 128-byte payload, vault allowlisted, amount above zero, token is the vault's asset, deposits enabled."
        : "processMessage runs in try/catch: source chain allowed, one token, 128-byte payload, vault allowlisted, amount above zero, token is the vault's share token, redemptions enabled.",
    call: "processMessage",
  })

  if (flow === "deposit") {
    list.push({
      title: "Adapter fee",
      detail: "Deducts any configured adapter fee from the asset before depositing.",
      call: "_processTarget",
    })
    list.push({
      title: "Deposit",
      detail: "Approves the vault and calls deposit. The vault mints the shares to the adapter.",
      call: "deposit(assets, adapter)",
    })
  } else {
    list.push({
      title: "Redeem",
      detail: "Calls redeem as owner and receiver. The vault sends the asset to the adapter.",
      call: "redeem(shares, adapter, adapter)",
    })
    list.push({
      title: "Adapter fee",
      detail: "Deducts any configured adapter fee from the redeemed asset.",
      call: "_processTarget",
    })
  }

  list.push({
    title: "Check the output",
    detail: `Output must be nonzero and at least minimumOut. Otherwise processMessage reverts with NoOutputReceived or MinimumOutputNotMet, the vault call rolls back, and your tokens become refundable.`,
    call: "_processTarget",
  })

  list.push({
    title: "Send back",
    detail: `Approves the hub-chain Router and sends the ${outputWord} to the beneficiary named in your payload, on the source chain. The adapter pays this CCIP fee from its native balance.`,
    call: "sendToken",
  })

  return list.map((item, index) => ({ ...item, letter: String.fromCharCode(97 + index) }))
}

export function summarize(scenario: Scenario): Summary {
  const steps = getRoute(scenario)
  const signed = steps.filter((step) => step.kind === "approval" || step.kind === "send")
  const approvals = signed.filter((step) => step.kind === "approval").length
  const chainsSigned = new Set(signed.map((step) => step.chain)).size
  const switches = steps.filter((step) => step.kind === "switch").length
  const messages = 2
  const ccipFeesPaid = scenario.mode === "manual" ? 2 : 1
  return {
    signatures: signed.length,
    approvals,
    signaturesWithoutApprovals: signed.length - approvals,
    chainsSigned,
    switches,
    gasChains: chainsSigned,
    messages,
    ccipFeesPaid,
    adapterFeeApplies: scenario.mode === "adapter",
  }
}

/** Stop badges per drawing node, in route order. */
export function getStops(scenario: Scenario): Partial<Record<RouteNode, StopBadge[]>> {
  const stops: Partial<Record<RouteNode, StopBadge[]>> = {}
  for (const step of getRoute(scenario)) {
    if (step.number === undefined) continue
    const node: RouteNode = step.id === "vault-call" ? "hub-wallet" : step.node
    ;(stops[node] ??= []).push({
      number: step.number,
      hollow: step.kind === "approval",
      stepId: step.id,
      title: step.title,
    })
  }
  return stops
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/** "(3 approvals)" */
export function approvalsLabel(summary: Summary): string {
  return `(${plural(summary.approvals, "approval")})`
}

/** Fees the user pays or bears directly, as a short phrase. */
export function feesLabel(summary: Summary): string {
  return summary.adapterFeeApplies
    ? `${plural(summary.ccipFeesPaid, "CCIP fee")}, plus any configured adapter fee taken from the asset`
    : plural(summary.ccipFeesPaid, "CCIP fee")
}

/** Short fact lines for a route card: signatures, chains, gas and messages. */
export function cardLines(summary: Summary): string[] {
  return [
    `${plural(summary.signatures, "signature")} ${approvalsLabel(summary)}`,
    `${plural(summary.chainsSigned, "chain")} · ${
      summary.switches === 0 ? "no network switch" : plural(summary.switches, "network switch", "network switches")
    }`,
    `gas on ${plural(summary.gasChains, "chain")} · ${plural(summary.messages, "CCIP message")}`,
  ]
}

export function allScenarios(): Scenario[] {
  const list: Scenario[] = []
  for (const flow of FLOWS) for (const mode of MODES) list.push({ flow, mode })
  return list
}
