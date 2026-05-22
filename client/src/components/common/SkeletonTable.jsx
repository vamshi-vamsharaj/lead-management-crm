/**
 * src/components/common/SkeletonTable.jsx
 *
 * Skeleton loaders match the visual shape of the real content.
 * This prevents "layout shift" — the page doesn't jump when data arrives.
 * Every production app (Linear, Notion, GitHub) uses skeletons over spinners
 * for data tables because they communicate the structure that's loading.
 */

import { cn } from '@/lib/utils'

function SkeletonCell({ className }) {
  return <div className={cn('skeleton rounded', className)} />
}

function SkeletonRow({ delay = 0 }) {
  return (
    <tr
      className="border-b border-border"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar + Name cell */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <SkeletonCell className="w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="space-y-1.5">
            <SkeletonCell className="h-3.5 w-28" />
            <SkeletonCell className="h-3 w-20" />
          </div>
        </div>
      </td>
      {/* Source */}
      <td className="px-4 py-3.5">
        <SkeletonCell className="h-6 w-20 rounded-full" />
      </td>
      {/* Status */}
      <td className="px-4 py-3.5">
        <SkeletonCell className="h-6 w-24 rounded-full" />
      </td>
      {/* Date */}
      <td className="px-4 py-3.5 hidden md:table-cell">
        <SkeletonCell className="h-3.5 w-20" />
      </td>
      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-end gap-2">
          <SkeletonCell className="w-7 h-7 rounded-md" />
          <SkeletonCell className="w-7 h-7 rounded-md" />
        </div>
      </td>
    </tr>
  )
}

export default function SkeletonTable({ rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} delay={i * 60} />
      ))}
    </>
  )
}