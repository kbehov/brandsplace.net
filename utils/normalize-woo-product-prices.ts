const EPS = 0.01
const EUR_TO_BGN = 1.95583

type WithWooPriceFields = {
  price: string | number
  bgn_price: string | number
  regular_price: string | number
  sale_price: string | number
  on_sale: boolean
}

function parseWooNumber(value: string | number | null | undefined): number {
  if (value == null || value === '') return NaN
  if (typeof value === 'number') return value
  return parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
}

function toBgn(eur: number): string {
  return (eur * EUR_TO_BGN).toFixed(2)
}

export function normalizeWooProductPrices<T extends WithWooPriceFields>(product: T): T {
  const priceN = parseWooNumber(product.price)
  const regN = parseWooNumber(product.regular_price)
  const saleN = parseWooNumber(product.sale_price)

  if (!Number.isFinite(priceN)) return product

  // --- On-sale: stotinki path ---
  // Some plugin setups send regular_price/sale_price as integer stotinki (e.g. 4999, 3499)
  // while price is already the display major amount (e.g. 34.99).
  if (product.on_sale && Number.isInteger(regN) && regN >= 100 && Number.isInteger(saleN) && saleN >= 10) {
    const regMajor = regN / 100
    const saleMajor = saleN / 100
    if (Math.abs(saleMajor - priceN) < EPS && regMajor > saleMajor - EPS) {
      return {
        ...product,
        price: saleMajor.toFixed(2),
        regular_price: regMajor.toFixed(2),
        sale_price: saleMajor.toFixed(2),
        bgn_price: toBgn(saleMajor), // was missing entirely in on-sale path
      }
    }
  }

  // --- On-sale: normal decimal path ---
  if (product.on_sale) {
    const displayN = Number.isFinite(saleN) ? saleN : priceN
    return {
      ...product,
      price: displayN.toFixed(2),
      bgn_price: toBgn(displayN),
    }
  }

  // --- Not on sale: stotinki path ---
  // regular_price sent as integer stotinki but price is already major
  if (Number.isInteger(regN) && regN >= 100 && Math.abs(regN / 100 - priceN) < EPS) {
    const fixed = priceN.toFixed(2)
    return {
      ...product,
      price: fixed,
      regular_price: fixed,
      sale_price: '',
      bgn_price: toBgn(priceN),
    }
  }

  // --- Not on sale: normal path ---
  return {
    ...product,
    price: priceN.toFixed(2),
    bgn_price: toBgn(priceN),
  }
}
