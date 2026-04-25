import type { AxiosResponse } from 'axios'

export type WooPaginatedList<TItem> = {
  items: TItem[]
  total: number
  totalPages: number
}

export function fromWooListResponse<TItem>(res: AxiosResponse<TItem[]>): WooPaginatedList<TItem> {
  return {
    items: res.data,
    total: Number(res.headers['x-wp-total'] ?? 0),
    totalPages: Number(res.headers['x-wp-totalpages'] ?? 0),
  }
}

export function fromWooData<T>(res: AxiosResponse<T>): T {
  return res.data
}
