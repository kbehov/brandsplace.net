'use client'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/hooks/use-products'
import type { GetProductsParams } from '@/services/product.service'
import type { WooProductListItem } from '@/types/product.types'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProductCard from '../cards/product-card'

type ProductsListProps = {
  initialProducts: WooProductListItem[]
  initialTotal: number
  initialTotalPages: number
  page: number
  params: GetProductsParams
}

function ProductsScrollLoader() {
  return (
    <div className="flex justify-center py-8" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
          aria-hidden
        />
        Зареждане на още продукти…
      </div>
    </div>
  )
}

function ProductsScrollEnd() {
  return (
    <p className="py-10 text-center text-sm text-muted-foreground" role="status">
      Няма повече продукти
    </p>
  )
}

const ProductsList = ({ initialProducts, page, initialTotal, initialTotalPages, params }: ProductsListProps) => {
  const { products, isLoading, error, loadMore, hasMore, clearError, retry } = useProducts({
    initialProducts,
    initialPage: page ?? 1,
    initialTotal,
    initialTotalPages,
    params,
  })

  return (
    <div className="space-y-5">
      {error && (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <p className="mb-2 font-medium">Неуспешно зареждане на продукти.</p>
          <Button type="button" variant="outline" size="sm" onClick={retry}>
            Опитай отново
          </Button>
        </div>
      )}

      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<ProductsScrollLoader />}
        endMessage={<ProductsScrollEnd />}
        scrollThreshold={0.65}
        className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5"
      >
        {products.map(product => (
          <ProductCard product={product} key={product.id} />
        ))}
      </InfiniteScroll>

      {isLoading && products.length === 0 && (
        <div className="flex justify-center py-12 text-sm text-muted-foreground" role="status">
          Зареждане…
        </div>
      )}
    </div>
  )
}

export default ProductsList
