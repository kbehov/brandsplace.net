'use client'

import { storeConfig } from '@/config/store.config'
import { RotateCcw, Sun, Truck, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

const ROTATION_MS = 5500
const CROSSFADE_MS = 420

const ANNOUNCEMENTS: readonly {
  id: 'shipping' | 'summer' | 'newsletter' | 'returns'
  label: string
  text: string
  icon: LucideIcon
}[] = [
  {
    id: 'shipping',
    label: 'Безплатна доставка',
    text: `Безплатна доставка за поръчки над ${String(storeConfig.FREE_SHIPPING_THRESHOLD)} лв.`,
    icon: Truck,
  },
  {
    id: 'summer',
    label: 'Промоция',
    text: '−40% на избрани артикули · лятна разпродажба',
    icon: Sun,
  },

  {
    id: 'returns',
    label: 'Покупка без риск',
    text: '14 дни право на връщане за онлайн поръчки',
    icon: RotateCcw,
  },
] as const

const TopBar = () => {
  const n = ANNOUNCEMENTS.length
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const paused = useRef(false)
  const liveId = useId()

  useEffect(() => {
    if (n <= 1) {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const id = window.setInterval(() => {
      if (paused.current) {
        return
      }
      setVisible(false)
      window.setTimeout(() => {
        setIndex(i => (i + 1) % n)
        setVisible(true)
      }, CROSSFADE_MS)
    }, ROTATION_MS)
    return () => window.clearInterval(id)
  }, [n])

  const current = ANNOUNCEMENTS[index]
  const BarIcon = current?.icon

  return (
    <div
      className="relative z-60 border-b border-foreground/12 bg-foreground text-background"
      onMouseEnter={() => {
        paused.current = true
      }}
      onMouseLeave={() => {
        paused.current = false
      }}
    >
      <div
        className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 sm:h-10 sm:px-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id={liveId}
      >
        <div
          className="flex max-w-4xl items-center justify-center gap-2.5 text-center text-[0.6875rem] font-medium leading-snug tracking-wide text-background/90 transition-[opacity,transform] ease-out sm:gap-3 sm:text-[0.8125rem]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transitionDuration: `${CROSSFADE_MS}ms`,
          }}
        >
          <span className="sr-only">{current?.label}: </span>
          {BarIcon ? (
            <BarIcon className="size-3.5 shrink-0 text-background/70 sm:size-4" strokeWidth={1.35} aria-hidden />
          ) : null}
          <span>{current?.text}</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
