/**
 * src/components/common/StatusBadge.jsx
 *
 * Color-coded pill badge for lead status.
 * Used in the table and the status dropdown.
 */

import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  new: {
    label: 'New',
    className: 'bg-status-new-dim text-status-new border-status-new/20',
    dot: 'bg-status-new animate-pulse-dot',
  },
  interested: {
    label: 'Interested',
    className: 'bg-status-interested-dim text-status-interested border-status-interested/20',
    dot: 'bg-status-interested',
  },
  not_interested: {
    label: 'Not Interested',
    className: 'bg-status-rejected-dim text-status-rejected border-status-rejected/20',
    dot: 'bg-status-rejected',
  },
  converted: {
    label: 'Converted',
    className: 'bg-status-converted-dim text-status-converted border-status-converted/20',
    dot: 'bg-status-converted',
  },
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        config.className
      )}
    >
      <span className={cn('rounded-full flex-shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {config.label}
    </span>
  )
}