// Woocommerce product types //

import { WooBrand } from './brand.types'

// ─── Primitives & Shared ──────────────────────────────────────────────────────

export type WooProductStatus = 'publish' | 'draft' | 'pending' | 'private'
export type WooProductType = 'simple' | 'grouped' | 'external' | 'variable'
export type WooProductVisibility = 'visible' | 'catalog' | 'search' | 'hidden'
export type WooStockStatus = 'instock' | 'outofstock' | 'onbackorder'
export type WooTaxStatus = 'taxable' | 'shipping' | 'none'
export type WooBackordersStatus = 'no' | 'notify' | 'yes'
export type WooCatalogSortOrder = 'menu_order' | 'popularity' | 'rating' | 'date' | 'price' | 'price-desc'

// ─── Sub-types ────────────────────────────────────────────────────────────────

export type WooImage = {
  id: number
  date_created: string
  date_modified: string
  src: string
  srcSet: string
  sizes: string
  thumbnail: string
  name: string
  alt: string
}

export type WooCategory = {
  id: number
  name: string
  slug: string
}

export type WooTag = {
  id: number
  name: string
  slug: string
}

export type WooProductAttribute = {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  slug: string
  options: string[]
}

export type WooProductDefaultAttribute = {
  id: number
  name: string
  option: string
}

export type WooProductDimensions = {
  length: string
  width: string
  height: string
}

export type WooProductDownload = {
  id: string
  name: string
  file: string
}

export type WooProductMetaData = {
  id: number
  key: string
  value: string | number | boolean | object | null
}

// ─── Main Product Type ────────────────────────────────────────────────────────

export type WooProduct = {
  id: number
  name: string
  slug: string
  permalink: string

  // Dates
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string

  // Type & Status
  type: WooProductType
  status: WooProductStatus
  featured: boolean
  catalog_visibility: WooProductVisibility

  // Descriptions
  description: string
  short_description: string

  // Identifiers
  sku: string
  global_unique_id: string | null

  // Pricing
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from: string | null
  date_on_sale_from_gmt: string | null
  date_on_sale_to: string | null
  date_on_sale_to_gmt: string | null
  price_html: string
  on_sale: boolean
  purchasable: boolean
  brands: WooBrand[] | null

  // Inventory
  total_sales: number
  virtual: boolean
  downloadable: boolean
  manage_stock: boolean
  stock_quantity: number | null
  bgn_price: string | number
  stock_status: WooStockStatus
  backorders: WooBackordersStatus
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean

  // Shipping
  weight: string
  dimensions: WooProductDimensions
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number

  // Tax
  tax_status: WooTaxStatus
  tax_class: string

  // Reviews
  reviews_allowed: boolean
  average_rating: string
  rating_count: number

  // Relations
  related_ids: number[]
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number

  // External product
  purchase_note: string
  external_url: string
  button_text: string

  // Media
  images: WooImage[]

  // Taxonomy
  categories: WooCategory[]
  tags: WooTag[]
  attributes: WooProductAttribute[]
  default_attributes: WooProductDefaultAttribute[]

  // Downloads
  downloads: WooProductDownload[]
  download_limit: number
  download_expiry: number

  // Variations
  variations: number[]
  grouped_products: number[]
  menu_order: number

  // Meta
  meta_data: WooProductMetaData[]
}

/**
 * Subset of {@link WooProduct} returned for `GET /wc/v3/products` when
 * `?_fields=` is set (see `lib/woo-product-list-fields.ts` and `getProducts()`).
 * Single-product endpoints return the full `WooProduct` shape.
 */
export type WooProductListItem = Pick<
  WooProduct,
  | 'id'
  | 'name'
  | 'slug'
  | 'permalink'
  | 'type'
  | 'status'
  | 'featured'
  | 'on_sale'
  | 'purchasable'
  | 'price'
  | 'regular_price'
  | 'sale_price'
  | 'price_html'
  | 'images'
  | 'stock_status'
  | 'average_rating'
  | 'rating_count'
  | 'categories'
  | 'variations'
  | 'date_created'
  | 'attributes'
  | 'bgn_price'
  | 'total_sales'
>

// ─── Variation (see product-variation.types) ─────────────────────────────────

export type { WooProductVariation } from './product-variation.types'

// ─── API Response Wrappers ────────────────────────────────────────────────────

export type WooProductListResponse = WooProduct[]

export type WooProductSingleResponse = WooProduct

// ─── Utility / Normalised type for UI consumption ─────────────────────────────

/** Flattened, UI-friendly shape derived from WooProduct */
export type NormalisedProduct = {
  id: number
  name: string
  slug: string
  permalink: string
  price: string
  regularPrice: string
  salePrice: string
  onSale: boolean
  featuredImage: WooImage | null
  images: WooImage[]
  description: string
  shortDescription: string
  sku: string
  stockStatus: WooStockStatus
  inStock: boolean
  categories: WooCategory[]
  tags: WooTag[]
  attributes: WooProductAttribute[]
  variations: number[]
  type: WooProductType
  averageRating: string
  ratingCount: number
}
