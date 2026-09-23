import type { APIRoute } from "astro"
import { APIErrorType, createErrorResponse, CCIPError } from "~/lib/ccip/utils.ts"
import { commonHeaders } from "@lib/api/cacheHeaders.ts"
import { logger } from "@lib/logging/index.js"
import { getFaucetConfig } from "@lib/core/config/index.ts"
import { FaucetService } from "~/lib/ccip/services/faucet-service.ts"

export const prerender = false
export const runtime = "nodejs" // Required for crypto operations

/**
 * GET /api/ccip/v1/drips/{chainName}/challenge
 * Issues a short-lived challenge bound to token/receiver
 */
export const GET: APIRoute = async ({ request, params }) => {
  const requestId = crypto.randomUUID()

  try {
    logger.info({
      message: "Processing faucet challenge request",
      requestId,
      chainName: params.chainName,
      url: request.url,
    })

    const url = new URL(request.url)
    const origin = url.origin

    // 1. Input validation
    const token = url.searchParams.get("token")
    const receiver = url.searchParams.get("receiver")

    if (!token) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Missing token parameter", 422, requestId, {
        code: "invalid_token",
      })
    }

    if (!receiver) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Missing receiver parameter", 422, requestId, {
        code: "invalid_receiver",
      })
    }

    logger.debug({
      message: "Challenge parameters validated",
      requestId,
      tokenAddress: token,
      receiverAddress: receiver,
    })

    // 3. Generate challenge using FaucetService with centralized config
    const faucetService = new FaucetService()
    const faucetConfig = getFaucetConfig()
    const ttlSec = faucetConfig.ttlSeconds
    const kid = faucetConfig.challengeSecretKid

    if (!params.chainName) {
      throw new Error("Chain name is required")
    }

    const challenge = await faucetService.generateChallenge(params.chainName, {
      token,
      receiver,
      host: origin,
      ttlSec,
      kid,
    })

    logger.info({
      message: "Challenge generated successfully",
      requestId,
      chainName: params.chainName,
      family: challenge.family,
      expiresAt: challenge.exp,
    })

    // 4. Security headers
    const securityHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Type": "application/json",
    }

    return new Response(JSON.stringify(challenge), {
      headers: { ...commonHeaders, ...securityHeaders },
    })
  } catch (error) {
    logger.error({
      message: "Error processing challenge request",
      requestId,
      chainName: params.chainName,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle CCIPError specifically
    if (error instanceof CCIPError) {
      return createErrorResponse(
        error.statusCode === 400 ? APIErrorType.VALIDATION_ERROR : APIErrorType.SERVER_ERROR,
        error.message,
        error.statusCode,
        requestId
      )
    }

    // Handle validation errors
    if (error instanceof Error && error.message.includes("not supported")) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, requestId, {
        code: "unsupported_chain",
      })
    }

    if (error instanceof Error && error.message.includes("Invalid address")) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, requestId, {
        code: "invalid_address",
      })
    }

    if (error instanceof Error && error.message.includes("not allowed")) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, requestId, {
        code: "unsupported_token",
      })
    }

    // Handle other errors
    return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to generate challenge", 500, requestId)
  }
}
