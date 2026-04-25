import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooProductShippingClass } from '@/types/product-shipping-class.types'

export type GetShippingClassesParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
  hide_empty?: boolean
}

export type CreateShippingClassPayload = { name: string; slug?: string; description?: string }
export type UpdateShippingClassPayload = Partial<CreateShippingClassPayload>

export async function getShippingClasses(
  params?: GetShippingClassesParams,
): Promise<WooPaginatedList<WooProductShippingClass>> {
  const res = (await woo.get('products/shipping_classes', { ...params })) as AxiosResponse<
    WooProductShippingClass[]
  >
  return fromWooListResponse(res)
}

export async function getShippingClassById(id: number): Promise<WooProductShippingClass> {
  const res = (await woo.get(`products/shipping_classes/${id}`, {})) as AxiosResponse<
    WooProductShippingClass
  >
  return fromWooData(res)
}

export async function getShippingClassBySlug(
  slug: string,
): Promise<WooProductShippingClass | null> {
  const res = (await woo.get('products/shipping_classes', {
    slug,
    per_page: 1,
  })) as AxiosResponse<WooProductShippingClass[]>
  return res.data[0] ?? null
}

export async function createShippingClass(
  data: CreateShippingClassPayload,
): Promise<WooProductShippingClass> {
  const res = (await woo.post('products/shipping_classes', data, {})) as AxiosResponse<
    WooProductShippingClass
  >
  return fromWooData(res)
}

export async function updateShippingClass(
  id: number,
  data: UpdateShippingClassPayload,
): Promise<WooProductShippingClass> {
  const res = (await woo.put(
    `products/shipping_classes/${id}`,
    data,
    {},
  )) as AxiosResponse<WooProductShippingClass>
  return fromWooData(res)
}

export async function deleteShippingClass(
  id: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(`products/shipping_classes/${id}`, { ...params })) as AxiosResponse
  return res.data
}
