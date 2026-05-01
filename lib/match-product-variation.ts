import type { WooProduct, WooProductAttribute, WooProductDefaultAttribute } from '@/types/product.types'
import type { WooProductVariation } from '@/types/product-variation.types'

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Map a variation row attribute to the parent product attribute slug. */
export function variationAttrToSlug(
  va: WooProductDefaultAttribute,
  productAttributes: WooProductAttribute[],
): string | null {
  if (va.id && va.id > 0) {
    const byId = productAttributes.find(a => a.id === va.id)
    if (byId) return byId.slug
  }
  const name = va.name?.trim()
  if (!name) return null
  const lower = name.toLowerCase()
  const bySlug = productAttributes.find(
    a => a.slug.toLowerCase() === lower || a.slug.replace(/^pa_/, '') === lower.replace(/^pa_/, ''),
  )
  if (bySlug) return bySlug.slug
  const byLabel = productAttributes.find(a => a.name.trim().toLowerCase() === lower)
  return byLabel?.slug ?? null
}

export function variationAttributeSlugs(product: WooProduct): string[] {
  return product.attributes.filter(a => a.variation && a.visible && a.options.length > 0).map(a => a.slug)
}

/** Whether every required slug has a non-empty selection. */
export function selectionIsComplete(product: WooProduct, selection: Record<string, string>): boolean {
  for (const slug of variationAttributeSlugs(product)) {
    const v = selection[slug]?.trim()
    if (!v) return false
  }
  return true
}

/**
 * Finds the variation that matches the current attribute selection (all variation attributes).
 */
export function findMatchingVariation(
  product: WooProduct,
  variations: WooProductVariation[],
  selection: Record<string, string>,
): WooProductVariation | null {
  if (!selectionIsComplete(product, selection)) return null

  const requiredSlugs = variationAttributeSlugs(product)

  return (
    variations.find(v => {
      if (!v.purchasable) return false
      if (v.stock_status === 'outofstock' && !v.backorders_allowed) return false

      for (const slug of requiredSlugs) {
        const selected = selection[slug]
        if (!selected) return false

        const va = v.attributes.find(x => variationAttrToSlug(x, product.attributes) === slug)
        if (!va) return false
        if (norm(va.option) !== norm(selected)) return false
      }

      // Every attribute on the variation row should agree with selection (ignore unknown slugs)
      for (const va of v.attributes) {
        const slug = variationAttrToSlug(va, product.attributes)
        if (!slug || !requiredSlugs.includes(slug)) continue
        const selected = selection[slug]
        if (!selected || norm(va.option) !== norm(selected)) return false
      }

      return true
    }) ?? null
  )
}
