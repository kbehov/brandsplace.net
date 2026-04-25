// WooCommerce coupon (wc/v3/coupons)

export type WooCouponDiscountType = 'percent' | 'fixed_cart' | 'fixed_product'

export type WooCoupon = {
  id: number
  code: string
  amount: string
  individual_use: boolean
  product_ids: number[]
  excluded_product_ids: number[]
  usage_limit: number | null
  usage_count: number
  usage_limit_per_user: number | null
  limit_usage_to_x_items: number | null
  free_shipping: boolean
  product_categories: number[]
  excluded_product_categories: number[]
  exclude_sale_items: boolean
  minimum_amount: string
  maximum_amount: string
  email_restrictions: string[]
  used_by: string[]
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  discount_type: WooCouponDiscountType
  description: string
  meta_data: Array<{
    id: number
    key: string
    value: string | number | boolean | object | null
  }>
}

export type WooCouponListResponse = WooCoupon[]

export type WooCouponSingleResponse = WooCoupon
