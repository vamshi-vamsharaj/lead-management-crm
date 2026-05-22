
import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '',             label: 'All Statuses' },
  { value: 'new',          label: 'New' },
  { value: 'interested',   label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'converted',    label: 'Converted' },
]

const SOURCE_OPTIONS = [
  { value: '',          label: 'All Sources' },
  { value: 'call',      label: 'Call' },
  { value: 'whatsapp',  label: 'WhatsApp' },
  { value: 'field',     label: 'Field' },
]

export default function LeadFilters({ filters, onChange }) {
  const hasActiveFilters = filters.search || filters.status || filters.source

  function handleSearch(e) {
    onChange({ ...filters, search: e.target.value, page: 1 })
  }

  function handleStatus(e) {
    onChange({ ...filters, status: e.target.value, page: 1 })
  }

  function handleSource(e) {
    onChange({ ...filters, source: e.target.value, page: 1 })
  }

  function clearAll() {
    onChange({ search: '', status: '', source: '', page: 1 })
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          placeholder="Search by name or phone…"
          value={filters.search || ''}
          onChange={handleSearch}
          className="field-input pl-9 h-9 text-sm"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '', page: 1 })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" />

        <select
          value={filters.status || ''}
          onChange={handleStatus}
          className="field-input h-9 text-xs py-0 pr-8 min-w-[120px] cursor-pointer"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filters.source || ''}
          onChange={handleSource}
          className="field-input h-9 text-xs py-0 pr-8 min-w-[110px] cursor-pointer"
        >
          {SOURCE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}