import { createKeyPairSignerFromBytes, type TransactionSigner, type MessageSigner } from "@solana/kit"
import bs58 from "bs58"

export const prerender = false

/**
 * Parse private key from base58 string or JSON array format
 */
function parsePrivateKey(privateKeyStr: string): Uint8Array {
  if (privateKeyStr.trim().startsWith("[")) {
    // JSON array format: [1,2,3,...]
    return new Uint8Array(JSON.parse(privateKeyStr))
  }

  // Base58 format: use bs58 which is already in package.json
  return bs58.decode(privateKeyStr)
}

/**
 * Create a signer from private key using Kit's createKeyPairSignerFromBytes
 */
export async function createSvmSigner(privateKeyStr: string): Promise<TransactionSigner & MessageSigner> {
  const bytes = parsePrivateKey(privateKeyStr)

  if (bytes.length === 64) {
    return await createKeyPairSignerFromBytes(bytes)
  }

  if (bytes.length === 32) {
    // 32-byte seed - Kit's createKeyPairSignerFromBytes should handle this
    // If it doesn't, this will throw a clear error for debugging
    return await createKeyPairSignerFromBytes(bytes)
  }

  throw new Error(`Invalid private key length ${bytes.length}. Expected 32 or 64 bytes.`)
}

/**
 * Validate that a signer is properly constructed
 */
export function validateSigner(signer: TransactionSigner & MessageSigner): void {
  if (!signer.address) {
    throw new Error("Signer missing address")
  }
}
