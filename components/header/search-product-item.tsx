import { cn } from '@/lib/utils'
import type { SearchProductHit } from '@/types/search.types'
import Link from 'next/link'

function formatSearchPrice(value: string): string {
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

type SearchProductItemProps = {
  product: SearchProductHit
  className?: string
}

export function SearchProductItem({ product, className }: SearchProductItemProps) {
  const href = `/p/${product.slug}`

  return (
    <li role="presentation" className={cn('list-none', className)}>
      <Link
        href={href}
        role="option"
        onPointerDown={e => e.preventDefault()}
        className={cn(
          'group flex gap-3 rounded-[0.75rem] px-2 py-2 sm:px-2.5 sm:py-2.5',
          'transition-[background-color,box-shadow] duration-200 ease-out',
          'outline-none hover:bg-muted/70 active:bg-muted/85',
          'focus-visible:bg-muted/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/55',
        )}
      >
        <div
          className={cn(
            'relative size-12 shrink-0 overflow-hidden rounded-[10px]',
            'border border-border/45 bg-muted/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)]',
            'dark:border-border/35 dark:bg-muted/25 dark:shadow-none',
            'transition-transform duration-200 ease-out group-hover:scale-[1.02]',
          )}
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- WooCommerce product URLs are dynamic / external
            <img src={product.image} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-[0.625rem] font-medium text-muted-foreground/60">
              —
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <p className="line-clamp-2 text-[0.8125rem] font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-sm">
            {product.name}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.6875rem] text-muted-foreground sm:text-xs">
            {product.on_sale && product.regular_price ? (
              <>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatSearchPrice(product.price)} лв.
                </span>
                <span className="tabular-nums line-through decoration-border/80">
                  {formatSearchPrice(product.regular_price)} лв.
                </span>
              </>
            ) : (
              <span className="font-semibold tabular-nums text-foreground">{formatSearchPrice(product.price)} лв.</span>
            )}
          </p>
        </div>
      </Link>
    </li>
  )
}
