import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooProductCategory } from '@/types/product-category.types'

export type GetCategoriesParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
  parent?: number
  slug?: string
  hide_empty?: boolean
  include?: string
  exclude?: string
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<WooPaginatedList<WooProductCategory>> {
  const res = (await woo.get('products/categories', { ...params })) as AxiosResponse<
    WooProductCategory[]
  >
  return fromWooListResponse(res)
}

export async function getCategoryById(id: number): Promise<WooProductCategory> {
  const res = (await woo.get(`products/categories/${id}`, {})) as AxiosResponse<WooProductCategory>
  return fromWooData(res)
}

/**
 * Resolves a category by slug (single result or null).
 */
export async function getCategoryBySlug(slug: string): Promise<WooProductCategory | null> {
  const res = (await woo.get('products/categories', {
    slug,
    per_page: 1,
  })) as AxiosResponse<WooProductCategory[]>
  return res.data[0] ?? null
}

export async function getParentCategories(
  params?: Omit<GetCategoriesParams, 'parent'>,
): Promise<WooPaginatedList<WooProductCategory>> {
  return getCategories({ ...params, parent: 0 })
}

/**
 * Fetches a category by numeric id or by slug (slug preferred via query for string slugs).
 */
export async function getCategoryBySlugOrId(slugOrId: string | number): Promise<WooProductCategory> {
  if (typeof slugOrId === 'number') {
    return getCategoryById(slugOrId)
  }
  if (/^\d+$/.test(slugOrId)) {
    return getCategoryById(Number(slugOrId))
  }
  const found = await getCategoryBySlug(slugOrId)
  if (!found) {
    throw new Error(`Category not found: ${slugOrId}`)
  }
  return found
}
