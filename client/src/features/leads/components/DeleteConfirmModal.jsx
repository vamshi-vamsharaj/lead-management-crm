
import { useEffect } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DeleteConfirmModal({ lead, onConfirm, onCancel, isDeleting }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-panel animate-scale-in">

        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 btn-ghost p-1"
          disabled={isDeleting}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-status-rejected-dim border border-status-rejected/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-status-rejected" />
          </div>

          {/* Content */}
          <h2 className="text-base font-semibold text-ink-primary mb-1">
            Delete Lead
          </h2>
          <p className="text-sm text-ink-secondary">
            Are you sure you want to delete{' '}
            <span className="font-medium text-ink-primary">"{lead?.name}"</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn-danger flex-1 justify-center"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete Lead'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}