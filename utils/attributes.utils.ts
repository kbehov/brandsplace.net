import type { WooProductAttribute } from '@/types/product.types'

export const getProductAttributes = (attributes: WooProductAttribute[]) => {
  return attributes.map(attribute => attribute.name).join(', ')
}

export const getColorAttribute = (attributes: WooProductAttribute[]) => {
  const colorAttribute = attributes.find(
    attribute => attribute.slug === 'pa_color' || attribute.slug.includes('color') || attribute.slug.includes('цвят'),
  )
  if (!colorAttribute) return null
  return colorAttribute.options
}

export const getSizeAttribute = (attributes: WooProductAttribute[]) => {
  const sizeAttribute = attributes.find(
    attribute => attribute.slug === 'pa_size' || attribute.slug.includes('size') || attribute.slug.includes('размер'),
  )
  if (!sizeAttribute) return null
  return sizeAttribute.options
}
