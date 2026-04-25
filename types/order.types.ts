// WooCommerce order (wc/v3/orders) — headless store types

import type { WooOrderNote } from './order-note.types'

export type WooOrderStatus =
  | 'auto-draft'
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'on-hold'
  | 'pending'
  | 'processing'
  | 'refunded'
  | 'trash'
  | 'draft'

export type WooOrderItemProductMeta = {
  id: number
  key: string
  value: string | number | boolean | object | null
}

export type WooOrderLineItem = {
  id: number
  name: string
  product_id: number
  variation_id: number
  quantity: number
  tax_class: string
  subtotal: string
  subtotal_tax: string
  total: string
  total_tax: string
  taxes: { id: number; total: string; subtotal: string }[]
  meta_data: WooOrderItemProductMeta[]
  sku: string
  global_unique_id: string
  price: string
  image: {
    id: string
    src: string
  }
  parent_name: string
}

export type WooOrderFeeLine = {
  id: number
  name: string
  tax_class: string
  tax_status: 'taxable' | 'none'
  amount: string
  total: string
  total_tax: string
  taxes: { id: number; total: string; subtotal: string }[]
  meta_data: WooOrderItemProductMeta[]
}

export type WooOrderShippingLine = {
  id: number
  method_title: string
  method_id: string
  instance_id: string
  total: string
  total_tax: string
  taxes: { id: number; total: string; subtotal: string }[]
  tax_status: 'taxable' | 'none'
  meta_data: WooOrderItemProductMeta[]
}

export type WooOrderTaxLine = {
  id: number
  rate_code: string
  rate_id: number
  label: string
  compound: boolean
  tax_total: string
  shipping_tax_total: string
  rate_percent: number
  meta_data: WooOrderItemProductMeta[]
}

export type WooOrderCouponLine = {
  id: number
  code: string
  discount: string
  discount_tax: string
  meta_data: WooOrderItemProductMeta[]
}

export type WooOrderRefund = {
  id: number
  reason: string
  total: string
}

export type WooOrderAddress = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

export type WooOrderMetaData = {
  id: number
  key: string
  value: string | number | boolean | object | null
}

export type WooOrder = {
  id: number
  parent_id: number
  number: string
  order_key: string
  created_via: string
  version: string
  status: WooOrderStatus
  currency: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  date_completed: string | null
  date_completed_gmt: string | null
  date_paid: string | null
  date_paid_gmt: string | null
  discount_total: string
  discount_tax: string
  shipping_total: string
  shipping_tax: string
  cart_tax: string
  total: string
  total_tax: string
  customer_id: number
  customer_note: string
  customer_ip_address: string
  customer_user_agent: string
  payment_method: string
  payment_method_title: string
  transaction_id: string
  cart_hash: string
  prices_include_tax: boolean
  currency_symbol: string
  billing: WooOrderAddress & { email: string; phone: string }
  shipping: WooOrderAddress
  line_items: WooOrderLineItem[]
  tax_lines: WooOrderTaxLine[]
  shipping_lines: WooOrderShippingLine[]
  fee_lines: WooOrderFeeLine[]
  coupon_lines: WooOrderCouponLine[]
  refunds: WooOrderRefund[]
  meta_data: WooOrderMetaData[]
  is_editable: boolean
  needs_payment: boolean
  needs_processing: boolean
  /** Notes may be embedded when using extensions or custom fetches; core list is a separate endpoint. */
  notes?: WooOrderNote[]
}

export type WooOrderListResponse = WooOrder[]

export type WooOrderSingleResponse = WooOrder
