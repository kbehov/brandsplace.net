import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooProduct } from '@/types/product.types'

export type GetProductsParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'popularity' | 'rating' | 'menu_order'
  parent?: number
  slug?: string
  category?: string
  tag?: string
  attribute?: string
  attribute_term?: string
  stock_status?: 'instock' | 'outofstock' | 'onbackorder'
  on_sale?: boolean
  featured?: boolean
  include?: string
  skip?: string
}

/**
 * List products. Query args are sent as top-level query parameters (WooCommerce REST).
 */
export async function getProducts(
  params?: GetProductsParams,
): Promise<WooPaginatedList<WooProduct>> {
  const res = (await woo.get('products', { ...params })) as AxiosResponse<WooProduct[]>
  return fromWooListResponse(res)
}

export async function getProductById(id: number): Promise<WooProduct> {
  const res = (await woo.get(`products/${id}`, {})) as AxiosResponse<WooProduct>
  return fromWooData(res)
}

/**
 * Resolves a product by slug (single result or null).
 */
export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const res = (await woo.get('products', { slug, per_page: 1 })) as AxiosResponse<WooProduct[]>
  return res.data[0] ?? null
}

export async function searchProducts(query: string): Promise<WooPaginatedList<WooProduct>> {
  return getProducts({ search: query })
}

/**
 * Fetches products related to the given product (`related_ids` on the product resource).
 * WooCommerce has no `GET /products/{id}/similar`; this uses core related IDs.
 */
export async function getSimilarProducts(
  id: number,
  options?: { per_page?: number },
): Promise<WooPaginatedList<WooProduct>> {
  const product = await getProductById(id)
  const include = product.related_ids
  if (include.length === 0) {
    return { items: [], total: 0, totalPages: 0 }
  }
  return getProducts({
    include: include.join(','),
    per_page: options?.per_page ?? 10,
  })
}
