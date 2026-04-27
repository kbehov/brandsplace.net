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
  if (value == null || value === '') {
    return NaN
  }
  if (typeof value === 'number') {
    return value
  }
  return parseFloat(String(value).replace(/\s/g, '').replace(',', '.'))
}

/**
 * Some WordPress / plugin setups return `regular_price` and `sale_price` as integer
 * stotinki (1/100 of BGN) while `price` is already the major (display) amount.
 * The core WooCommerce REST API normally uses decimal strings for all three.
 */
export function normalizeWooProductPrices<T extends WithWooPriceFields>(product: T): T {
  const priceN = parseWooNumber(product.price)
  const regN = parseWooNumber(product.regular_price)
  const saleN = parseWooNumber(product.sale_price)
  if (!Number.isFinite(priceN)) {
    return product
  }

  if (
    product.on_sale &&
    Number.isInteger(regN) &&
    regN >= 100 &&
    product.sale_price != null &&
    String(product.sale_price) !== '' &&
    Number.isInteger(saleN) &&
    saleN >= 10
  ) {
    const regMajor = regN / 100
    const saleMajor = saleN / 100
    if (Math.abs(saleMajor - priceN) < EPS && regMajor > saleMajor - EPS) {
      return {
        ...product,
        price: priceN.toFixed(2),
        regular_price: regMajor.toFixed(2),
        sale_price: saleMajor.toFixed(2),
      }
    }
  }
  product.bgn_price = (priceN * EUR_TO_BGN).toFixed(2)

  if (!product.on_sale) {
    const r = product.regular_price
    if (r != null && r !== '' && Number.isInteger(regN) && regN >= 100) {
      const regMajor = regN / 100
      if (Math.abs(regMajor - priceN) < EPS) {
        const fixed = regMajor.toFixed(2)
        return { ...product, price: fixed, regular_price: fixed, sale_price: '' }
      }
    }
  }

  return product
}
