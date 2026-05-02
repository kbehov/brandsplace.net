'use client'

import { SearchProductItem } from '@/components/header/search-product-item'
import { SearchTrendingCategories } from '@/components/header/search-trending-categories'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ProductSearchResponse, SearchProductHit, SearchTrendingCategory } from '@/types/search.types'
import { Loader2, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'

const MIN_QUERY = 2
const DEBOUNCE_MS = 320
const MD_BREAKPOINT = 768
const SCROLL_DOWN_HIDE_DELTA = 6
const SCROLL_UP_SHOW_DELTA = -6

type SearchBarProps = {
  /** Top categories by product count; from `categegoriesForSearch` in layout. */
  trendingCategories: SearchTrendingCategory[]
  className?: string
}

function SearchBar({ trendingCategories, className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<SearchProductHit[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [panelOpen, setPanelOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const lastScrollY = useRef(0)
  const listId = useId()
  const inputId = useId()

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      setDebounced(query.trim())
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`)
    const sync = () => setIsMobileLayout(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') {
        return
      }
      if (window.innerWidth >= MD_BREAKPOINT) {
        return
      }

      const y = window.scrollY
      const delta = y - lastScrollY.current
      lastScrollY.current = y

      if (y < 32) {
        setIsHidden(false)
        return
      }

      if (delta > SCROLL_DOWN_HIDE_DELTA) {
        setIsHidden(true)
        setPanelOpen(false)
      } else if (delta < SCROLL_UP_SHOW_DELTA) {
        setIsHidden(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`)
    const clearHideOnDesktop = () => {
      if (mq.matches) {
        setIsHidden(false)
      }
    }
    mq.addEventListener('change', clearHideOnDesktop)
    return () => mq.removeEventListener('change', clearHideOnDesktop)
  }, [])

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
        const res = await fetch(`/api/search/products?q=${encodeURIComponent(debounced)}`, { signal: ac.signal })
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

  const showSearchMode = debounced.length >= MIN_QUERY

  return (
    <div className={cn('relative min-w-0', className)}>
      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none',
          isHidden
            ? 'pointer-events-none max-h-0 -translate-y-1 opacity-0 md:pointer-events-auto md:max-h-13 md:translate-y-0 md:opacity-100'
            : 'max-h-13 translate-y-0 opacity-100',
        )}
        aria-hidden={isHidden && isMobileLayout ? true : undefined}
      >
        <DropdownMenu open={panelOpen} onOpenChange={setPanelOpen} modal={false}>
          <label htmlFor={inputId} className="sr-only shadow-none">
            Търсене на продукти
          </label>
          <DropdownMenuTrigger asChild>
            <div className="flex min-w-0 cursor-text items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 pl-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow,background-color] focus-within:border-border focus-within:bg-background/90 focus-within:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring/40 dark:border-border/50 dark:bg-input/20 dark:shadow-none dark:focus-within:border-border/80 dark:focus-within:bg-background/80 dark:focus-within:ring-ring/35 sm:gap-2 sm:pl-3.5">
              {status === 'loading' && showSearchMode ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" strokeWidth={1.5} aria-hidden />
              ) : (
                <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
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
                aria-expanded={panelOpen}
                aria-controls={listId}
                aria-autocomplete={showSearchMode ? 'list' : 'none'}
                className="h-9 min-w-0 flex-1 border-0 bg-transparent pr-3 text-[0.8125rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 md:h-10"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            id={listId}
            align="start"
            sideOffset={8}
            onCloseAutoFocus={e => e.preventDefault()}
            className={cn(
              'z-80 max-h-[min(70vh,22rem)] min-w-0 overflow-hidden rounded-2xl border border-border/50 p-0 text-sm shadow-none',
            )}
            role={showSearchMode ? 'listbox' : 'region'}
            aria-label={showSearchMode ? undefined : 'Популярни категории'}
          >
            {!showSearchMode ? (
              <ScrollArea className="h-[min(22rem,70vh)]">
                <SearchTrendingCategories categories={trendingCategories} />
              </ScrollArea>
            ) : null}

            {showSearchMode && status === 'loading' ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-muted-foreground">
                <Loader2 className="size-4 shrink-0 animate-spin" strokeWidth={1.5} />
                <span>Търсене…</span>
              </div>
            ) : null}

            {showSearchMode && status === 'error' ? (
              <p className="px-4 py-6 text-center text-destructive">Грешка при търсене.</p>
            ) : null}

            {showSearchMode && status === 'success' && items.length === 0 ? (
              <p className="px-4 py-6 text-center text-muted-foreground">Няма резултати за &ldquo;{debounced}&rdquo;</p>
            ) : null}

            {showSearchMode && status === 'success' && items.length > 0 ? (
              <ScrollArea className="h-[min(22rem,70vh)]">
                <ul className="space-y-0.5 p-1.5">
                  {items.map(product => (
                    <SearchProductItem key={product.id} product={product} />
                  ))}
                </ul>
                {total > items.length ? (
                  <p className="border-t border-border/50 px-3 py-2 text-center text-[0.7rem] text-muted-foreground">
                    Показани {items.length} от {total}
                  </p>
                ) : null}
              </ScrollArea>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SearchBar
