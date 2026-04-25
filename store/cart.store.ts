import type { CartItem } from '@/types/cart.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const CART_STORAGE_KEY = 'brandsplace.net:cart'

interface CartState {
  items: CartItem[]
  total: number
}
interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clear: () => void
  updateItemQuantity: (id: number, quantity: number) => void
}
// Cart Store
type CartStore = CartState & CartActions

export const useCartStore = create<CartStore>()(
  persist(
    set => ({
      items: [],
      total: 0,
      addItem: item =>
        set(state => {
          const existing = state.items.find(i => i.id === item.id)
          if (!existing) {
            return { items: [...state.items, item] }
          }
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? {
                    ...i,
                    quantity: i.quantity + item.quantity,
                    itemTotal: i.itemTotal + item.itemTotal,
                  }
                : i,
            ),
          }
        }),
      removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
      clear: () => set({ items: [], total: 0 }),
      updateItemQuantity: (id, quantity) =>
        set(state => ({ items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)) })),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
