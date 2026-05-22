
import { Menu, Plus, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const PAGE_META = {
  '/':      { title: 'Dashboard',  subtitle: 'Overview of your lead pipeline' },
  '/leads': { title: 'Leads',      subtitle: 'Manage and track all your leads' },
}

export default function TopBar({ onMenuClick, onAddLead }) {
  const location = useLocation()
  const meta = PAGE_META[location.pathname] || PAGE_META['/']

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-canvas/80 backdrop-blur-md sticky top-0 z-10">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-1.5"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-ink-primary leading-none">{meta.title}</h1>
          <p className="text-[11px] text-ink-muted mt-0.5 hidden sm:block">{meta.subtitle}</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell — placeholder */}
        <button className="btn-ghost p-2 relative" aria-label="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>

        {/* Add Lead — only shown on leads page */}
        {location.pathname === '/leads' && (
          <button onClick={onAddLead} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        )}
      </div>
    </header>
  )
}