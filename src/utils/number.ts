/**
 * Formats a number with commas as thousand separators and proper decimal handling
 * @param value - The number or string to format
 * @returns A formatted string with proper thousand separators and decimals
 * @throws Error if the input cannot be parsed as a valid number
 */
export const commify = (value: string | number): string => {
  // Convert to string if it's a number
  const stringValue = value.toString()

  const match = stringValue.match(/^(-?)([0-9]*)(\.?)([0-9]*)$/)
  if (!match || (!match[2] && !match[4])) {
    throw new Error(`bad formatted number: ${JSON.stringify(value)}`)
  }

  const neg = match[1]
  const whole = BigInt(match[2] || 0).toLocaleString("en-us")
  const frac = match[4] ? match[4].match(/^(.*?)0*$/)?.[1] || "0" : "0"

  return `${neg}${whole}.${frac}`
}
