// WooCommerce product shipping class (wc/v3/products/shipping_classes)

export type WooProductShippingClass = {
  id: number
  name: string
  slug: string
  count: number
}

export type WooProductShippingClassListResponse = WooProductShippingClass[]

export type WooProductShippingClassSingleResponse = WooProductShippingClass
