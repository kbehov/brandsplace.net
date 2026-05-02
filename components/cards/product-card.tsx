import { cn } from '@/lib/utils'
import type { WooProductListItem } from '@/types/product.types'
import { getColorAttribute } from '@/utils/attributes.utils'
import Image from 'next/image'
import Link from 'next/link'
import ProductCardColors from '../common/product-card-colors'
import { Badge } from '../ui/badge'

type ProductCardProps = {
  product: WooProductListItem
  /** Override for `next/image` when used in carousels vs grids */
  imageSizes?: string
}

const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'

const NEW_PRODUCT_MS = 1000 * 60 * 60 * 24 * 10

function parseAmount(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function salePercentOff(regular: string, current: string): number | null {
  const r = parseAmount(regular)
  const c = parseAmount(current)
  if (r === null || c === null || r <= 0 || c >= r) return null
  return Math.round((1 - c / r) * 100)
}

const ProductCard = ({ product, imageSizes }: ProductCardProps) => {
  const {
    name,
    slug,
    images,
    regular_price,
    price,
    on_sale,
    bgn_price,
    attributes,
    stock_status,
    featured,
    variations,
    date_created,
    average_rating,
    rating_count,
    type,
  } = product

  const primaryImage = images?.[0]
  const alt = primaryImage?.alt?.trim() || name
  const colors = getColorAttribute(attributes)
  // eslint-disable-next-line react-hooks/purity -- “New” badge uses request-time window (SSR snapshot)
  const nowMs = Date.now()
  const isNewProduct = new Date(date_created).getTime() > nowMs - NEW_PRODUCT_MS
  const isOutOfStock = stock_status === 'outofstock'
  const hasVariations = type === 'variable' && variations.length > 0
  const percentOff = on_sale ? salePercentOff(regular_price, price) : null
  const ratingValue = parseAmount(average_rating)
  const showRating = rating_count > 0 && ratingValue !== null && ratingValue > 0

  const priceLabel = on_sale ? `${price} €, предишна цена ${regular_price} €` : `${price} € / ${bgn_price} лв.`

  return (
    <Link
      href={`/p/${slug}`}
      aria-label={`${name}. ${priceLabel}.`}
      className={cn(
        'group flex min-w-0 w-full flex-col gap-3 outline-none transition-[opacity,transform,box-shadow] duration-300',
        'rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'hover:opacity-[0.97] active:scale-[0.99]',
        'hover:shadow-md hover:shadow-foreground/5',
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted ring-1 ring-border/40 transition-[ring-color] duration-300 group-hover:ring-border/80">
        {primaryImage?.src ? (
          <Image
            src={primaryImage.src}
            alt={alt}
            fill
            className={cn(
              'object-cover transition-transform duration-500 ease-out',
              'group-hover:scale-[1.04]',
              isOutOfStock && 'opacity-55 grayscale-[0.35]',
            )}
            sizes={imageSizes ?? DEFAULT_IMAGE_SIZES}
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center font-light text-3xl tracking-wide text-muted-foreground/35"
            aria-hidden
          >
            {name.trim().charAt(0).toUpperCase()}
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-end gap-1.5 p-2">
          {featured && (
            <Badge
              variant="secondary"
              className="rounded-sm border-border/60 bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm"
            >
              Препоръчан
            </Badge>
          )}
          {percentOff !== null && percentOff > 0 && (
            <Badge
              variant="destructive"
              className="rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest shadow-sm"
            >
              −{percentOff}%
            </Badge>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-wrap items-end justify-start gap-1.5 ">
          {isNewProduct && (
            <Badge className="rounded-r-sm rounded-l-none border-0 bg-background/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur-sm">
              Ново
            </Badge>
          )}
        </div>

        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/25 p-4 backdrop-blur-[1px]">
            <span className="rounded-sm bg-background/95 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground shadow-md ring-1 ring-border/60">
              Изчерпан
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 w-full flex-col items-center gap-1.5 px-0.5">
        <span className="  text-left text-[15px] font-normal leading-snug tracking-[-0.01em] text-foreground transition-colors group-hover:text-foreground/90 line-clamp-1">
          {name}
        </span>

        {showRating && (
          <p
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
            aria-label={`Оценка ${ratingValue!.toFixed(1)} от 5, ${rating_count} отзива`}
          >
            <span className="text-amber-500 tabular-nums" aria-hidden>
              ★
            </span>
            <span className="font-medium tabular-nums text-foreground/85">{ratingValue!.toFixed(1)}</span>
            <span className="text-muted-foreground/80">({rating_count})</span>
          </p>
        )}

        <div className="flex flex-col gap-0.5">
          {on_sale ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-base font-semibold tabular-nums tracking-tight text-foreground">{price} €</span>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">{bgn_price} лв.</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-base font-semibold tabular-nums tracking-tight text-foreground">{price} €</span>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {bgn_price} лв.
              </span>
            </div>
          )}
        </div>

        {(hasVariations || (colors && colors.length > 0)) && <ProductCardColors colors={colors ?? []} />}
      </div>
    </Link>
  )
}

export default ProductCard
