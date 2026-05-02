import { cn } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlist.store'
import { WooProductListItem } from '@/types/product.types'
import { Heart } from 'lucide-react'
import { Button } from '../ui/button'

export const AddToWishlistButton = ({ product }: { product: WooProductListItem }) => {
  const { addItem, isInWishlist, removeItem } = useWishlistStore()
  const isSaved = isInWishlist(product.id)

  return (
    <Button
      type="button"
      aria-label={`Добави ${product.name} в любими`}
      size="icon"
      variant="ghost"
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        if (isSaved) {
          removeItem(product.id)
        } else {
          addItem(product)
        }
      }}
      className={cn(
        'absolute right-2 top-2 z-50 flex  items-center justify-center rounded-full bg-background/85  backdrop-blur-sm  ',
      )}
    >
      <Heart
        className={cn('size-4 text-foreground ', isSaved ? 'text-red-500' : 'text-foreground/70')}
        fill={isSaved ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
    </Button>
  )
}
