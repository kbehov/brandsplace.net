import { SubCategoriesCarousel } from '@/components/carousel/sub-categories-carousel'
import CategoryHero from '@/components/sections/category-hero'
import ProductsList from '@/components/sections/products-list'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getCategories, getCategoryBySlug } from '@/services/categories.service'
import { getProducts, GetProductsParams } from '@/services/product.service'
import { notFound } from 'next/navigation'

const CategoryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) {
    notFound()
  }

  const categoryId = category.id.toString()
  const productParams: GetProductsParams = { category: categoryId, status: 'publish', per_page: 30 }

  const [subCategories, { items: products, total, totalPages }] = await Promise.all([
    getCategories({ parent: category.id, order: 'desc', orderby: 'count' }),
    getProducts(productParams),
  ])

  const items = subCategories.items

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="transition-colors hover:text-foreground">
              Начало
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3" />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[min(100%,42rem)] truncate font-medium text-foreground">
              {category.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CategoryHero category={category} />

      {items.length > 0 ? <SubCategoriesCarousel categories={items} /> : null}

      <ProductsList
        key={category.id}
        initialProducts={products}
        page={1}
        initialTotal={total}
        initialTotalPages={totalPages}
        params={productParams}
      />
    </div>
  )
}

export default CategoryPage
