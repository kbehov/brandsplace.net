import { WooProductListItem } from '@/types/product.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const WISHLIST_STORAGE_KEY = 'brandsplace.net:wishlist:v1'

interface WishlistState {
  items: WooProductListItem[]
}

interface WishlistActions {
  addItem: (item: WooProductListItem) => void
  removeItem: (id: number) => void
  clear: () => void
  isInWishlist: (id: number) => boolean
  wishlistCount: () => number
}

export const useWishlistStore = create<WishlistState & WishlistActions>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: item => set(state => ({ items: [...state.items, item] })),
      removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
      clear: () => set({ items: [] }),
      isInWishlist: id => get().items.some(item => item.id === id),
      wishlistCount: () => get().items.length,
    }),
    {
      name: WISHLIST_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
