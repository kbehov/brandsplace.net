// WooCommerce product category (wc/v3/products/categories) — full resource; products embed a slimmer `WooCategory` in product.types

export type WooProductCategory = {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: 'default' | 'products' | 'subcategories' | 'both'
  image: {
    id: number
    date_created: string
    date_created_gmt: string
    date_modified: string
    date_modified_gmt: string
    src: string
    name: string
    alt: string
  } | null
  menu_order: number
  count: number
}

export type WooProductCategoryListResponse = WooProductCategory[]

export type WooProductCategorySingleResponse = WooProductCategory
