
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import StatusBadge from '@/components/common/StatusBadge'
import { useUpdateLeadStatusMutation } from '../hooks/useLeads'

const STATUSES = [
  { value: 'new',           label: 'New' },
  { value: 'interested',    label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'converted',     label: 'Converted' },
]

export default function StatusUpdateDropdown({ lead }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { mutate: updateStatus, isPending, variables } = useUpdateLeadStatusMutation()

  // The "displayed" status — either the in-flight optimistic value or the actual value
  const displayStatus = isPending && variables?.id === lead.id
    ? variables.status
    : lead.status

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleSelect(newStatus) {
    if (newStatus === lead.status) { setOpen(false); return }
    updateStatus({ id: lead.id, status: newStatus })
    setOpen(false)
  }

  return (
 <div
  className={cn(
    "relative",
    open && "z-[9999]"
  )}
  ref={dropdownRef}
>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <StatusBadge status={displayStatus} />
        {isPending && variables?.id === lead.id ? (
          <Loader2 className="w-3 h-3 text-ink-muted animate-spin" />
        ) : (
          <ChevronDown className={cn(
            'w-3 h-3 text-ink-muted transition-transform duration-150 opacity-0 group-hover:opacity-100',
            open && 'rotate-180 opacity-100'
          )} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-[9999] w-44 bg-surface border border-border rounded-xl shadow-panel animate-scale-in overflow-hidden">
          <div className="p-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => handleSelect(s.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm',
                  displayStatus === s.value
                    ? 'bg-raised text-ink-primary'
                    : 'text-ink-secondary hover:bg-raised hover:text-ink-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.value} size="sm" />
                </div>
                {displayStatus === s.value && (
                  <Check className="w-3.5 h-3.5 text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}