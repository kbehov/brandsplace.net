export type SelectedAttributes = Record<string, string>
// Cart Attribute
export interface CartAttribute {
  id?: number
  name: string
  slug?: string
  option: string
}
// Cart Variation
export type CartVariation = {
  id: number
  price?: string | number
  weight?: string | number
  attributes: CartAttribute[]
  image?: { src: string }
}
// Cart Item
export type CartItem = {
  key: string
  id: number
  product_id: number
  variation_id: number | null
  quantity: number
  name: string
  slug: string
  price?: number | string
  sale_price?: number | string
  regular_price?: number | string
  on_sale?: boolean
  image: string | null
  attributes: CartAttribute[]
  selectedAttributes: SelectedAttributes
  weightKg: number
  itemTotal: number
}
