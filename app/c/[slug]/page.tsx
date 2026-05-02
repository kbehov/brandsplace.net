import ProductCard from '@/components/cards/product-card'
import { SubCategoriesCarousel } from '@/components/carousel/sub-categories-carousel'
import CategoryHero from '@/components/sections/category-hero'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getCategories, getCategoryBySlug } from '@/services/categories.service'
import { getProducts } from '@/services/product.service'
import { notFound } from 'next/navigation'

const CategoryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  const subCategories = await getCategories({ parent: category?.id })
  if (!category) {
    notFound()
  }

  const items = subCategories.items
  const products = await getProducts({ category: category?.id.toString(), status: 'publish' })

  return (
    <div>
      <Breadcrumb className="mb-8 sm:mb-10">
        <BreadcrumbList className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="hover:text-foreground">
              Начало
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-muted-foreground/50 [&>svg]:size-3" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CategoryHero category={category} className="mb-4" />

      {items.length && <SubCategoriesCarousel categories={items} className="mb-4" />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-10">
        {products.items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
