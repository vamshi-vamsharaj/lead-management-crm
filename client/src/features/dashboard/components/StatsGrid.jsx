

import { Users, Sparkles, TrendingUp, XCircle, Clock, Percent } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStats } from '../hooks/useDashboard'

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Leads',
    icon: Users,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    key: 'interested',
    label: 'Interested',
    icon: Sparkles,
    color: 'text-status-interested',
    bg: 'bg-status-interested-dim',
    border: 'border-status-interested/20',
  },
  {
    key: 'converted',
    label: 'Converted',
    icon: TrendingUp,
    color: 'text-status-converted',
    bg: 'bg-status-converted-dim',
    border: 'border-status-converted/20',
  },
  {
    key: 'notInterested',
    label: 'Not Interested',
    icon: XCircle,
    color: 'text-status-rejected',
    bg: 'bg-status-rejected-dim',
    border: 'border-status-rejected/20',
  },
]

function StatCard({ card, value, isLoading }) {
  const Icon = card.icon

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-glow transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className={cn('w-9 h-9 rounded-lg border flex items-center justify-center', card.bg, card.border)}>
          <Icon className={cn('w-4 h-4', card.color)} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-16 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      ) : (
        <div>
          <p className={cn('stat-number', card.color)}>{value ?? '—'}</p>
          <p className="text-xs text-ink-muted mt-0.5">{card.label}</p>
        </div>
      )}
    </div>
  )
}

function MiniStatCard({ label, value, icon: Icon, isLoading }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-raised border border-border flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-ink-secondary" />
      </div>
      <div>
        {isLoading ? (
          <div className="space-y-1">
            <div className="skeleton h-4 w-12 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink-primary font-mono">{value ?? '—'}</p>
            <p className="text-xs text-ink-muted">{label}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function StatsGrid() {
  const { data: stats, isLoading } = useDashboardStats()

  return (
    <div className="space-y-4">
      {/* Main stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <StatCard
            key={card.key}
            card={card}
            value={stats?.[card.key]}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MiniStatCard
          label="Added this week"
          value={stats?.addedThisWeek}
          icon={Clock}
          isLoading={isLoading}
        />
        <MiniStatCard
          label="Conversion rate"
          value={stats ? `${stats.conversionRate}%` : null}
          icon={Percent}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}