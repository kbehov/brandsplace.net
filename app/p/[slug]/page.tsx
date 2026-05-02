import ProductImages from '@/components/product/product-images'
import ProductInfo from '@/components/product/product-info'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getProductBySlug } from '@/services/product.service'
import { getVariationsByIds } from '@/services/variation.service'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return { title: 'Продукт' }
  }
  const description =
    product.short_description
      ?.replace(/<[^>]+>/g, '')
      .trim()
      .slice(0, 160) ||
    product.description
      ?.replace(/<[^>]+>/g, '')
      .trim()
      .slice(0, 160) ||
    undefined
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0]?.src ? [{ url: product.images[0].src }] : undefined,
    },
  }
}

function ProductBreadcrumb({ product }: { product: WooProduct }) {
  const primary = product.categories[0]

  return (
    <Breadcrumb className="mb-6 ">
      <BreadcrumbList className="text-xs font-medium  text-muted-foreground">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="hover:text-foreground">
            Начало
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3" />
        {primary ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/c/${primary.slug}`} className="hover:text-foreground">
                {primary.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3" />
          </>
        ) : null}
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 max-w-[min(100%,28rem)] font-medium text-foreground">
            {product.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  let variations: WooProductVariation[] = []
  if (product.type === 'variable' && product.variations.length > 0) {
    const { items } = await getVariationsByIds(product.id, product.variations, {
      per_page: Math.min(100, Math.max(1, product.variations.length)),
    })
    variations = items
  }

  return (
    <div>
      <ProductBreadcrumb product={product} />
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-10 lg:gap-x-10 lg:gap-y-0 ">
        <div className="min-w-0 lg:col-span-5">
          <ProductImages images={product.images ?? []} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <ProductInfo product={product} variations={variations} />
        </div>
      </div>
    </div>
  )
}

export default ProductPage
