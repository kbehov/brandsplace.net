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

/**
 * Maps a default_attribute / selection string from the API onto a real attribute option.
 * WooCommerce sometimes sends truncated values or URL-encoded UTF-8 fragments (e.g. `%d0%b1` for "Бяло").
 */
export function resolveAttributeOption(raw: string, productOptions: string[]): string {
  const opts = productOptions
  if (!raw?.trim()) return raw

  const exact = opts.find(o => norm(o) === norm(raw))
  if (exact) return exact

  let decoded = raw
  if (raw.includes('%')) {
    try {
      decoded = decodeURIComponent(raw)
    } catch {
      /* ignore */
    }
    const afterDecode = opts.find(o => norm(o) === norm(decoded))
    if (afterDecode) return afterDecode
  }

  const nd = norm(decoded)
  const byPrefix = opts.find(
    o => norm(o).startsWith(nd) || nd.startsWith(norm(o)),
  )
  if (byPrefix) return byPrefix

  return raw
}

/**
 * Returns true when a variation delegates stock management to the parent product.
 * WooCommerce REST API returns `manage_stock: "parent"` for these variations.
 */
function variationDelegatesToParent(v: WooProductVariation): boolean {
  return v.manage_stock === 'parent' || v.manage_stock === false
}

/**
 * Stock rules when parent manages qty for all variations (variation `manage_stock` is false or "parent").
 */
export function variationInventoryAllowsPurchase(
  v: WooProductVariation,
  product?: WooProduct,
): boolean {
  if (variationDelegatesToParent(v)) {
    if (product?.manage_stock) {
      return product.stock_status !== 'outofstock' || product.backorders_allowed
    }
    // Parent doesn't track stock either — treat as in stock
    return true
  }
  return v.stock_status !== 'outofstock' || v.backorders_allowed
}

/**
 * WooCommerce often leaves `purchasable: false` on variations when only the parent row tracks inventory.
 */
export function variationConsideredPurchasable(v: WooProductVariation, product: WooProduct): boolean {
  if (v.purchasable) return true
  return Boolean(
    variationDelegatesToParent(v) &&
      product.purchasable &&
      (product.stock_status !== 'outofstock' || product.backorders_allowed),
  )
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
 * Finds the variation whose attributes match the current selection.
 * Availability (purchasable / inventory) is intentionally NOT checked here —
 * the caller is responsible for that so the UI can show the right message
 * ("combination not available" vs "out of stock").
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
      for (const slug of requiredSlugs) {
        const selected = selection[slug]
        if (!selected) return false

        const va = v.attributes.find(x => variationAttrToSlug(x, product.attributes) === slug)
        if (!va) return false

        // WooCommerce stores term slugs in variation.option (e.g. "б") but term labels
        // in product.attributes[].options (e.g. "Бяло"). Resolve the slug to its label
        // before comparing so both sides speak the same language.
        const productAttr = product.attributes.find(a => a.slug === slug)
        const resolvedOption = productAttr
          ? resolveAttributeOption(va.option, productAttr.options)
          : va.option

        if (norm(resolvedOption) !== norm(selected)) return false
      }

      // Every attribute on the variation row should agree with the selection (ignore unknown slugs)
      for (const va of v.attributes) {
        const slug = variationAttrToSlug(va, product.attributes)
        if (!slug || !requiredSlugs.includes(slug)) continue
        const selected = selection[slug]
        if (!selected) return false
        const productAttr = product.attributes.find(a => a.slug === slug)
        const resolvedOption = productAttr
          ? resolveAttributeOption(va.option, productAttr.options)
          : va.option
        if (norm(resolvedOption) !== norm(selected)) return false
      }

      return true
    }) ?? null
  )
}
