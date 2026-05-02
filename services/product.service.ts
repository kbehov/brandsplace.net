import type { AxiosResponse } from 'axios'

import { normalizeWooProductPrices } from '@/lib/normalize-woo-product-prices'
import woo from '@/lib/woo'
import { WOO_PRODUCT_LIST_REST_FIELDS_CSV } from '@/lib/woo-product-list-fields'
import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import type { WooProduct, WooProductListItem } from '@/types/product.types'

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
  status?: 'publish' | 'draft' | 'pending' | 'private'
  /**
   * WordPress global REST param `?_fields=` (comma‑separated property names).
   * Omitted: defaults to a slim set for list/grid (`WOO_PRODUCT_LIST_REST_FIELDS_CSV`).
   * `'all'`: no `_fields` — full product resource (e.g. resolve-by-slug before a detail request).
   */
  _fields?: string | 'all'
}

function toProductListQuery(params?: GetProductsParams): Omit<GetProductsParams, '_fields'> & { _fields?: string } {
  const p = (params ? { ...params } : {}) as GetProductsParams & { _fields?: string }
  if (p._fields === 'all') {
    const { _fields, ...rest } = p
    return rest
  }
  if (p._fields == null || p._fields === '') {
    p._fields = WOO_PRODUCT_LIST_REST_FIELDS_CSV
  }
  return p
}

/**
 * List products. Query args are sent as top-level query parameters (WooCommerce REST).
 * By default sends `?_fields=` to drop heavy properties (see `WOO_PRODUCT_LIST_REST_FIELDS_CSV`).
 */
export async function getProducts(params?: GetProductsParams): Promise<WooPaginatedList<WooProductListItem>> {
  const res = (await woo.get('products', toProductListQuery(params))) as AxiosResponse<WooProductListItem[]>
  const { items, ...rest } = fromWooListResponse(res)
  return { ...rest, items: items.map(normalizeWooProductPrices) }
}

export async function getProductById(id: number): Promise<WooProduct> {
  const res = (await woo.get(`products/${id}`, {})) as AxiosResponse<WooProduct>
  return normalizeWooProductPrices(fromWooData(res))
}

/**
 * Resolves a product by slug (single result or null).
 */
export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const res = (await woo.get('products', toProductListQuery({ slug, per_page: 1, _fields: 'all' }))) as AxiosResponse<
    WooProduct[]
  >
  const first = res.data[0]
  return first ? normalizeWooProductPrices(first) : null
}

export async function searchProducts(query: string): Promise<WooPaginatedList<WooProductListItem>> {
  return getProducts({ search: query })
}

/**
 * Fetches products related to the given product (`related_ids` on the product resource).
 * WooCommerce has no `GET /products/{id}/similar`; this uses core related IDs.
 */
export async function getSimilarProducts(
  id: number,
  options?: { per_page?: number },
): Promise<WooPaginatedList<WooProductListItem>> {
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
