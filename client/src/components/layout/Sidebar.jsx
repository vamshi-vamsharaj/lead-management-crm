
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads',  icon: Users,           label: 'Leads'     },
]

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
          isActive
            ? 'bg-accent/10 text-accent font-medium'
            : 'text-ink-secondary hover:bg-raised hover:text-ink-primary'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'w-4 h-4 flex-shrink-0 transition-colors',
              isActive ? 'text-accent' : 'text-ink-muted group-hover:text-ink-secondary'
            )}
          />
          {label}
          {isActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </>
      )}
    </NavLink>
  )
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen fixed left-0 top-0 bg-surface border-r border-border z-20">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-ink-primary tracking-tight">
            Lead<span className="text-accent">Flow</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-ink-muted uppercase tracking-widest">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-raised border border-border flex items-center justify-center text-xs font-bold text-ink-secondary">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink-primary truncate">Admin</p>
            <p className="text-[10px] text-ink-muted truncate">admin@leadflow.io</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
export function MobileSidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border z-40 lg:hidden',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-4 h-14 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg accent-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-ink-primary">
              Lead<span className="text-accent">Flow</span>
            </span>
          </div>
          <button onClick={onClose} className="btn-ghost p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </>
  )
}