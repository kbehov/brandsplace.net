import ProductCardSaleTriggers from '@/components/product-card-triggers'
import { cn } from '@/lib/utils'
import type { WooProductListItem } from '@/types/product.types'
import { getColorAttribute } from '@/utils/attributes.utils'
import { parseAmount } from '@/utils/price.utils'
import Link from 'next/link'
import { useState } from 'react'
import { AddToWishlistButton } from '../buttons/add-to-wishlist'
import ProductCardImages from '../carousel/product-card-carousel'
import ProductCardColors from '../common/product-card-colors'
import ProductCardImage from '../common/product-card-image'
import { Badge } from '../ui/badge'
type ProductCardProps = {
  product: WooProductListItem
  imageSizes?: string
  priority?: boolean
}

const NEW_PRODUCT_MS = 1000 * 60 * 60 * 24 * 50 // 10 days

function salePercentOff(regular: string, current: string): number | null {
  const r = parseAmount(regular)
  const c = parseAmount(current)
  if (r === null || c === null || r <= 0 || c >= r) return null
  return Math.round((1 - c / r) * 100)
}

const BADGE_BASE = 'rounded-sm px-2 py-0.5 text-[10px] font-medium tracking-[0.07em] '

const ProductCard = ({ product }: ProductCardProps) => {
  const [referenceNowMs] = useState(() => Date.now())

  const {
    name,
    slug,
    images,
    regular_price,
    sale_price,
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
    total_sales,
  } = product

  const primaryImage = images?.[0]
  const colors = getColorAttribute(attributes)
  const hasMultipleImages = images.length > 1
  const isNewProduct = new Date(date_created).getTime() > referenceNowMs - NEW_PRODUCT_MS
  const isOutOfStock = stock_status === 'outofstock'
  const hasVariations = type === 'variable' && variations.length > 0
  const percentOff = on_sale ? salePercentOff(regular_price, sale_price) : null
  const ratingValue = parseAmount(average_rating)
  const showRating = rating_count > 0 && ratingValue !== null && ratingValue > 0

  const priceLabel = on_sale ? `${price} €, предишна цена ${regular_price} €` : `${price} € / ${bgn_price} лв.`

  return (
    <Link
      href={`/p/${slug}`}
      aria-label={`${name}. ${priceLabel}.`}
      className={cn(
        'group flex min-w-0 w-full flex-col gap-2.5 outline-none relative',
        'rounded-lg transition-[transform] duration-200',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:-translate-y-0.5 active:scale-[0.99]',
        isOutOfStock && 'opacity-70',
      )}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted ring-1 ring-border/40 z-10">
        {hasMultipleImages ? (
          <ProductCardImages images={images} />
        ) : (
          <ProductCardImage image={primaryImage} productName={name} />
        )}

        {/* Wishlist button — revealed on hover */}
        <AddToWishlistButton product={product} />

        {/* Top-right badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-start gap-1.5 p-2">
          {featured && (
            <Badge variant="secondary" className={cn(BADGE_BASE, 'bg-background/90 text-foreground backdrop-blur-sm')}>
              Препоръчан
            </Badge>
          )}
          {percentOff !== null && percentOff > 0 && (
            <Badge variant="destructive" className="bg-red-600 rounded-sm text-white">
              −{percentOff}%
            </Badge>
          )}
        </div>

        {/* "New" — left-edge flush badge */}
        {isNewProduct && (
          <div className="pointer-events-none absolute bottom-2 left-0">
            <span
              className={cn(
                BADGE_BASE,
                'rounded-l-none rounded-r-sm bg-background text-primary',
                'border-y border-r border-border/30 px-2.5 py-1',
              )}
            >
              Ново
            </span>
          </div>
        )}
        {(hasVariations || (colors && colors.length > 1)) && (
          <div className="pointer-events-none absolute bottom-2 right-1">
            <ProductCardColors colors={colors ?? []} />
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1.5px]">
            <span className="rounded-sm bg-background/95 px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-foreground ring-1 ring-border/50">
              Изчерпан
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 w-full flex-col gap-1 px-0.5">
        <span className="line-clamp-1 text-[13px] font-medium leading-snug tracking-tight text-foreground ">
          {name}
        </span>

        {showRating && (
          <p
            className="flex items-center gap-1.5"
            aria-label={`Оценка ${ratingValue!.toFixed(1)} от 5, ${rating_count} отзива`}
          >
            {/* Filled star strip */}
            <span className="text-amber-400 text-[11px]" aria-hidden>
              {'★'.repeat(Math.round(ratingValue!))}
              {'☆'.repeat(5 - Math.round(ratingValue!))}
            </span>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {ratingValue!.toFixed(1)} ({rating_count})
            </span>
          </p>
        )}

        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span
            className={cn(
              'text-[15px] tabular-nums tracking-tight font-semibold',
              on_sale ? 'text-red-600 ' : 'text-foreground',
            )}
          >
            {price} €
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground/80">{bgn_price} лв.</span>
        </div>
      </div>
      <ProductCardSaleTriggers
        discountPercentage={percentOff ?? 0}
        discountAmount={percentOff ? (parseAmount(regular_price) ?? 0) - (parseAmount(price) ?? 0) : 0}
        totalSales={total_sales ?? 0}
        ratingCount={rating_count}
        averageRating={ratingValue ?? 0}
        stockQty={stock_status === 'instock' ? 10 : 0}
      />
    </Link>
  )
}

export default ProductCard
