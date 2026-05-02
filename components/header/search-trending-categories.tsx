import { cn } from '@/lib/utils'
import type { SearchTrendingCategory } from '@/types/search.types'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'

type SearchTrendingCategoriesProps = {
  categories: SearchTrendingCategory[]
  className?: string
}

export function SearchTrendingCategories({ categories, className }: SearchTrendingCategoriesProps) {
  if (categories.length === 0) {
    return (
      <p className={cn('px-4 py-6 text-center text-[0.8125rem] text-muted-foreground', className)}>
        Няма налични категории за показване.
      </p>
    )
  }

  return (
    <div className={cn('p-3 space-y-2', className)}>
      <p className=" text-xs font-medium uppercase tracking-[0.14em] text-foreground/80">🔥 Популярни в момента</p>
      <div className=" flex flex-wrap gap-2 ">
        {categories.map((cat, index) => (
          <Link key={index} href={`/c/${cat.slug}`} className="hover:opacity-80 transition-opacity duration-200 ">
            <Badge variant="outline" className="h-8 px-2 hover:bg-muted/50 ">
              <Avatar className="size-6">
                <AvatarImage className="size-6 object-cover" src={cat.imageSrc ?? ''} alt={cat.name} />
                <AvatarFallback>{cat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {index === 0 ? (
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/80" aria-hidden>
                  🔥
                </span>
              ) : null}
              <span className="text-sm font-medium">{cat.name}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
