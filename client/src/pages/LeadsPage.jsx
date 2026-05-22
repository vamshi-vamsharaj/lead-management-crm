
import { useState } from 'react'
import LeadsTable from '@/features/leads/components/LeadsTable'
import LeadFilters from '@/features/leads/components/LeadFilters'
import AddLeadSheet from '@/features/leads/components/AddLeadSheet'
import { useAddLeadSheet } from '@/components/layout/AppLayout'

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  source: '',
  page:   1,
  limit:  20,
}

export default function LeadsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { open, setOpen } = useAddLeadSheet()

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Filter bar */}
      <LeadFilters filters={filters} onChange={setFilters} />

      {/* Table */}
      <LeadsTable filters={filters} onAddLead={() => setOpen(true)} />

      {/* Add Lead Sheet */}
      <AddLeadSheet open={open} onClose={() => setOpen(false)} />
    </div>
  )
}