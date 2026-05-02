/** Slim product shape returned by `/api/search/products`. */
export type SearchProductHit = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  on_sale: boolean
  image: string | null
}

export type ProductSearchResponse = {
  items: SearchProductHit[]
  total: number
}

/** Serialized category row for search dropdown (from `categegoriesForSearch`). */
export type SearchTrendingCategory = {
  id: number
  name: string
  slug: string
  count: number
  imageSrc: string | null
}
