// WooCommerce global product attribute (wc/v3/products/attributes) — not the same as inline attributes on a product

export type WooAttributeType = 'select' | 'text'

export type WooAttributeOrderBy = 'menu_order' | 'name' | 'name_num' | 'id'

export type WooAttribute = {
  id: number
  name: string
  slug: string
  type: WooAttributeType
  order_by: WooAttributeOrderBy
  has_archives: boolean
}

export type WooAttributeListResponse = WooAttribute[]

export type WooAttributeSingleResponse = WooAttribute

// Terms for an attribute: wc/v3/products/attributes/{id}/terms

export type WooAttributeTerm = {
  id: number
  name: string
  slug: string
  description: string
  menu_order: number
  count: number
}

export type WooAttributeTermListResponse = WooAttributeTerm[]

export type WooAttributeTermSingleResponse = WooAttributeTerm
