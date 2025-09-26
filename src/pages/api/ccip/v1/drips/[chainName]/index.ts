import type { APIRoute } from "astro"
import { APIErrorType, createErrorResponse, commonHeaders, CCIPError } from "@api/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"
import { FaucetService } from "../../../../services/faucet-service.ts"

export const prerender = false
export const runtime = "nodejs" // Required for crypto operations

/**
 * POST /api/ccip/v1/drips/{chainName}
 * Verify receiver ownership by signature (no on-chain call yet)
 */
export const POST: APIRoute = async ({ request, params }) => {
  const requestId = crypto.randomUUID()
  const idempotencyKey = request.headers.get("Idempotency-Key") || requestId

  try {
    logger.info({
      message: "Processing faucet verification request",
      requestId,
      chainName: params.chainName,
      contentType: request.headers.get("content-type"),
      idempotencyKey,
    })

    // 1. Request body validation
    let body
    try {
      body = await request.json()
    } catch {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid JSON body", 400, {
        code: "invalid_json",
        traceId: requestId,
      })
    }

    const { token, receiver, challenge, receiver_signature: receiverSignature, challenge_hmac: challengeHmac } = body

    logger.debug({
      message: "Request body parsed",
      requestId,
      hasToken: !!token,
      hasReceiver: !!receiver,
      hasChallenge: !!challenge,
      hasSignature: !!receiverSignature,
      receiverAddress: receiver,
      tokenAddress: token,
    })

    // 3. Input validation
    if (!token || typeof token !== "string") {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid token parameter", 422, {
        code: "invalid_token",
        traceId: requestId,
      })
    }

    if (!receiver || typeof receiver !== "string") {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid receiver parameter", 422, {
        code: "invalid_receiver",
        traceId: requestId,
      })
    }

    if (!challenge || typeof challenge !== "string") {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid challenge parameter", 422, {
        code: "bad_challenge",
        traceId: requestId,
      })
    }

    if (!receiverSignature || typeof receiverSignature !== "string") {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid signature parameter", 422, {
        code: "invalid_signature",
        traceId: requestId,
      })
    }

    // 4. Signature verification using FaucetService
    const faucetService = new FaucetService()

    if (!params.chainName) {
      throw new Error("Chain name is required")
    }

    const origin = new URL(request.url).origin

    const verifyResult = await faucetService.verifySignature(
      params.chainName,
      {
        token,
        receiver,
        challenge,
        receiver_signature: receiverSignature,
        challenge_hmac: challengeHmac,
      },
      origin
    )

    logger.info({
      message: "Signature verification completed",
      requestId,
      chainName: params.chainName,
      receiverAddress: receiver,
      status: verifyResult.status,
      idempotencyKey,
    })

    // 5. Handle verification result
    if (verifyResult.status === "error") {
      // Return 400 for verification failures (client error, not server error)
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, verifyResult.message || "Verification failed", 400, {
        code: verifyResult.code || "verification_failed",
        traceId: requestId,
      })
    }

    // 6. Security headers
    const securityHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Type": "application/json",
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...commonHeaders, ...securityHeaders },
    })
  } catch (error) {
    logger.error({
      message: "Error processing verification request",
      requestId,
      chainName: params.chainName,
      idempotencyKey,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle CCIPError specifically
    if (error instanceof CCIPError) {
      return createErrorResponse(
        error.statusCode === 400 ? APIErrorType.VALIDATION_ERROR : APIErrorType.SERVER_ERROR,
        error.message,
        error.statusCode,
        { traceId: requestId }
      )
    }

    // Handle specific verification errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      if (errorMessage.includes("challenge expired")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Challenge has expired", 401, {
          code: "challenge_expired",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("challenge tampered") || errorMessage.includes("invalid hmac")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Challenge has been tampered with", 401, {
          code: "challenge_tampered",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("signature verification failed")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Signature verification failed", 401, {
          code: "invalid_signature",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("origin mismatch")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Challenge origin mismatch", 401, {
          code: "origin_mismatch",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("not supported")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, {
          code: "unsupported_chain",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("invalid address")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, {
          code: "invalid_address",
          traceId: requestId,
        })
      }

      if (errorMessage.includes("not allowed")) {
        return createErrorResponse(APIErrorType.VALIDATION_ERROR, error.message, 422, {
          code: "unsupported_token",
          traceId: requestId,
        })
      }
    }

    // Handle other errors
    return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to verify signature", 500, { traceId: requestId })
  }
}
