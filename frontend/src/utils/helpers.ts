/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Sleep utility (delay execution)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if a value is empty (null, undefined, empty array/string/object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

/**
 * Get initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2)
}
