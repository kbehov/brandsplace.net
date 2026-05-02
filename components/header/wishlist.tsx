'use client'

import { useWishlistStore } from '@/store/wishlist.store'
import { Heart } from 'lucide-react'

import { Button } from '../ui/button'

const Cart = () => {
  const { wishlistCount } = useWishlistStore()
  const count = wishlistCount()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="group relative size-9 shrink-0 rounded-full text-foreground/80 transition-colors hover:bg-foreground/4 hover:text-foreground "
      aria-label={count > 0 ? `Отвори кошницата, ${count} ${count === 1 ? 'артикул' : 'артикула'}` : 'Отвори кошницата'}
    >
      <Heart className="size-5 transition-transform duration-200 group-active:scale-95" strokeWidth={1.5} aria-hidden />
      {count > 0 ? (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-semibold leading-none text-background tabular-nums"
          aria-hidden
        >
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </Button>
  )
}

export default Cart
