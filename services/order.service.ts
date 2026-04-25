import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooOrder } from '@/types/order.types'

export type GetOrdersParams = {
  page?: number
  per_page?: number
  search?: string
  after?: string
  before?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'name' | 'date' | 'type' | 'include' | 'relevance' | 'slug' | 'title' | 'menu_order' | 'modified' | 'meta_value' | 'meta_key'
  status?: string
  customer?: number
  product?: number
  dp?: number
}

/**
 * Create order payload — `line_items` and `billing` are typically required; other fields are optional. See WC REST docs.
 */
export type CreateOrderPayload = Partial<WooOrder> & {
  line_items: WooOrder['line_items']
  billing: WooOrder['billing']
}

export type UpdateOrderPayload = Partial<WooOrder>

export async function getOrders(params?: GetOrdersParams): Promise<WooPaginatedList<WooOrder>> {
  const res = (await woo.get('orders', { ...params })) as AxiosResponse<WooOrder[]>
  return fromWooListResponse(res)
}

export async function getOrderById(id: number, params?: { dp?: number }): Promise<WooOrder> {
  const res = (await woo.get(`orders/${id}`, { ...params })) as AxiosResponse<WooOrder>
  return fromWooData(res)
}

export async function createOrder(data: CreateOrderPayload): Promise<WooOrder> {
  const res = (await woo.post('orders', data, {})) as AxiosResponse<WooOrder>
  return fromWooData(res)
}

export async function updateOrder(id: number, data: UpdateOrderPayload): Promise<WooOrder> {
  const res = (await woo.put(`orders/${id}`, data, {})) as AxiosResponse<WooOrder>
  return fromWooData(res)
}

export async function deleteOrder(
  id: number,
  params?: { force?: boolean },
): Promise<{ id: number; data: { status: string } } | WooOrder> {
  const res = (await woo.delete(`orders/${id}`, { ...params })) as AxiosResponse
  return res.data
}
