import type { WooPaginatedList } from '@/lib/woo-response'
import type { GetProductsParams } from '@/services/product.service'
import type { WooProductListItem } from '@/types/product.types'

/**
 * List products from the browser. Woo credentials exist only on the server;
 * this calls a Route Handler that delegates to `getProducts`.
 */
export async function fetchProductsClient(params?: GetProductsParams): Promise<WooPaginatedList<WooProductListItem>> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params ?? {}),
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    const message = (await res.text().catch(() => '')) || `Request failed (${res.status})`
    throw new Error(message)
  }
  return res.json() as Promise<WooPaginatedList<WooProductListItem>>
}
