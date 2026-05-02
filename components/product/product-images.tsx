'use client'

import { ImageZoom } from '@/components/animate-ui/primitives/effects/image-zoom'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { WooImage } from '@/types/product.types'
import Image from 'next/image'
import { useCallback, useEffect, useId, useState, useSyncExternalStore } from 'react'

function usePrefersCoarsePointer() {
  return useSyncExternalStore(
    subscribeCoarsePointer,
    () => (typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false),
    () => false,
  )
}

function subscribeCoarsePointer(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const mq = window.matchMedia('(pointer: coarse)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

type ProductImagesProps = {
  images: WooImage[]
  className?: string
}

const MAIN_IMAGE_SIZES = '(max-width: 1024px) 100vw, (max-width: 1536px) 48vw, 640px'
const THUMB_IMAGE_SIZES = '(max-width: 768px) 20vw, 96px'

const ProductImages = ({ images, className }: ProductImagesProps) => {
  const carouselLabelId = useId()
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const disableImageZoom = usePrefersCoarsePointer()

  const validImages = images.filter(image => image.src)
  const hasMultipleImages = validImages.length > 1

  const handleSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  const handleThumbnailClick = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  useEffect(() => {
    if (!api) return

    api.on('select', handleSelect)
    api.on('reInit', handleSelect)

    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
    }
  }, [api, handleSelect])

  if (validImages.length === 0) {
    return (
      <section className={cn('w-full', className)} aria-labelledby={carouselLabelId}>
        <h2 id={carouselLabelId} className="sr-only">
          Снимки на продукта
        </h2>
        <div className="flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-sm bg-muted/80 ring-1 ring-border/40">
          <span className="px-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
            Няма налична снимка
          </span>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('w-full', className)} aria-labelledby={carouselLabelId}>
      <h2 id={carouselLabelId} className="sr-only">
        Снимки на продукта
      </h2>

      <div
        className={cn(
          'grid gap-3 md:gap-5',
          // Single image: avoid `auto` + Embla `basis-full` circular min-width — desktop column can collapse to 0.
          hasMultipleImages ? 'md:grid-cols-[auto_minmax(0,1fr)]' : 'md:grid-cols-1',
        )}
      >
        {hasMultipleImages && (
          <div
            className="order-2 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:order-1 md:max-h-[min(76vh,52rem)] md:snap-none md:flex-col md:gap-3 md:overflow-y-auto md:overflow-x-hidden md:pb-0 md:pr-0.5 [&::-webkit-scrollbar]:hidden"
            aria-label="Миниатюри на продукта"
          >
            {validImages.map((image, index) => {
              const isSelected = selectedIndex === index
              const thumbnailAlt = image.alt?.trim() || image.name?.trim() || `Снимка ${index + 1} на продукта`

              return (
                <button
                  key={`${image.id}-${image.src}`}
                  type="button"
                  aria-label={`Покажи ${thumbnailAlt}`}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    'group relative aspect-3/4 w-18 shrink-0 snap-start overflow-hidden rounded-sm bg-muted transition-[box-shadow,transform] duration-200 sm:w-20 md:w-24',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSelected
                      ? 'ring-2 ring-foreground shadow-md ring-offset-2 ring-offset-background md:ring-offset-0'
                      : 'ring-1 ring-black/8 hover:ring-black/20 dark:ring-border/50 dark:hover:ring-border',
                  )}
                >
                  {isSelected ? (
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 z-10 hidden h-full w-0.5 rounded-l-sm bg-foreground md:block"
                    />
                  ) : null}
                  <Image
                    src={image.thumbnail || image.src}
                    alt={thumbnailAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                    sizes={THUMB_IMAGE_SIZES}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-0 bg-background/0 transition-colors',
                      !isSelected && 'group-hover:bg-background/10',
                    )}
                  />
                </button>
              )
            })}
          </div>
        )}

        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: hasMultipleImages,
            duration: 22,
          }}
          className={cn(
            'group/carousel order-1 min-w-0 w-full md:order-2',
            hasMultipleImages && 'relative',
          )}
          aria-label="Галерия със снимки на продукта"
        >
          <CarouselContent className="ml-0">
            {validImages.map((image, index) => {
              const alt = image.alt?.trim() || image.name?.trim() || `Снимка ${index + 1} на продукта`

              return (
                <CarouselItem key={`${image.id}-${image.src}`} className="pl-0">
                  <div className="relative aspect-3/4 w-full overflow-hidden rounded-sm bg-muted ring-1 ring-black/6 dark:ring-border/40">
                    <ImageZoom
                      className="rounded-sm"
                      style={{ position: 'absolute', inset: 0 }}
                      zoomScale={2.25}
                      zoomOnHover
                      zoomOnClick={false}
                      disabled={disableImageZoom}
                      transition={{ type: 'spring', stiffness: 220, damping: 32 }}
                    >
                      <Image
                        src={image.src}
                        alt={alt}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes={MAIN_IMAGE_SIZES}
                      />
                    </ImageZoom>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {hasMultipleImages && (
            <>
              {/* Desktop: light circular controls (feed-style); mobile: swipe — arrows hidden */}
              <CarouselPrevious
                variant="outline"
                className="left-2 top-1/2 z-20 hidden size-8 -translate-y-1/2 rounded-full border-0 bg-white/90 text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm hover:bg-white disabled:hidden md:flex md:opacity-0 md:transition-opacity md:duration-200 md:motion-safe:group-hover/carousel:opacity-100 md:group-focus-within/carousel:opacity-100 dark:bg-black/50 dark:text-white dark:hover:bg-black/65 dark:shadow-none [&>svg]:size-4"
              />
              <CarouselNext
                variant="outline"
                className="right-2 top-1/2 z-20 hidden size-8 -translate-y-1/2 rounded-full border-0 bg-white/90 text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.12)] backdrop-blur-sm hover:bg-white disabled:hidden md:flex md:opacity-0 md:transition-opacity md:duration-200 md:motion-safe:group-hover/carousel:opacity-100 md:group-focus-within/carousel:opacity-100 dark:bg-black/50 dark:text-white dark:hover:bg-black/65 dark:shadow-none [&>svg]:size-4"
              />

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
    </section>
  )
}

export default ProductImages
