import AddToCartSection from '@/components/product/add-to-cart'
import { cn } from '@/lib/utils'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import { formatMoney, parseAmount } from '@/utils/price.utils'
import Link from 'next/link'

type ProductInfoProps = {
  product: WooProduct
  /** Loaded on the product page for variable products */
  variations?: WooProductVariation[]
  className?: string
}

function plainText(value: string | undefined) {
  return (
    value
      ?.replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim() ?? ''
  )
}

/** Stable “busy aisle” signal derived from product id (no PII, SSR-safe). */
function viewingEstimate(productId: number) {
  return 16 + ((productId * 37) % 71)
}

function scarcityMessage(product: WooProduct): string | null {
  const simpleLike = product.type === 'simple' || product.type === 'external'
  if (!simpleLike || !product.manage_stock || product.stock_quantity == null) return null
  if (product.stock_status !== 'instock') return null
  const q = product.stock_quantity
  if (q <= 0) return null
  const threshold = product.low_stock_amount != null ? Math.max(product.low_stock_amount, 1) : 8
  if (q > threshold) return null
  return q === 1 ? 'Само 1 брой остава на склад.' : `Остават само ${q} броя на склад.`
}

function savingsEurLine(product: WooProduct): string | null {
  if (product.type === 'variable') return null
  if (!product.on_sale) return null
  const regular = parseAmount(product.regular_price)
  const current = parseAmount(product.sale_price || product.price)
  if (regular === null || current === null || current >= regular) return null
  return `Спестете ${formatMoney(regular - current)} €`
}

const ProductInfo = ({ product, variations = [], className }: ProductInfoProps) => {
  const { name, brands } = product

  const viewers = viewingEstimate(product.id)

  const socialParts: string[] = []
  if (product.total_sales >= 8) {
    socialParts.push(`Над ${product.total_sales} успешни поръчки`)
  }
  socialParts.push(`Около ${viewers} души разглеждат тази страница в момента.`)

  return (
    <section className={cn('flex min-w-0 flex-col gap-4 lg:gap-6', className)} aria-labelledby="product-title">
      <div className="space-y-2 lg:space-y-3">
        {brands && brands.length > 0 ? (
          <Link
            href={`/b/${brands[0].slug}`}
            translate="no"
            className="inline-flex w-fit text-xl font-semibold uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {brands[0].name}
          </Link>
        ) : null}
        <h1 id="product-title" className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {name}
        </h1>
      </div>

      <AddToCartSection product={product} variations={variations} />
    </section>
  )
}

export default ProductInfo
