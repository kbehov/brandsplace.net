// WooCommerce payment gateway (wc/v3/payment_gateways) — `settings` shape varies by gateway

export type WooPaymentGateway = {
  id: string
  title: string
  description: string
  order: number
  enabled: boolean
  method_title: string
  method_description: string
  method_supports: string[]
  /** Varies by gateway; typically keyed setting ids with `value`/`label`/`type` objects */
  settings: Record<string, unknown>
}

export type WooPaymentGatewayListResponse = WooPaymentGateway[]

export type WooPaymentGatewaySingleResponse = WooPaymentGateway
