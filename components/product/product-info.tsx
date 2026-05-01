import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import AddToCartSection from '@/utils/add-to-cart'
import { formatMoney, salePercentOff } from '@/utils/price.utils'
import { stockLabel } from '@/utils/product.utils'
import Link from 'next/link'

type ProductInfoProps = {
  product: WooProduct
  /** Loaded on the product page for variable products */
  variations?: WooProductVariation[]
  className?: string
}

function parsePriceN(value: string | undefined) {
  if (value == null || value === '') return NaN
  return parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
}

function variationPriceRange(variations: WooProductVariation[]) {
  const nums = variations.map(v => parsePriceN(v.price)).filter(n => Number.isFinite(n))
  if (nums.length === 0) return null
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  return { min: min.toFixed(2), max: max.toFixed(2), single: min === max }
}

const ProductInfo = ({ product, variations = [], className }: ProductInfoProps) => {
  const {
    name,
    price,
    brands,
    regular_price,
    on_sale,
    bgn_price,
    sku,
    stock_status,
    type,
    variations: variationIds,
  } = product

  const isVariable = type === 'variable' && variationIds.length > 0
  const vRange = isVariable && variations.length > 0 ? variationPriceRange(variations) : null

  const displayPrice = isVariable && vRange ? vRange.min : price
  const displayRegular = isVariable ? undefined : regular_price
  const percentOff = !isVariable && on_sale ? salePercentOff(regular_price, price) : null

  return (
    <div className={cn('flex flex-col gap-4   lg:pr-1', className)}>
      <div className="space-y-4">
        {brands && brands.length > 0 ? (
          <Link href={`/b/${brands[0].slug}`} className="text-2xl lg:text-3xl font-bold">
            {brands[0].name}
          </Link>
        ) : null}
        <h1 className="text-balance font-medium text-lg tracking-tight text-foreground/80 ">{name}</h1>
      </div>

      

      <AddToCartSection product={product} variations={variations} />
    </div>
  )
}

export default ProductInfo
