import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type {
  WooAttribute,
  WooAttributeTerm,
} from '@/types/product-attribute.types'

export type GetProductAttributesParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'name' | 'name_num' | 'slug' | 'term_group' | 'include' | 'description' | 'count'
  hide_empty?: boolean
}

export type GetAttributeTermsParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'count'
  include?: string
  exclude?: string
  parent?: number
  hide_empty?: boolean
}

export type CreateAttributePayload = {
  name: string
} & Partial<Pick<WooAttribute, 'slug' | 'type' | 'order_by' | 'has_archives'>>
export type UpdateAttributePayload = Partial<CreateAttributePayload>

export async function getProductAttributes(
  params?: GetProductAttributesParams,
): Promise<WooPaginatedList<WooAttribute>> {
  const res = (await woo.get('products/attributes', { ...params })) as AxiosResponse<WooAttribute[]>
  return fromWooListResponse(res)
}

export async function getProductAttributeById(
  id: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooAttribute> {
  const res = (await woo.get(`products/attributes/${id}`, { ...params })) as AxiosResponse<
    WooAttribute
  >
  return fromWooData(res)
}

export async function createProductAttribute(
  data: CreateAttributePayload,
): Promise<WooAttribute> {
  const res = (await woo.post('products/attributes', data, {})) as AxiosResponse<WooAttribute>
  return fromWooData(res)
}

export async function updateProductAttribute(
  id: number,
  data: UpdateAttributePayload,
): Promise<WooAttribute> {
  const res = (await woo.put(
    `products/attributes/${id}`,
    data,
    {},
  )) as AxiosResponse<WooAttribute>
  return fromWooData(res)
}

export async function deleteProductAttribute(
  id: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(`products/attributes/${id}`, { ...params })) as AxiosResponse
  return res.data
}

export async function getAttributeTerms(
  attributeId: number,
  params?: GetAttributeTermsParams,
): Promise<WooPaginatedList<WooAttributeTerm>> {
  const res = (await woo.get(`products/attributes/${attributeId}/terms`, {
    ...params,
  })) as AxiosResponse<WooAttributeTerm[]>
  return fromWooListResponse(res)
}

export async function getAttributeTermById(
  attributeId: number,
  termId: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooAttributeTerm> {
  const res = (await woo.get(
    `products/attributes/${attributeId}/terms/${termId}`,
    { ...params },
  )) as AxiosResponse<WooAttributeTerm>
  return fromWooData(res)
}

export type CreateAttributeTermPayload = Pick<
  WooAttributeTerm,
  'name' | 'slug' | 'description' | 'menu_order'
>

export async function createAttributeTerm(
  attributeId: number,
  data: CreateAttributeTermPayload,
): Promise<WooAttributeTerm> {
  const res = (await woo.post(
    `products/attributes/${attributeId}/terms`,
    data,
    {},
  )) as AxiosResponse<WooAttributeTerm>
  return fromWooData(res)
}

export async function updateAttributeTerm(
  attributeId: number,
  termId: number,
  data: Partial<CreateAttributeTermPayload>,
): Promise<WooAttributeTerm> {
  const res = (await woo.put(
    `products/attributes/${attributeId}/terms/${termId}`,
    data,
    {},
  )) as AxiosResponse<WooAttributeTerm>
  return fromWooData(res)
}

export async function deleteAttributeTerm(
  attributeId: number,
  termId: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(
    `products/attributes/${attributeId}/terms/${termId}`,
    { ...params },
  )) as AxiosResponse
  return res.data
}
