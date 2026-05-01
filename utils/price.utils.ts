import { WooProductVariation } from '@/types/product-variation.types'

export const EUR_TO_BGN_RATE = 1.95583

export function parseAmount(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function salePercentOff(regular: string, current: string): number | null {
  const r = parseAmount(regular)
  const c = parseAmount(current)
  if (r === null || c === null || r <= 0 || c >= r) return null
  return Math.round((1 - c / r) * 100)
}

export function formatMoney(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') {
    return '—'
  }
  const n = typeof value === 'number' ? value : parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
  if (Number.isNaN(n)) {
    return String(value)
  }
  return new Intl.NumberFormat('bg-BG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

/** Display BGN equivalent for a EUR amount (same rate as `normalizeWooProductPrices`). */
export function formatBgnFromEur(eur: string | number | undefined): string {
  const n = parseAmount(eur == null ? undefined : String(eur))
  if (n === null) return '—'
  return formatMoney(n * EUR_TO_BGN_RATE)
}
function parsePriceN(value: string | undefined) {
  if (value == null || value === '') return NaN
  return parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
}

export function variationPriceRange(variations: WooProductVariation[]) {
  const nums = variations.map(v => parsePriceN(v.price)).filter(n => Number.isFinite(n))
  if (nums.length === 0) return null
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  return { min: min.toFixed(2), max: max.toFixed(2), single: min === max }
}
