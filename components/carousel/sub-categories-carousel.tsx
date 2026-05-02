'use client'

import SubCategoryCard from '@/components/cards/sub-category-card'
import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'

type SubCategoriesCarouselProps = {
  categories: WooProductCategory[]
  className?: string
  /** Visible heading above the track */
  title?: string
}

const DEFAULT_TITLE = 'Препоръчани категории'

export function SubCategoriesCarousel({ categories, className, title = DEFAULT_TITLE }: SubCategoriesCarouselProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full ', className)}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <div className="flex flex-row flex-nowrap lg:flex-wrap items-end justify-between gap-4 overflow-x-auto pb-4 lg:w-fit">
        {categories.map(category => (
          <SubCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
