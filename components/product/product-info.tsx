import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { WooProduct } from '@/types/product.types'
import AddToCartSection from '@/utils/add-to-cart'
import { formatMoney, salePercentOff } from '@/utils/price.utils'
import { stockLabel } from '@/utils/product.utils'
import Link from 'next/link'
type ProductInfoProps = {
  product: WooProduct
  className?: string
}

const ProductInfo = ({ product, className }: ProductInfoProps) => {
  const {
    name,
    price,
    brands,
    regular_price,
    on_sale,
    bgn_price,
    sku,
    stock_status,
    purchasable,
    short_description,
    description,
    categories,
    type,
    variations,
  } = product

  const percentOff = on_sale ? salePercentOff(regular_price, price) : null
  const isVariable = type === 'variable' && variations.length > 0

  const detailsHtml = description?.trim()
  const shortHtml = short_description?.trim()
  const showDetailsSection = !!detailsHtml && detailsHtml.replace(/\s/g, '') !== shortHtml?.replace(/\s/g, '')

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col gap-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto',
        className,
      )}
    >
      <div className="space-y-3">
        {brands && brands.length > 0 && (
          <Link href={`/b/${brands[0].slug}`} className="text-3xl  font-black">
            {brands[0].name}
          </Link>
        )}
        <h1 className="text-balance text-lg font-normal  tracking-tight text-foreground/80 ">{name}</h1>
      </div>

      <div className="block space-y-2">
        {on_sale && (
          <div className="bg-red-600 w-fit text-white px-2 py-1 rounded-md">
            <p className="text-xs font-medium">НАМАЛЕНИЕ</p>
          </div>
        )}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl font-medium tabular-nums text-red-600 tracking-tight">
              {formatMoney(price)} €
            </span>
            {on_sale && regular_price ? (
              <span className="text-base tabular-nums text-muted-foreground line-through decoration-muted-foreground/60">
                {formatMoney(regular_price)} €
              </span>
            ) : null}
            {percentOff !== null ? (
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                −{percentOff}%
              </Badge>
            ) : null}
          </div>
          <span className="text-sm tabular-nums text-muted-foreground">/ {formatMoney(bgn_price)} лв.</span>

          <p
            className={cn(
              'text-xs font-medium uppercase tracking-[0.16em]',
              stock_status === 'instock' ? 'text-foreground/80' : 'text-muted-foreground',
            )}
          >
            {stockLabel(stock_status)}
            {sku ? <span className="ml-2 text-muted-foreground normal-case tracking-normal">· SKU {sku}</span> : null}
          </p>
        </div>
      </div>

      <AddToCartSection product={product} />

      {showDetailsSection ? (
        <section className="border-t border-border/60 pt-8">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Детайли</h2>
          <div
            className="product-desc max-w-prose text-sm leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-foreground [&_li]:mb-1 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: detailsHtml }}
          />
        </section>
      ) : null}

      {categories.length > 1 ? (
        <footer className="border-t border-border/60 pt-6">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Категории</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <li key={cat.id}>
                <Link
                  href={`/c/${cat.slug}`}
                  className="inline-flex rounded-sm border border-border/80 bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-border hover:bg-muted"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </div>
  )
}

export default ProductInfo
