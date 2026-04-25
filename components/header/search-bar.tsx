'use client'

import { cn } from '@/lib/utils'
import type { ProductSearchResponse, SearchProductHit } from '@/types/search.types'
import { Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'

const MIN_QUERY = 2
const DEBOUNCE_MS = 320

function formatMoney(value: string): string {
  if (!value) {
    return '—'
  }
  const n = parseFloat(value)
  if (Number.isNaN(n)) {
    return value
  }
  return new Intl.NumberFormat('bg-BG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<SearchProductHit[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [panelOpen, setPanelOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const listId = useId()
  const inputId = useId()

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      setDebounced(query.trim())
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    if (debounced.length < MIN_QUERY) {
      abortRef.current?.abort()
      return
    }

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    const run = async () => {
      await Promise.resolve()
      if (ac.signal.aborted) {
        return
      }
      setStatus('loading')
      try {
        const res = await fetch(
          `/api/search/products?q=${encodeURIComponent(debounced)}`,
          { signal: ac.signal },
        )
        if (ac.signal.aborted) {
          return
        }
        if (!res.ok) {
          setStatus('error')
          setItems([])
          setTotal(0)
          return
        }
        const data = (await res.json()) as ProductSearchResponse
        if (ac.signal.aborted) {
          return
        }
        setItems(data.items)
        setTotal(data.total)
        setStatus('success')
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') {
          return
        }
        if (!ac.signal.aborted) {
          setStatus('error')
          setItems([])
          setTotal(0)
        }
      }
    }

    void run()

    return () => {
      ac.abort()
    }
  }, [debounced])

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [])

  const showPanel =
    panelOpen &&
    debounced.length >= MIN_QUERY &&
    (status === 'loading' || status === 'success' || status === 'error')

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <label htmlFor={inputId} className="sr-only">
        Търсене на продукти
      </label>
      <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 pl-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow] focus-within:border-foreground/25 focus-within:bg-background/90 focus-within:shadow-[0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.8)] focus-within:ring-2 focus-within:ring-ring/35 dark:border-border/50 dark:bg-input/20 dark:shadow-none dark:focus-within:bg-background/80 dark:focus-within:ring-ring/30 sm:gap-2 sm:pl-3.5">
        {status === 'loading' && debounced.length >= MIN_QUERY ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : (
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
        <Input
          id={inputId}
          type="search"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="search"
          placeholder="Търсене в магазина…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setPanelOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setPanelOpen(false)
            }
          }}
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-9 min-w-0 flex-1 border-0 bg-transparent pr-3 text-[0.8125rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 md:h-10"
        />
      </div>

      {showPanel ? (
        <div
          id={listId}
          className="absolute right-0 left-0 z-80 mt-2 max-h-[min(70vh,22rem)] overflow-hidden rounded-2xl border border-border/50 bg-popover text-sm text-popover-foreground shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] ring-1 ring-foreground/[0.03] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
          role="listbox"
        >
          {status === 'loading' ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-muted-foreground">
              <Loader2 className="size-4 shrink-0 animate-spin" strokeWidth={1.5} />
              <span>Търсене…</span>
            </div>
          ) : null}

          {status === 'error' ? (
            <p className="px-4 py-6 text-center text-destructive">Грешка при търсене.</p>
          ) : null}

          {status === 'success' && items.length === 0 ? (
            <p className="px-4 py-6 text-center text-muted-foreground">
              Няма резултати за &ldquo;{debounced}&rdquo;
            </p>
          ) : null}

          {status === 'success' && items.length > 0 ? (
            <ScrollArea className="h-[min(22rem,70vh)]">
              <ul className="p-1.5">
                {items.map(product => (
                  <li key={product.id} role="presentation">
                    <Link
                      href={`/product/${product.slug}`}
                      role="option"
                      onPointerDown={e => e.preventDefault()}
                      className="flex gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-muted/70 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border/40 bg-muted/30">
                        {product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element -- WooCommerce product URLs are dynamic / external
                          <img
                            src={product.image}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-medium leading-snug text-foreground">
                          {product.name}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-baseline gap-1.5 text-xs text-muted-foreground">
                          {product.on_sale && product.regular_price ? (
                            <>
                              <span className="font-medium text-foreground tabular-nums">
                                {formatMoney(product.price)} лв.
                              </span>
                              <span className="line-through tabular-nums">
                                {formatMoney(product.regular_price)} лв.
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-foreground tabular-nums">
                              {formatMoney(product.price)} лв.
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {total > items.length ? (
                <p className="border-t border-border/50 px-3 py-2 text-center text-[0.7rem] text-muted-foreground">
                  Показани {items.length} от {total}
                </p>
              ) : null}
            </ScrollArea>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default SearchBar
