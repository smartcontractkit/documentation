import type { APIRoute } from "astro"
import { APIErrorType, createErrorResponse, commonHeaders, CCIPError } from "@api/ccip/utils.ts"
import { logger } from "@lib/logging/index.js"
import { FaucetService } from "../../../../services/faucet-service.ts"
import { SvmDripAdapter } from "@api/ccip/faucet/adapters/svm-drip.ts"
import { resolveFaucetChain } from "@api/ccip/faucet/chain-resolver.ts"
import { handleFaucetError } from "@api/ccip/services/faucet/error-handler.ts"
import { ChainConfigurationService } from "@api/ccip/services/chain-config.ts"

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
      receiverAddress: receiver,
      tokenAddress: token,
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

    // 3. Resolve chain configuration with enhanced validation
    let chainConfig
    try {
      chainConfig = resolveFaucetChain(params.chainName)
    } catch (configError) {
      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        `Faucet configuration error: ${configError instanceof Error ? configError.message : "Invalid chain or token configuration"}`,
        400,
        {
          code: "FAUCET_CONFIG_ERROR",
          traceId: requestId,
        }
      )
    }

    if (!chainConfig || !chainConfig.enabled) {
      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        `Unsupported chain: ${params.chainName}. This chain is not enabled for faucet operations.`,
        400,
        {
          code: "UNSUPPORTED_CHAIN",
          traceId: requestId,
          supportedChains: ["solana-devnet"],
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
        receiverAddress: receiver,
        errorCode: verifyResult.code,
        step: "signature_verification",
      })

      // Use appropriate status codes for different auth failures
      const statusCode = verifyResult.code === "EXPIRED_CHALLENGE" ? 401 : 403
      return createErrorResponse(
        APIErrorType.VALIDATION_ERROR,
        `Authentication failed: ${verifyResult.message || "Signature verification failed"}`,
        statusCode,
        {
          code: verifyResult.code || "INVALID_SIGNATURE",
          traceId: requestId,
        }
      )
    }

    logger.info({
      message: "Signature verification successful, proceeding with drip",
      requestId,
      chainName: params.chainName,
      receiverAddress: receiver,
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

    // 6. Execute the drip (rate limiting handled on-chain by Solana program)
    logger.info({
      message: "Executing token drip",
      requestId,
      chainName: params.chainName,
      tokenAddress: token,
      receiverAddress: receiver,
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
        signature: dripResult.signature,
        receiverAta: dripResult.receiverAta,
        tokenProgram: dripResult.tokenProgram,
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
        tokenAddress: token,
        receiverAddress: receiver,
        error: dripError instanceof Error ? dripError.message : "Unknown drip error",
        step: "drip_execution_error",
      })

      const rpcContext = ChainConfigurationService.createRpcContextForChain(chainConfig)
      return handleFaucetError(dripError, requestId, rpcContext, {
        mint: token,
        receiver,
        faucetProgram: chainConfig.faucetAddress,
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
