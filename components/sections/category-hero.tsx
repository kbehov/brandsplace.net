import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'
import { Package } from 'lucide-react'
import { Badge } from '../ui/badge'
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

const DESCRIPTION_PREVIEW_LENGTH = 220

const CategoryHero = ({ category, className }: CategoryHeroProps) => {
  const { name, description, count } = category
  const plain = textFromDescription(description)
  const blurb =
    plain.length > DESCRIPTION_PREVIEW_LENGTH ? `${plain.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}…` : plain
  const meta = formatSelectionCount(count)

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col gap-4 sm:gap-5">
        <h1 className="max-w-4xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">{name}</h1>
        {/* {blurb ? (
          <p className="max-w-3xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {blurb}
          </p>
        ) : null} */}
        <Badge
          variant="outline"
          className="inline-flex w-fit max-w-full items-center gap-2 border-border/60 bg-muted/40 px-3 py-1 text-[13px] font-medium text-foreground"
        >
          <Package className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <span>{meta}</span>
        </Badge>
      </div>
    </div>
  )
}

export default CategoryHero
