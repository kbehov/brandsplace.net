'use client'

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { WooImage } from '@/types/product.types'
import { useCallback, useEffect, useId, useState } from 'react'
import ProductCardImage from '../common/product-card-image'

type ProductImagesProps = {
  images: WooImage[]
  className?: string
}

const ProductCardImages = ({ images, className }: ProductImagesProps) => {
  const carouselLabelId = useId()
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const validImages = images.filter(image => image.src)
  const hasMultipleImages = validImages.length > 1

  const handleSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return

    api.on('select', handleSelect)
    api.on('reInit', handleSelect)

    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
    }
  }, [api, handleSelect])

  return (
    <div className={cn('h-full min-h-0 w-full', className)}>
      <span id={carouselLabelId} className="sr-only">
        Снимки на продукта
      </span>
      <Carousel
        aria-labelledby={carouselLabelId}
        setApi={setApi}
        opts={{
          align: 'start',
          loop: hasMultipleImages,
          duration: 22,
        }}
        className={cn('group/carousel order-1 h-full min-h-0 w-full md:order-2')}
      >
        <CarouselContent>
          {validImages.map((image, index) => {
            return (
              <CarouselItem key={`${image.id}-${image.src}-${index}`} className="h-full pl-0">
                <ProductCardImage image={image} productName={image.alt || image.name || ''} />
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {hasMultipleImages && (
          <>
            {/* Instagram-style bottom gradient + dot pagination */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-linear-to-t from-black/35 via-black/10 to-transparent pb-3 pt-12 md:pb-3.5">
              <div
                className="pointer-events-auto flex max-w-[min(100%,280px)] items-center justify-center gap-1.5 px-3"
                role="group"
                aria-label="Превключване на снимка"
              >
                {validImages.map((_, i) => {
                  const active = selectedIndex === i
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Снимка ${i + 1} от ${validImages.length}`}
                      aria-current={active ? 'true' : undefined}
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        'h-1 min-h-[4px] rounded-full transition-[width,background-color] duration-300 ease-out',
                        active ? 'w-4 bg-white shadow-sm' : 'w-1 min-w-[4px] bg-white/45 hover:bg-white/80',
                      )}
                    />
                  )
                })}
              </div>
            </div>

            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Снимка {selectedIndex + 1} от {validImages.length}
            </p>
          </>
        )}
      </Carousel>
    </div>
  )
}

export default ProductCardImages
