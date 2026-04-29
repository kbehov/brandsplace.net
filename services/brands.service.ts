import woo from '@/lib/woo'
import { WooBrandsResponse } from '@/types/brand.types'

export type GetBrandsParams = {
  page?: number
  per_page?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'name' | 'slug' | 'description' | 'count'
}

export async function getBrands(params?: GetBrandsParams): Promise<WooBrandsResponse> {
  const res = await woo.get('products/brands', { ...params })
  return res
}
