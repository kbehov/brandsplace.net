import type { CartAttribute, CartItem, SelectedAttributes } from '@/types/cart.types'
import type { WooProduct } from '@/types/product.types'
import type { WooProductVariation } from '@/types/product-variation.types'

function parseNum(value: string | number | null | undefined): number {
  if (value == null || value === '') return 0
  const n = parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function cartLineKey(productId: number, variationId: number | null): string {
  return variationId != null ? `${productId}:v${variationId}` : `${productId}`
}

export function buildCartItem(
  product: WooProduct,
  opts: {
    quantity: number
    variation: WooProductVariation | null
    selectedAttributes: SelectedAttributes
  },
): CartItem {
  const { variation, quantity, selectedAttributes } = opts
  const variation_id = variation?.id ?? null
  const key = cartLineKey(product.id, variation_id)

  const priceStr = variation?.price ?? product.price
  const price = parseNum(priceStr)
  const regular = parseNum(variation?.regular_price ?? product.regular_price)
  const sale = parseNum(variation?.sale_price ?? product.sale_price)
  const on_sale = variation?.on_sale ?? product.on_sale

  const weightRaw = variation?.weight ?? product.weight
  const weightKg = parseNum(weightRaw)

  const image =
    variation?.images?.[0]?.src ||
    variation?.image?.src ||
    product.images?.[0]?.src ||
    null

  const attributes: CartAttribute[] = []
  for (const [slug, option] of Object.entries(selectedAttributes)) {
    if (!option) continue
    const meta = product.attributes.find(a => a.slug === slug)
    attributes.push({
      name: meta?.name ?? slug,
      slug,
      option,
    })
  }

  const itemTotal = price * quantity

  return {
    key,
    id: product.id,
    product_id: product.id,
    variation_id,
    quantity,
    name: product.name,
    slug: product.slug,
    price,
    sale_price: sale || undefined,
    regular_price: regular || undefined,
    on_sale,
    image,
    attributes,
    selectedAttributes,
    weightKg,
    itemTotal,
  }
}
