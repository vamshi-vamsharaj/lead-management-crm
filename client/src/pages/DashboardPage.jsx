
import StatsGrid from '@/features/dashboard/components/StatsGrid'
import LeadsTable from '@/features/leads/components/LeadsTable'
import AddLeadSheet from '@/features/leads/components/AddLeadSheet'
import { useAddLeadSheet } from '@/components/layout/AppLayout'

export default function DashboardPage() {
  const { open, setOpen } = useAddLeadSheet()

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Stats overview */}
      <StatsGrid />

      {/* Recent leads preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ink-primary">Recent Leads</h2>
            <p className="text-xs text-ink-muted mt-0.5">Latest additions to your pipeline</p>
          </div>
          <a
            href="/leads"
            className="text-xs text-accent hover:text-accent-hover transition-colors"
            onClick={(e) => { e.preventDefault(); window.location.href = '/leads' }}
          >
            View all →
          </a>
        </div>
        <LeadsTable
          filters={{ limit: 5 }}
          onAddLead={() => setOpen(true)}
        />
      </section>

      <AddLeadSheet open={open} onClose={() => setOpen(false)} />
    </div>
  )
}