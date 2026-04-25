import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooProductVariation } from '@/types/product-variation.types'

export type GetVariationsParams = {
  page?: number
  per_page?: number
  search?: string
  after?: string
  before?: string
  order?: 'asc' | 'desc'
  orderby?:
    | 'id'
    | 'include'
    | 'name'
    | 'date'
    | 'type'
    | 'title'
    | 'relevance'
    | 'slug'
    | 'menu_order'
    | 'name_num'
    | 'modified'
    | 'rand'
    | 'meta_key'
  parent?: number
  parent_exclude?: string
  include?: string
  exclude?: string
  include_status?: 'any' | 'private' | 'trash' | 'draft' | 'pending' | 'publish' | 'future' | 'private'
  sku?: string
  stock_status?: 'instock' | 'outofstock' | 'onbackorder'
  on_sale?: boolean
  min_price?: string
  max_price?: string
}

/**
 * List variations for a **variable** product.
 */
export async function getVariations(
  productId: number,
  params?: GetVariationsParams,
): Promise<WooPaginatedList<WooProductVariation>> {
  const res = (await woo.get(
    `products/${productId}/variations`,
    { ...params },
  )) as AxiosResponse<WooProductVariation[]>
  return fromWooListResponse(res)
}

export async function getVariationById(
  productId: number,
  variationId: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooProductVariation> {
  const res = (await woo.get(
    `products/${productId}/variations/${variationId}`,
    { ...params },
  )) as AxiosResponse<WooProductVariation>
  return fromWooData(res)
}

export type CreateVariationPayload = Partial<WooProductVariation> & { sku?: string }
export type UpdateVariationPayload = Partial<WooProductVariation>

export async function createVariation(
  productId: number,
  data: CreateVariationPayload,
): Promise<WooProductVariation> {
  const res = (await woo.post(
    `products/${productId}/variations`,
    data,
    {},
  )) as AxiosResponse<WooProductVariation>
  return fromWooData(res)
}

export async function updateVariation(
  productId: number,
  variationId: number,
  data: UpdateVariationPayload,
): Promise<WooProductVariation> {
  const res = (await woo.put(
    `products/${productId}/variations/${variationId}`,
    data,
    {},
  )) as AxiosResponse<WooProductVariation>
  return fromWooData(res)
}

export async function deleteVariation(
  productId: number,
  variationId: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(
    `products/${productId}/variations/${variationId}`,
    { ...params },
  )) as AxiosResponse
  return res.data
}

/**
 * Batch-fetch variations for the given `variation` ids. Uses `include` on the parent product's variation list (same product id).
 */
export async function getVariationsByIds(
  productId: number,
  ids: number[],
  params?: Omit<GetVariationsParams, 'include'>,
): Promise<WooPaginatedList<WooProductVariation>> {
  if (ids.length === 0) {
    return { items: [], total: 0, totalPages: 0 }
  }
  return getVariations(productId, {
    ...params,
    include: ids.join(','),
    per_page: params?.per_page ?? ids.length,
  })
}
