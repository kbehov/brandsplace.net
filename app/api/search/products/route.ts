import { getProducts } from '@/services/product.service'
import type { ProductSearchResponse, SearchProductHit } from '@/types/search.types'
import type { WooProduct } from '@/types/product.types'
import { NextResponse } from 'next/server'

const MIN_LEN = 2
const MAX_RESULTS = 8

function toHit(p: WooProduct): SearchProductHit {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    regular_price: p.regular_price,
    on_sale: p.on_sale,
    image: p.images[0]?.src ?? null,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') ?? '').trim()

  if (q.length < MIN_LEN) {
    const body: ProductSearchResponse = { items: [], total: 0 }
    return NextResponse.json(body)
  }

  try {
    const { items, total } = await getProducts({
      search: q,
      per_page: MAX_RESULTS,
    })

    // WooCommerce REST "status" is not in GetProductsParams - check if it causes type error
    const body: ProductSearchResponse = {
      items: items.map(toHit),
      total,
    }
    return NextResponse.json(body)
  } catch {
    return NextResponse.json(
      { error: 'search_failed' } as const,
      { status: 500 },
    )
  }
}
