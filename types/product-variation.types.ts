// WooCommerce product variation (wc/v3/products/{id}/variations) — see product.types for WooProduct

import type {
  WooImage,
  WooProduct,
  WooProductDefaultAttribute,
  WooProductStatus,
} from './product.types'

export type WooProductVariation = Pick<
  WooProduct,
  | 'id'
  | 'date_created'
  | 'date_modified'
  | 'description'
  | 'permalink'
  | 'sku'
  | 'price'
  | 'regular_price'
  | 'sale_price'
  | 'on_sale'
  | 'purchasable'
  | 'virtual'
  | 'downloadable'
  | 'downloads'
  | 'download_limit'
  | 'download_expiry'
  | 'tax_status'
  | 'tax_class'
  | 'manage_stock'
  | 'stock_quantity'
  | 'stock_status'
  | 'backorders'
  | 'backorders_allowed'
  | 'backordered'
  | 'weight'
  | 'dimensions'
  | 'shipping_class'
  | 'shipping_class_id'
  | 'images'
  | 'meta_data'
> & {
  parent_id: number
  status: WooProductStatus
  attributes: WooProductDefaultAttribute[]
  image: WooImage
}

export type WooProductVariationListResponse = WooProductVariation[]

export type WooProductVariationSingleResponse = WooProductVariation
