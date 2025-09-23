/**
 * Solana Library - Clean Architecture
 *
 * This library follows Domain-Driven Design (DDD) principles with clear separation of concerns:
 *
 * Architecture Layers:
 * 1. Core - Pure utilities, constants, and types (no dependencies)
 * 2. Infrastructure - Abstractions for external dependencies (RPC, blockchain)
 * 3. Domain - Business logic, models, and services
 * 4. Wallet - Browser wallet integration
 *
 * Migration Complete: All legacy code has been removed.
 * Use DripOrchestrator from @api/ccip/services/faucet/drip-orchestrator for business logic.
 */

// Core layer - Pure utilities with no dependencies
export * from "./core/index.ts"

// Infrastructure layer - Dependency abstractions
export * from "./infrastructure/index.ts"

// Domain layer - Business logic and models
export * from "./domain/transaction/models/index.ts"
export * from "./domain/transaction/services/index.ts"
export * from "./domain/account/models/index.ts"
export * from "./domain/instructions/index.ts"

// Wallet layer - Browser integration
export * from "./wallet-adapter/index.ts"

// Re-export commonly used utilities for convenience
export { ensureSolAddress } from "./core/address/validator.ts"
export { address } from "@solana/kit"
