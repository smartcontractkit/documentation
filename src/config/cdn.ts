/**
 * CDN Base URLs and asset path configuration
 * Centralized configuration for all CDN-hosted assets
 */

// CloudFront CDN base URL
export const CLOUDFRONT_CDN_BASE = "https://d2f70xi62kby8n.cloudfront.net"

// Asset-specific paths
export const TOKEN_ICONS_PATH = `${CLOUDFRONT_CDN_BASE}/tokens`
export const VERIFIER_LOGOS_PATH = `${CLOUDFRONT_CDN_BASE}/verifiers`

// Other CDNs (for future centralization if needed)
export const IMGIX_CDN_BASE = "https://smartcontract.imgix.net"
