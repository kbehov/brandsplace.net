import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooPaymentGateway } from '@/types/payment-gateway.types'

export type UpdatePaymentGatewayPayload = Pick<WooPaymentGateway, 'enabled'> & {
  /** Gateway-specific; merged when toggling in WP admin. */
  settings?: Record<string, unknown>
}

export async function getPaymentGateways(): Promise<WooPaginatedList<WooPaymentGateway>> {
  const res = (await woo.get('payment_gateways', {})) as AxiosResponse<WooPaymentGateway[]>
  return fromWooListResponse(res)
}

export async function getPaymentGatewayById(
  id: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooPaymentGateway> {
  const res = (await woo.get(`payment_gateways/${id}`, { ...params })) as AxiosResponse<
    WooPaymentGateway
  >
  return fromWooData(res)
}

/**
 * Update gateway (e.g. enable/disable). The REST API only supports updating existing gateways, not creating them.
 */
export async function updatePaymentGateway(
  id: string,
  data: UpdatePaymentGatewayPayload,
): Promise<WooPaymentGateway> {
  const res = (await woo.put(`payment_gateways/${id}`, data, {})) as AxiosResponse<WooPaymentGateway>
  return fromWooData(res)
}
