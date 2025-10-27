import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

/**
 * Format a date to a readable string (default: localized full date)
 * @example formatDate('2025-10-27') → "Oct 27, 2025"
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  return format(new Date(date), formatStr)
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Smartly format a date (e.g., "Today at 3:45 PM", "Yesterday at 10:12 AM", or "Oct 26, 2025")
 */
export function formatSmartDate(date: string | Date): string {
  const dateObj = new Date(date)
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`
  }
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`
  }
  return format(dateObj, 'MMM d, yyyy')
}

/**
 * Lightweight relative time function (e.g., "5m ago", "3h ago", "2d ago")
 */
export function getTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}
