'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

function formatRemaining(ms: number) {
  if (ms <= 0) return null
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

type ProductSaleCountdownProps = {
  /** WooCommerce GMT sale end (ISO-like string) */
  endsAtGmt: string
  className?: string
}

/**
 * Live countdown for scheduled sale end. Renders nothing if the date is invalid or already passed.
 */
export function ProductSaleCountdown({ endsAtGmt, className }: ProductSaleCountdownProps) {
  const [remaining, setRemaining] = useState<number | null>(() => {
    const raw = endsAtGmt.trim()
    if (!raw) return null
    const iso = raw.includes('T') && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw) ? `${raw}Z` : raw
    const end = Date.parse(iso)
    if (!Number.isFinite(end)) return null
    return end - Date.now()
  })

  useEffect(() => {
    const raw = endsAtGmt.trim()
    if (!raw) return
    const iso = raw.includes('T') && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw) ? `${raw}Z` : raw
    const end = Date.parse(iso)
    if (!Number.isFinite(end)) return
    const tick = () => setRemaining(end - Date.now())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endsAtGmt])

  if (remaining === null) return null
  const text = formatRemaining(remaining)
  if (!text) return null

  return (
    <p
      className={cn(
        'inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-sm border border-red-600/25 bg-red-600/5 px-2.5 py-1.5 text-[11px] font-medium leading-tight text-red-800 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-red-700/90 dark:text-red-300/90">Промоцията изтича след</span>
      <span className="font-mono text-[12px] font-semibold tabular-nums tracking-tight text-red-900 dark:text-red-100">
        {text}
      </span>
    </p>
  )
}
