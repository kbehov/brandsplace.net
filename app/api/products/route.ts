import { getProducts } from '@/services/product.service'
import type { GetProductsParams } from '@/services/product.service'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  try {
    const list = await getProducts(body as GetProductsParams)
    return NextResponse.json(list)
  } catch {
    return NextResponse.json({ error: 'products_fetch_failed' }, { status: 502 })
  }
}
