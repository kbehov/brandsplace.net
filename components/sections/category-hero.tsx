import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'
import Image from 'next/image'

const TAG_STRIP = /<[^>]*>/g
const WHITESPACE = /\s+/g

function textFromDescription(html: string | undefined | null): string {
  if (!html) {
    return ''
  }
  return html.replace(TAG_STRIP, ' ').replace(WHITESPACE, ' ').trim()
}

function formatSelectionCount(count: number): string {
  if (count <= 0) {
    return 'Очаквайте доставка скоро'
  }
  if (count === 1) {
    return '1 продукт'
  }
  return `${count} продукта`
}

type CategoryHeroProps = {
  category: WooProductCategory
  className?: string
}

const CategoryHero = ({ category, className }: CategoryHeroProps) => {
  const { name, description, count, id, image } = category
  const blurb = textFromDescription(description)
  const meta = formatSelectionCount(count)

  return (
    <section className={cn('w-full', className)} aria-labelledby={`category-hero-title-${id}`}>
      {image?.src ? (
        <div className="relative mb-10 w-full overflow-hidden rounded-sm bg-muted aspect-[2.2/1] max-h-[min(42vw,320px)] sm:aspect-[2.5/1] sm:max-h-[min(38vw,380px)]">
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      <header className="flex flex-col gap-3 sm:gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{meta}</p>
        <h1
          id={`category-hero-title-${id}`}
          className="max-w-4xl text-balance text-3xl font-light tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.08]"
        >
          {name}
        </h1>
        {blurb ? (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">{blurb}</p>
        ) : null}
      </header>
    </section>
  )
}

export default CategoryHero
