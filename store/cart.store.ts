import type { CartItem } from '@/types/cart.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const CART_STORAGE_KEY = 'brandsplace.net:cart:v2'

interface CartState {
  items: CartItem[]
  total: number
}
interface CartActions {
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  clear: () => void
  updateItemQuantity: (key: string, quantity: number) => void
}

type CartStore = CartState & CartActions

function sumItemTotals(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + (Number.isFinite(i.itemTotal) ? i.itemTotal : 0), 0)
}

export const useCartStore = create<CartStore>()(
  persist(
    set => ({
      items: [],
      total: 0,
      addItem: item =>
        set(state => {
          const qty = item.quantity > 0 ? item.quantity : 1
          const lineTotal =
            Number.isFinite(item.itemTotal) && item.itemTotal > 0
              ? item.itemTotal
              : (typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0))) * qty

          const normalized: CartItem = {
            ...item,
            quantity: qty,
            itemTotal: lineTotal,
          }

          const existing = state.items.find(i => i.key === normalized.key)
          if (!existing) {
            const items = [...state.items, normalized]
            return { items, total: sumItemTotals(items) }
          }
          const nextQty = existing.quantity + qty
          const unit = existing.itemTotal / (existing.quantity || 1)
          const items = state.items.map(i =>
            i.key === normalized.key
              ? {
                  ...i,
                  quantity: nextQty,
                  itemTotal: Number.isFinite(unit) ? unit * nextQty : i.itemTotal + lineTotal,
                }
              : i,
          )
          return { items, total: sumItemTotals(items) }
        }),
      removeItem: key =>
        set(state => {
          const items = state.items.filter(item => item.key !== key)
          return { items, total: sumItemTotals(items) }
        }),
      clear: () => set({ items: [], total: 0 }),
      updateItemQuantity: (key, quantity) =>
        set(state => {
          const items = state.items
            .map(item => {
              if (item.key !== key) return item
              const q = Math.max(0, Math.floor(quantity))
              if (q <= 0) return null
              const unit = item.itemTotal / (item.quantity || 1)
              const price = Number.isFinite(unit) ? unit : parseFloat(String(item.price || 0))
              return { ...item, quantity: q, itemTotal: price * q }
            })
            .filter(Boolean) as CartItem[]
          return { items, total: sumItemTotals(items) }
        }),
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
