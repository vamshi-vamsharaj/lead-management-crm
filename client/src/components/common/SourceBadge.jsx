import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const SOURCE_CONFIG = {
  call: {
    label: 'Call',
    icon: Phone,
    className: 'bg-source-call-dim text-source-call border-source-call/20',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageCircle,
    className: 'bg-source-whatsapp-dim text-source-whatsapp border-source-whatsapp/20',
  },
  field: {
    label: 'Field',
    icon: MapPin,
    className: 'bg-source-field-dim text-source-field border-source-field/20',
  },
}

export default function SourceBadge({ source }) {
  const config = SOURCE_CONFIG[source]
  if (!config) return null
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}