import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooShippingMethodDefinition, WooShippingZoneMethod } from '@/types/shipping-method.types'

/** `GET /shipping/zones` — id, name, order, locations (omitted in minimal use). */
export type WooShippingZone = {
  id: number
  name: string
  order: number
}

export async function getShippingMethodDefinitions(): Promise<
  WooPaginatedList<WooShippingMethodDefinition>
> {
  const res = (await woo.get('shipping_methods', {})) as AxiosResponse<WooShippingMethodDefinition[]>
  return fromWooListResponse(res)
}

export async function getShippingZones(
  params?: { page?: number; per_page?: number },
): Promise<WooPaginatedList<WooShippingZone>> {
  const res = (await woo.get('shipping/zones', { ...params })) as AxiosResponse<WooShippingZone[]>
  return fromWooListResponse(res)
}

export async function getShippingZoneById(
  id: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooShippingZone> {
  const res = (await woo.get(`shipping/zones/${id}`, { ...params })) as AxiosResponse<WooShippingZone>
  return fromWooData(res)
}

export type CreateShippingZoneBody = { name: string; order?: number; locations?: object[] }
export type UpdateShippingZoneBody = { name?: string; order?: number; locations?: object[] }

export async function createShippingZone(data: CreateShippingZoneBody): Promise<WooShippingZone> {
  const res = (await woo.post('shipping/zones', data, {})) as AxiosResponse<WooShippingZone>
  return fromWooData(res)
}

export async function updateShippingZone(
  id: number,
  data: UpdateShippingZoneBody,
): Promise<WooShippingZone> {
  const res = (await woo.put(`shipping/zones/${id}`, data, {})) as AxiosResponse<WooShippingZone>
  return fromWooData(res)
}

export async function deleteShippingZone(
  id: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(`shipping/zones/${id}`, { ...params })) as AxiosResponse
  return res.data
}

/**
 * Configured method instances for a zone (`GET /shipping/zones/{zoneId}/methods`).
 */
export async function getShippingZoneMethods(
  zoneId: number,
  params?: { page?: number; per_page?: number },
): Promise<WooPaginatedList<WooShippingZoneMethod>> {
  const res = (await woo.get(`shipping/zones/${zoneId}/methods`, {
    ...params,
  })) as AxiosResponse<WooShippingZoneMethod[]>
  return fromWooListResponse(res)
}

export type CreateShippingZoneMethodBody = {
  order?: number
  enabled?: boolean
  method_id: string
  title?: string
  settings?: Record<string, unknown>
}

export async function getShippingZoneMethod(
  zoneId: number,
  instanceId: number,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<WooShippingZoneMethod> {
  const res = (await woo.get(`shipping/zones/${zoneId}/methods/${instanceId}`, {
    ...params,
  })) as AxiosResponse<WooShippingZoneMethod>
  return fromWooData(res)
}

export async function createShippingZoneMethod(
  zoneId: number,
  data: CreateShippingZoneMethodBody,
): Promise<WooShippingZoneMethod> {
  const res = (await woo.post(
    `shipping/zones/${zoneId}/methods`,
    data,
    {},
  )) as AxiosResponse<WooShippingZoneMethod>
  return fromWooData(res)
}

export async function updateShippingZoneMethod(
  zoneId: number,
  instanceId: number,
  data: Partial<WooShippingZoneMethod>,
): Promise<WooShippingZoneMethod> {
  const res = (await woo.put(
    `shipping/zones/${zoneId}/methods/${instanceId}`,
    data,
    {},
  )) as AxiosResponse<WooShippingZoneMethod>
  return fromWooData(res)
}

export async function deleteShippingZoneMethod(
  zoneId: number,
  instanceId: number,
  params?: { force?: boolean },
): Promise<unknown> {
  const res = (await woo.delete(`shipping/zones/${zoneId}/methods/${instanceId}`, {
    ...params,
  })) as AxiosResponse
  return res.data
}
