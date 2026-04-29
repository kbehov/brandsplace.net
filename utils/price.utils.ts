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
