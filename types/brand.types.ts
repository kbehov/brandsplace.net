export type WooBrand = {
  id: number
  name: string
  slug: string
  description: string
  image: string
  count: number
}

export type WooBrandsResponse = { data: WooBrand[] }
