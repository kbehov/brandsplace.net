import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooCoupon } from '@/types/coupon.types'

export type GetCouponsParams = {
  page?: number
  per_page?: number
  search?: string
  after?: string
  before?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'date' | 'date_created' | 'relevance' | 'slug' | 'modified' | 'meta_key'
  code?: string
  email?: string
  modified_before?: string
  modified_after?: string
  dates_are_gmt?: boolean
}

export type CreateCouponPayload = Partial<Omit<WooCoupon, 'id'>> & { code: string }
export type UpdateCouponPayload = Partial<WooCoupon>

export async function getCoupons(params?: GetCouponsParams): Promise<WooPaginatedList<WooCoupon>> {
  const res = (await woo.get('coupons', { ...params })) as AxiosResponse<WooCoupon[]>
  return fromWooListResponse(res)
}

export async function getCouponById(id: number): Promise<WooCoupon> {
  const res = (await woo.get(`coupons/${id}`, {})) as AxiosResponse<WooCoupon>
  return fromWooData(res)
}

/**
 * Fetches a coupon by code (single match or null).
 */
export async function getCouponByCode(code: string): Promise<WooCoupon | null> {
  const res = (await woo.get('coupons', { code, per_page: 1 })) as AxiosResponse<WooCoupon[]>
  return res.data[0] ?? null
}

export async function createCoupon(data: CreateCouponPayload): Promise<WooCoupon> {
  const res = (await woo.post('coupons', data, {})) as AxiosResponse<WooCoupon>
  return fromWooData(res)
}

export async function updateCoupon(id: number, data: UpdateCouponPayload): Promise<WooCoupon> {
  const res = (await woo.put(`coupons/${id}`, data, {})) as AxiosResponse<WooCoupon>
  return fromWooData(res)
}

export async function deleteCoupon(
  id: number,
  params?: { force?: boolean },
): Promise<{ id: number; data: { status: string } } | WooCoupon> {
  const res = (await woo.delete(`coupons/${id}`, { ...params })) as AxiosResponse
  return res.data
}
