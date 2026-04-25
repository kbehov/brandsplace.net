import type { WooCategory } from '@/types/product.types'
import Link from 'next/link'

import { PROMO_CATALOG_LINKS } from './catalog-links'

type DesktopNavProps = {
  categories: WooCategory[]
}

const linkBase =
  'relative whitespace-nowrap transition-colors after:absolute after:inset-x-1 after:bottom-1.5 after:h-px after:origin-center after:scale-x-0 after:bg-foreground/70 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none'

const DesktopNav = ({ categories }: DesktopNavProps) => {
  return (
    <nav
      className="hidden w-full border-t border-border/30 bg-background/50 supports-backdrop-filter:bg-background/40 md:block"
      aria-label="Каталожна навигация"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4 py-0 sm:px-6 lg:px-8">
        <div className="flex w-full min-w-0 items-center">
          <ul className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto py-1 sm:gap-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.length > 0 ? (
              <li className="mx-1.5 h-3 w-px shrink-0 self-center bg-border/60 sm:mx-3" aria-hidden />
            ) : null}

            {categories.map(category => (
              <li key={category.id} className="flex shrink-0 items-center">
                <Link
                  href={`/category/${category.slug}`}
                  className={[
                    linkBase,
                    'px-2.5 py-3 text-[0.8125rem] font-medium tracking-[0.06em] text-muted-foreground sm:px-3.5',
                    'hover:text-foreground',
                  ].join(' ')}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {PROMO_CATALOG_LINKS.map(item => (
              <li key={item.href} className="flex shrink-0 items-center">
                <Link
                  href={item.href}
                  className={[
                    linkBase,
                    'inline-flex items-center gap-2',
                    'px-2.5 py-3 text-[0.8125rem] font-medium tracking-[0.04em] sm:px-3.5',
                    'text-foreground/75 hover:text-foreground',
                    'after:bottom-1',
                    item.className,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.badge ? (
                    <span className="rounded border border-destructive/20 bg-destructive/[0.08] px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums leading-none tracking-tight text-destructive">
                      {item.badge}
                    </span>
                  ) : null}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default DesktopNav
