import type { AxiosResponse } from 'axios'

import { fromWooData, fromWooListResponse, type WooPaginatedList } from '@/lib/woo-response'
import woo from '@/lib/woo'
import type { WooOrderNote } from '@/types/order-note.types'

export type GetOrderNotesParams = {
  page?: number
  per_page?: number
  search?: string
  type?: 'any' | 'internal' | 'customer'
  order?: 'asc' | 'desc'
  orderby?: 'date' | 'date_gmt' | 'id' | 'include' | 'title' | 'slug' | 'content' | 'parent' | 'type'
}

export type CreateOrderNotePayload = {
  note: string
  customer_note?: boolean
  added_by_user?: boolean
}

export async function getOrderNotes(
  orderId: number,
  params?: GetOrderNotesParams,
): Promise<WooPaginatedList<WooOrderNote>> {
  const res = (await woo.get(`orders/${orderId}/notes`, { ...params })) as AxiosResponse<
    WooOrderNote[]
  >
  return fromWooListResponse(res)
}

export async function getOrderNoteById(orderId: number, noteId: number): Promise<WooOrderNote> {
  const res = (await woo.get(`orders/${orderId}/notes/${noteId}`, {})) as AxiosResponse<WooOrderNote>
  return fromWooData(res)
}

export async function createOrderNote(
  orderId: number,
  data: CreateOrderNotePayload,
): Promise<WooOrderNote> {
  const res = (await woo.post(`orders/${orderId}/notes`, data, {})) as AxiosResponse<WooOrderNote>
  return fromWooData(res)
}

export async function deleteOrderNote(
  orderId: number,
  noteId: number,
  params?: { force?: boolean },
): Promise<{ id: number; data: { status: string } } | WooOrderNote> {
  const res = (await woo.delete(`orders/${orderId}/notes/${noteId}`, { ...params })) as AxiosResponse
  return res.data
}
