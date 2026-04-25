// WooCommerce shipping: available method definitions (wc/v3/shipping_methods) and zone methods (wc/v3/shipping/zones/{id}/methods)

/**
 * A shipping method *type* you can add to a zone (flat rate, free shipping, local pickup, etc.).
 * GET /wp-json/wc/v3/shipping_methods
 */
export type WooShippingMethodDefinition = {
  id: string
  title: string
  description: string
  supports: string[]
  method_title: string
  method_description: string
}

/**
 * A configured method instance on a zone.
 * GET/POST/PUT/DELETE /wp-json/wc/v3/shipping/zones/{zone_id}/methods[/{instance_id}]
 */
export type WooShippingZoneMethod = {
  id: number
  instance_id: string
  title: string
  order: number
  enabled: boolean
  method_id: string
  method_title: string
  method_description: string
  /** Varies by method_id (e.g. cost, class_costs) */
  settings: Record<string, unknown>
}

export type WooShippingMethodDefinitionListResponse = WooShippingMethodDefinition[]

export type WooShippingZoneMethodListResponse = WooShippingZoneMethod[]

export type WooShippingZoneMethodSingleResponse = WooShippingZoneMethod
