import type { APIRoute } from "astro"
import { APIErrorType, createErrorResponse, commonHeaders, CCIPError } from "@api/ccip/utils.ts"
import { logger } from "@api/ccip/logger.ts"
import { FaucetService } from "../../../../services/faucet-service.ts"
import { SvmDripAdapter } from "@api/ccip/faucet/adapters/svm-drip.ts"
import { resolveFaucetChain } from "@api/ccip/faucet/chain-resolver.ts"

export const prerender = false
export const runtime = "nodejs"

/**
 * POST /api/ccip/v1/drips/{chainName}/execute
 * Execute actual token drip after signature verification
 */
export const POST: APIRoute = async ({ request, params }) => {
  const requestId = crypto.randomUUID()
  const idempotencyKey = request.headers.get("Idempotency-Key") || requestId

  try {
    logger.info({
      message: "Processing drip execution request",
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

    const {
      token,
      receiver,
      challenge,
      receiver_signature: receiverSignature,
      challenge_hmac: challengeHmac,
      amount, // Optional amount parameter
    } = body

    logger.debug({
      message: "Drip execution request parsed",
      requestId,
      hasToken: !!token,
      hasReceiver: !!receiver,
      hasChallenge: !!challenge,
      hasSignature: !!receiverSignature,
      hasAmount: !!amount,
      receiverPrefix: receiver?.slice(0, 8),
      tokenPrefix: token?.slice(0, 8),
    })

    // 2. Input validation
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

    if (!params.chainName) {
      throw new Error("Chain name is required")
    }

    // 3. Resolve chain configuration
    const chainConfig = resolveFaucetChain(params.chainName)
    if (!chainConfig || !chainConfig.enabled) {
      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        `Chain ${params.chainName} is not supported for drip operations`,
        422,
        {
          code: "unsupported_chain",
          traceId: requestId,
        }
      )
    }

    // 4. First verify signature using FaucetService
    const faucetService = new FaucetService()
    const origin = new URL(request.url).origin

    logger.debug({
      message: "Starting signature verification for drip",
      requestId,
      chainName: params.chainName,
      step: "signature_verification",
    })

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

    if (verifyResult.status === "error") {
      logger.warn({
        message: "Signature verification failed for drip execution",
        requestId,
        chainName: params.chainName,
        receiverPrefix: receiver.slice(0, 8),
        errorCode: verifyResult.code,
        step: "signature_verification",
      })

      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        verifyResult.message || "Signature verification failed",
        401,
        {
          code: verifyResult.code || "invalid_signature",
          traceId: requestId,
        }
      )
    }

    logger.info({
      message: "Signature verification successful, proceeding with drip",
      requestId,
      chainName: params.chainName,
      receiverPrefix: receiver.slice(0, 8),
      step: "signature_verified",
    })

    // 5. Check if drip is available for this chain
    const svmDripAdapter = new SvmDripAdapter()

    if (!svmDripAdapter.isDripAvailable(chainConfig)) {
      return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Drip is not available for this chain", 503, {
        code: "drip_unavailable",
        traceId: requestId,
      })
    }

    // 6. Check cooldown
    const cooldownRemaining = await svmDripAdapter.getCooldownRemaining(chainConfig, receiver)
    if (cooldownRemaining > 0) {
      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        `Drip cooldown active. Try again in ${cooldownRemaining} seconds.`,
        429,
        {
          code: "cooldown_active",
          traceId: requestId,
          details: { cooldownRemaining },
        }
      )
    }

    // 7. Execute the drip
    logger.info({
      message: "Executing token drip",
      requestId,
      chainName: params.chainName,
      tokenPrefix: token.slice(0, 8),
      receiverPrefix: receiver.slice(0, 8),
      step: "drip_execution",
    })

    try {
      const dripResult = await svmDripAdapter.executeDrip(chainConfig, {
        token,
        receiver,
        amount,
      })

      logger.info({
        message: "Drip executed successfully",
        requestId,
        chainName: params.chainName,
        signature: dripResult.signature.slice(0, 8),
        receiverAta: dripResult.receiverAta.slice(0, 8),
        tokenProgram: dripResult.tokenProgram.slice(0, 8),
        idempotencyKey,
        step: "drip_success",
      })

      // 8. Success response with transaction details
      const securityHeaders = {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Content-Type": "application/json",
      }

      return new Response(
        JSON.stringify({
          status: "success",
          data: {
            signature: dripResult.signature,
            receiverAta: dripResult.receiverAta,
            tokenProgram: dripResult.tokenProgram,
            chainName: params.chainName,
            token,
            receiver,
          },
          traceId: requestId,
        }),
        {
          headers: { ...commonHeaders, ...securityHeaders },
        }
      )
    } catch (dripError) {
      logger.error({
        message: "Drip execution failed",
        requestId,
        chainName: params.chainName,
        tokenPrefix: token.slice(0, 8),
        receiverPrefix: receiver.slice(0, 8),
        error: dripError instanceof Error ? dripError.message : "Unknown drip error",
        step: "drip_execution_error",
      })

      // Handle specific drip errors
      if (dripError instanceof Error) {
        const errorMessage = dripError.message.toLowerCase()

        if (errorMessage.includes("insufficient funds")) {
          return createErrorResponse(APIErrorType.SERVER_ERROR, "Faucet has insufficient funds", 503, {
            code: "insufficient_funds",
            traceId: requestId,
          })
        }

        if (errorMessage.includes("program not found")) {
          return createErrorResponse(APIErrorType.SERVER_ERROR, "Faucet program not found", 503, {
            code: "program_not_found",
            traceId: requestId,
          })
        }

        if (errorMessage.includes("invalid mint")) {
          return createErrorResponse(APIErrorType.VALIDATION_ERROR, "Invalid token mint", 422, {
            code: "invalid_mint",
            traceId: requestId,
          })
        }
      }

      return createErrorResponse(APIErrorType.SERVER_ERROR, "Drip execution failed", 500, {
        code: "drip_failed",
        traceId: requestId,
      })
    }
  } catch (error) {
    logger.error({
      message: "Error processing drip execution request",
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

    // Handle other errors
    return createErrorResponse(APIErrorType.SERVER_ERROR, "Failed to execute drip", 500, { traceId: requestId })
  }
}
