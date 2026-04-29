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

  return (
    <article className="w-full px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pt-9">
      <ProductBreadcrumb product={product} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
        <div className="min-w-0">
          <ProductImages images={product.images ?? []} />
        </div>
        <ProductInfo product={product} />
      </div>
    </article>
  )
}

export default ProductPage
