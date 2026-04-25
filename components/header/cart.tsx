'use client'

import { useCartStore } from '@/store/cart.store'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { Button } from '../ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

const Cart = () => {
  const { items } = useCartStore()
  const isCartEmpty = items.length === 0
  const count = items.length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="group relative size-9 shrink-0 rounded-full text-foreground/80 transition-colors hover:bg-foreground/[0.04] hover:text-foreground dark:hover:bg-foreground/[0.06]"
          aria-label={
            count > 0 ? `Отвори кошницата, ${count} ${count === 1 ? 'артикул' : 'артикула'}` : 'Отвори кошницата'
          }
        >
          <ShoppingBag
            className="size-5 transition-transform duration-200 group-active:scale-95"
            strokeWidth={1.5}
            aria-hidden
          />
          {count > 0 ? (
            <span
              className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-0.5 text-[10px] font-semibold leading-none text-background tabular-nums"
              aria-hidden
            >
              {count > 9 ? '9+' : count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l border-border/50 bg-background/95 p-0 shadow-2xl shadow-black/5 backdrop-blur-xl sm:max-w-md dark:shadow-black/20"
      >
        <SheetHeader className="gap-1 border-b border-border/40 px-6 py-5 text-left sm:px-7">
          <SheetTitle className="font-heading text-lg font-medium tracking-[0.02em] sm:text-xl">Количка</SheetTitle>
          <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
            {isCartEmpty
              ? 'Подбрани продукти, когато и вие сте готови.'
              : `${count} ${count === 1 ? 'артикул' : 'артикула'} в кошницата.`}
          </SheetDescription>
        </SheetHeader>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:px-8">
              <div
                className="flex size-28 items-center justify-center rounded-[1.25rem] border border-dashed border-border/60 bg-linear-to-b from-muted/50 to-muted/20 shadow-inner dark:from-muted/20 dark:to-muted/10"
                aria-hidden
              >
                <ShoppingBag className="size-11 text-foreground/25" strokeWidth={1} />
              </div>
              <div className="max-w-xs space-y-2">
                <h2 className="font-heading text-base font-medium tracking-tight text-foreground">
                  Кошницата е празна
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Разгледайте магазина и добавете любимите си продукти. Те ще се покажат тук.
                </p>
              </div>
            </div>
            <div className="mt-auto border-t border-border/50 p-6 sm:p-7">
              <SheetClose asChild>
                <Button asChild className="h-10 w-full rounded-lg text-sm font-medium shadow-sm">
                  <Link href="/">Продължи пазаруване</Link>
                </Button>
              </SheetClose>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col min-h-0">
            <div
              className="mx-6 my-4 flex min-h-48 flex-1 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 sm:mx-7"
              aria-hidden
            />
            <div className="mt-auto border-t border-border/50 p-6 sm:p-7">
              <SheetClose asChild>
                <Button asChild className="h-10 w-full rounded-lg text-sm font-medium shadow-sm" variant="secondary">
                  <Link href="/">Към магазина</Link>
                </Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart
