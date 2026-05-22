/**
 * src/lib/utils.js
 *
 * Shared utilities used across the entire frontend.
 */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

/**
 * cn() — className merger.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * WHY BOTH?
 *   clsx handles conditional logic: cn('base', isActive && 'active')
 *   tailwind-merge prevents conflicts: cn('px-2', 'px-4') → 'px-4' (not both)
 *   Together they're the standard for Tailwind + React projects.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string for display in the leads table.
 * Shows relative time for recent dates, absolute for older ones.
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = (now - date) / (1000 * 60 * 60 * 24)

  if (diffDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true })
  }
  return format(date, 'MMM d, yyyy')
}

/**
 * Get initials from a full name — used for avatar generation.
 * "Ravi Kumar" → "RK"
 * "Priya" → "P"
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')
}

/**
 * Generate a deterministic HSL color from a string.
 * Same name always produces the same avatar color.
 */
export function nameToColor(name) {
  if (!name) return 'hsl(240, 30%, 40%)'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 35%)`
}

/**
 * Capitalize the first letter of each word.
 * "not_interested" → "Not Interested"
 */
export function humanize(str) {
  if (!str) return ''
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}