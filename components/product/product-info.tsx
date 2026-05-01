import { cn } from '@/lib/utils'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import AddToCartSection from '@/utils/add-to-cart'
import Link from 'next/link'

type ProductInfoProps = {
  product: WooProduct
  /** Loaded on the product page for variable products */
  variations?: WooProductVariation[]
  className?: string
}

function plainText(value: string | undefined) {
  return value?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? ''
}

const ProductInfo = ({ product, variations = [], className }: ProductInfoProps) => {
  const { name, brands, short_description } = product
  const shortDescription = plainText(short_description)

  return (
    <section className={cn('flex min-w-0 flex-col gap-6 lg:pr-1', className)} aria-labelledby="product-title">
      <div className="space-y-3">
        {brands && brands.length > 0 ? (
          <Link
            href={`/b/${brands[0].slug}`}
            translate="no"
            className="inline-flex w-fit text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {brands[0].name}
          </Link>
        ) : null}
        <h1
          id="product-title"
          className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {name}
        </h1>
        {shortDescription ? (
          <p className="max-w-prose text-pretty text-sm leading-relaxed text-muted-foreground">{shortDescription}</p>
        ) : null}
      </div>

      <AddToCartSection product={product} variations={variations} />
    </section>
  )
}

export default ProductInfo
