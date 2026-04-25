'use client'

import { cn } from '@/lib/utils'
import type { WooCategory } from '@/types/product.types'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { PROMO_CATALOG_LINKS } from './catalog-links'

const linkClass =
  'block border-b border-border/35 py-3.5 text-sm tracking-wide text-foreground/80 transition-colors last:border-b-0 hover:text-foreground'

const promoLinkClass =
  'flex items-center justify-between border-b border-border/35 py-3.5 text-sm font-medium tracking-wide text-foreground/85 transition-colors last:border-b-0 hover:text-foreground'

type MobileNavProps = {
  categories: WooCategory[]
  className?: string
}

const MobileNav = ({ categories, className }: MobileNavProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn(className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-full text-foreground/85 md:hidden"
            aria-label="Отвори навигацията по категории"
          >
            <Menu className="size-5" strokeWidth={1.5} aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="flex min-h-0 w-[min(100vw,20.5rem)] flex-col border-r border-border/40 bg-background p-0"
        >
          <SheetHeader className="space-y-0 border-b border-border/40 px-5 py-4 pr-3 text-left">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="font-heading text-base font-medium tracking-tight">Каталог</SheetTitle>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 rounded-full"
                  aria-label="Затвори менюто"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          <ScrollArea className="min-h-0 flex-1">
            <nav className="px-5 py-1" aria-label="Каталожна навигация">
              <ul>
                {categories.map(category => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                {PROMO_CATALOG_LINKS.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[promoLinkClass, item.className].filter(Boolean).join(' ')}
                      onClick={() => setOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        {item.badge ? (
                          <span className="rounded border border-destructive/20 bg-destructive/[0.08] px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums leading-none text-destructive">
                            {item.badge}
                          </span>
                        ) : null}
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
