import { cn } from '@/lib/utils'
import { WooProductCategory } from '@/types/product-category.types'
import Image from 'next/image'
import Link from 'next/link'

type SubCategoryCardProps = {
  category: WooProductCategory
  /** Override for `next/image` when used in carousels vs grids */
  imageSizes?: string
}

function productLabel(count: number): string {
  if (count === 1) {
    return '1 продукт'
  }
  return `${count} продукта`
}

const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'

const SubCategoryCard = ({ category, imageSizes }: SubCategoryCardProps) => {
  const { name, slug, count, image } = category
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <Link
      href={`/c/${slug}`}
      className={cn(
        'group flex min-w-0 w-full flex-col gap-3 outline-none transition-[opacity,transform] duration-300',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'hover:opacity-90 active:scale-[0.99]'
      )}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-muted">
        {image?.src ? (
          <Image
            src={image.src}
            alt={image.alt || name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes={imageSizes ?? DEFAULT_IMAGE_SIZES}
          />
        ) : (
          <span
            className="absolute inset-0 flex items-center justify-center font-light text-4xl tracking-wide text-muted-foreground/40"
            aria-hidden
          >
            {initial}
          </span>
        )}
      </div>
      <div className="flex min-w-0 w-full flex-col gap-0.5 px-0.5">
        <span className="line-clamp-1 text-[15px] font-normal leading-snug tracking-[-0.01em] text-foreground">
          {name}
        </span>
        <span className="line-clamp-1 text-xs font-normal uppercase tracking-[0.14em] text-muted-foreground">
          {productLabel(count)}
        </span>
      </div>
    </Link>
  )
}

export default SubCategoryCard
