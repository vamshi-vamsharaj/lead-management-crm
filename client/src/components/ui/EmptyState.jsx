/**
 * src/components/common/EmptyState.jsx
 *
 * Empty states with a CTA — never show a blank table.
 * A good empty state explains what's missing and tells the user what to do.
 */

import { Users, SearchX } from 'lucide-react'

export default function EmptyState({ onAddLead, isFiltered = false }) {
  if (isFiltered) {
    return (
      <tr>
        <td colSpan={5} className="px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-raised flex items-center justify-center">
              <SearchX className="w-6 h-6 text-ink-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-secondary">No results found</p>
              <p className="text-xs text-ink-muted mt-1">Try adjusting your search or filters</p>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td colSpan={5} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          {/* Icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-accent-dim border border-accent/20 flex items-center justify-center">
              <Users className="w-7 h-7 text-accent" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-primary">No leads yet</p>
            <p className="text-xs text-ink-muted mt-1 max-w-[200px] mx-auto">
              Add your first lead to start tracking your pipeline
            </p>
          </div>

          {onAddLead && (
            <button onClick={onAddLead} className="btn-primary text-xs px-3 py-2">
              Add First Lead
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}