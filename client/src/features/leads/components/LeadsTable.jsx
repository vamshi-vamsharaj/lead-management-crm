/**
 * src/features/leads/components/LeadsTable.jsx
 *
 * The heart of the application — a premium data table.
 *
 * WHAT MAKES A TABLE FEEL PREMIUM:
 *   1. Consistent row height and vertical rhythm
 *   2. Avatar/initials instead of raw text in the name column
 *   3. Colored badges for every categorical column (status, source)
 *   4. Relative timestamps ("2 hours ago") not raw dates
 *   5. Subtle hover states — rows respond to cursor
 *   6. Sticky header — column labels stay visible when scrolling
 *   7. Proper empty and loading states — never a blank screen
 *   8. Actions are icon buttons (not text links) with tooltips
 */

import { useState } from 'react'
import { Trash2, Phone, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Avatar from '@/components/common/Avatar'
import SourceBadge from '@/components/common/SourceBadge'
import SkeletonTable from '@/components/common/SkeletonTable'
import EmptyState from '@/components/common/EmptyState'
import StatusUpdateDropdown from './StatusUpdateDropdown'
import DeleteConfirmModal from './DeleteConfirmModal'
import { useLeadsQuery, useDeleteLeadMutation } from '../hooks/useLeads'

const TH = ({ children, className }) => (
  <th className={cn(
    'px-4 py-3 text-left text-[11px] font-semibold text-ink-muted uppercase tracking-widest',
    'border-b border-border sticky top-0 bg-canvas z-[1]',
    className
  )}>
    {children}
  </th>
)

export default function LeadsTable({ filters = {}, onAddLead }) {
  const [pendingDelete, setPendingDelete] = useState(null)
  const { data, isLoading, isError, isFetching } = useLeadsQuery(filters)
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLeadMutation()

  const leads = data?.leads || []
  const hasFilters = !!(filters.search || filters.status || filters.source)

  function handleDeleteConfirm() {
    if (!pendingDelete) return
    deleteLead(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
      onError:   () => setPendingDelete(null),
    })
  }

  return (
    <>
      {/* Table wrapper */}
<div className="card overflow-visible">
            {/* Subtle "fetching in background" indicator */}
        {isFetching && !isLoading && (
          <div className="h-0.5 bg-accent/40 animate-pulse" />
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <TH className="pl-4 w-[220px]">Lead</TH>
                <TH className="w-[130px]">Source</TH>
                <TH className="w-[160px]">Status</TH>
                <TH className="hidden md:table-cell w-[130px]">Added</TH>
                <TH className="text-right pr-4 w-[90px]">Actions</TH>
              </tr>
            </thead>

            <tbody>
              {/* Loading state */}
              {isLoading && <SkeletonTable rows={6} />}

              {/* Error state */}
              {isError && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-sm text-status-rejected">Failed to load leads. Please refresh.</p>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isLoading && !isError && leads.length === 0 && (
                <EmptyState onAddLead={onAddLead} isFiltered={hasFilters} />
              )}

              {/* Data rows */}
              {!isLoading && leads.map((lead, i) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  index={i}
                  onDelete={() => setPendingDelete(lead)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with count */}
        {!isLoading && leads.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-ink-muted">
              Showing <span className="text-ink-secondary font-medium">{leads.length}</span>
              {data?.total > leads.length && (
                <> of <span className="text-ink-secondary font-medium">{data.total}</span></>
              )} leads
            </p>
            {isFetching && !isLoading && (
              <p className="text-[10px] text-ink-muted animate-pulse">Syncing…</p>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <DeleteConfirmModal
          lead={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}

// ── Individual lead row ───────────────────────────────────────────────────────
function LeadRow({ lead, index, onDelete }) {
  return (
    <tr
      className={cn(
  'border-b border-border/60 last:border-0',
  'hover:bg-surface/50 transition-colors duration-100 group',
  'animate-slide-up',
  'relative z-0 hover:z-10'
)}
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Lead name + phone */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={lead.name} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-primary truncate">{lead.name}</p>
            <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5" />
              {lead.phone}
            </p>
          </div>
        </div>
      </td>

      {/* Source */}
      <td className="px-4 py-3.5">
        <SourceBadge source={lead.source} />
      </td>

      {/* Status — clickable dropdown */}
      <td className="px-4 py-3.5 relative overflow-visible">
  <StatusUpdateDropdown lead={lead} />
</td>

      {/* Date */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <p className="text-xs text-ink-muted flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(lead.created_at)}
        </p>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onDelete}
            title="Delete lead"
            className={cn(
              'p-1.5 rounded-md text-ink-muted transition-all duration-150',
              'opacity-0 group-hover:opacity-100',
              'hover:bg-status-rejected-dim hover:text-status-rejected'
            )}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}