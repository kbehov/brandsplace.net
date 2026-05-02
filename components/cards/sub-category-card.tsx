import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type SubCategoryCardProps = {
  category: WooProductCategory
  imageSizes?: string
}

function productLabel(count: number): string {
  return count === 1 ? '1 продукт' : `${count} продукта`
}

const SubCategoryCard = ({ category }: SubCategoryCardProps) => {
  const { name, slug, count, image } = category
  const initial = name.trim().charAt(0).toUpperCase()
  const isEmpty = count === 0

  return (
    <Link
      href={`/c/${slug}`}
      aria-label={`${name} — ${productLabel(count)}`}
      className={cn(
        'inline-flex items-center shrink-0 gap-2.5 rounded-xl border border-border/40 bg-background',
        'px-3 py-2 transition-all duration-150',
        'hover:border-border/70 hover:bg-muted/50',
        'active:scale-[0.97]',
        isEmpty && 'pointer-events-none opacity-50',
      )}
    >
      <Avatar className="size-9 shrink-0 border border-border/30">
        <AvatarImage src={image?.src} alt={name} />
        <AvatarFallback className="text-sm font-medium">{initial}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-0">
        <span className="text-[13px] font-medium leading-snug">{name}</span>
        <span className="text-[11px] text-muted-foreground leading-snug">{productLabel(count)}</span>
      </div>
    </Link>
  )
}

export default SubCategoryCard
