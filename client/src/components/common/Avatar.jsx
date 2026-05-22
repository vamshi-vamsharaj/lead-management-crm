import { getInitials, nameToColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function Avatar({ name, size = 'md' }) {
  const initials = getInitials(name)
  const bgColor  = nameToColor(name)

  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }

  return (
    <div
      className={cn(
        'rounded-lg flex items-center justify-center font-semibold text-white flex-shrink-0 select-none',
        sizes[size]
      )}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  )
}