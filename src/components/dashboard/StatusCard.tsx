import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface StatusCardProps {
  icon: LucideIcon
  label: string
  value: string
  detail?: string
  tone?: 'neutral' | 'good' | 'warning' | 'danger' | 'accent'
  className?: string
}

const toneStyles: Record<NonNullable<StatusCardProps['tone']>, string> = {
  neutral: 'text-zinc-300 bg-zinc-800/80',
  good: 'text-teal-300 bg-teal-500/10',
  warning: 'text-amber-300 bg-amber-500/10',
  danger: 'text-red-300 bg-red-500/10',
  accent: 'text-amber-400 bg-amber-500/10',
}

export function StatusCard({ icon: Icon, label, value, detail, tone = 'neutral', className }: StatusCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 shadow-lg shadow-black/20 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
          <p className="mt-1.5 font-mono text-xl sm:text-2xl font-semibold text-zinc-50 tabular-nums truncate">
            {value}
          </p>
          {detail && <p className="mt-1 text-xs text-zinc-500 truncate">{detail}</p>}
        </div>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', toneStyles[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
