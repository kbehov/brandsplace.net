'use client'

import SubCategoryCard from '@/components/cards/sub-category-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'

const CAROUSEL_IMAGE_SIZES = '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 24vw, 280px'

type SubCategoriesCarouselProps = {
  categories: WooProductCategory[]
  className?: string
  /** Visible heading above the track (default: subtle label) */
  title?: string
}

export function SubCategoriesCarousel({ categories, className, title = 'Подкатегории' }: SubCategoriesCarouselProps) {
  const headingId = 'sub-categories-carousel-heading'

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8"></div>

      <Carousel
        opts={{
          align: 'start',
          loop: false,
          containScroll: 'trimSnaps',
        }}
        className="relative w-full"
        aria-label={title}
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {categories.map(category => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 pl-3 sm:basis-2/5 sm:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <SubCategoryCard category={category} imageSizes={CAROUSEL_IMAGE_SIZES} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="left-2 top-1/2 z-20 size-9 -translate-y-1/2 border-border/70 bg-background/90 shadow-sm backdrop-blur-sm sm:left-3"
        />
        <CarouselNext
          variant="outline"
          className="right-2 top-1/2 z-20 size-9 -translate-y-1/2 border-border/70 bg-background/90 shadow-sm backdrop-blur-sm sm:right-3"
        />
      </Carousel>
    </div>
  )
}
