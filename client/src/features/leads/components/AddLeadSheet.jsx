

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Loader2, User, Phone, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createLeadSchema } from '../leads.schema'
import { useCreateLeadMutation } from '../hooks/useLeads'
import { useAddLeadSheet } from "@/components/layout/AppLayout"
const SOURCE_OPTIONS = [
  { value: 'call',      label: '📞 Call' },
  { value: 'whatsapp',  label: '💬 WhatsApp' },
  { value: 'field',     label: '📍 Field' },
]

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="text-[11px] text-status-rejected mt-1.5 flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-status-rejected inline-block" />
      {message}
    </p>
  )
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

export default function AddLeadSheet() {
  const { open, setOpen } = useAddLeadSheet()

  function onClose() {
    setOpen(false)
  }
  const { mutate: createLead, isPending } = useCreateLeadMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLeadSchema),
    defaultValues: { name: '', phone: '', source: 'call', notes: '' },
  })

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      setTimeout(reset, 300) // Wait for close animation
    }
  }, [open, reset])

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape' && open) onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  function onSubmit(data) {
    createLead(data, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <aside
        className={cn(
          'fixed right-0 top-0 h-full w-full sm:w-[420px] bg-surface border-l border-border z-50',
          'flex flex-col shadow-panel transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink-primary">Add New Lead</h2>
              <p className="text-[11px] text-ink-muted">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5" disabled={isPending}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex-1 px-6 py-5 space-y-5">

            {/* Name */}
            <FormField label="Full Name *" error={errors.name?.message}>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  {...register('name')}
                  placeholder="e.g. Ravi Kumar"
                  className={cn('field-input pl-10', errors.name && 'field-input-error')}
                  autoFocus
                />
              </div>
            </FormField>

            {/* Phone */}
            <FormField label="Phone Number *" error={errors.phone?.message}>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  {...register('phone')}
                  placeholder="+91-9812345678"
                  className={cn('field-input pl-10', errors.phone && 'field-input-error')}
                />
              </div>
            </FormField>

            {/* Source */}
            <FormField label="Lead Source *" error={errors.source?.message}>
              <div className="grid grid-cols-3 gap-2">
                {SOURCE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('source')}
                      className="sr-only"
                    />
                    <SourceCard value={opt.value} label={opt.label} register={register} />
                  </label>
                ))}
              </div>
              {errors.source && <FieldError message={errors.source.message} />}
            </FormField>

            {/* Notes */}
            <FormField label="Notes (Optional)" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                placeholder="Any relevant context about this lead…"
                rows={4}
                className={cn(
                  'field-input resize-none',
                  errors.notes && 'field-input-error'
                )}
              />
              <p className="text-[10px] text-ink-muted mt-1">Max 1000 characters</p>
            </FormField>
          </div>

          {/* Footer actions — sticky at bottom */}
          <div className="px-6 py-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 justify-center"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </>
              ) : (
                'Add Lead'
              )}
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}

// ── Source radio card ─────────────────────────────────────────────────────────
function SourceCard({ value, label, register }) {
  // We need to watch the current value — use a ref approach via data attr
  return (
    <div className="relative">
      <input
        type="radio"
        value={value}
        {...register('source')}
        className="peer sr-only"
        id={`source-${value}`}
      />
      <label
        htmlFor={`source-${value}`}
        className={cn(
          'flex flex-col items-center justify-center gap-1 h-16 rounded-lg border cursor-pointer',
          'text-xs font-medium text-ink-secondary transition-all duration-150',
          'border-border bg-raised hover:border-accent/40 hover:text-ink-primary',
          'peer-checked:border-accent peer-checked:bg-accent-dim peer-checked:text-accent'
        )}
      >
        <span className="text-lg leading-none">{label.split(' ')[0]}</span>
        <span>{label.split(' ').slice(1).join(' ')}</span>
      </label>
    </div>
  )
}