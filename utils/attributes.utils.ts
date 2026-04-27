import type { WooProductAttribute } from '@/types/product.types'

export const getProductAttributes = (attributes: WooProductAttribute[]) => {
  return attributes.map(attribute => attribute.name).join(', ')
}

export const getColorAttribute = (attributes: WooProductAttribute[]) => {
  const colorAttribute = attributes.find(attribute => attribute.slug === 'pa_color')
  if (!colorAttribute) return null
  return colorAttribute.options
}

export const getSizeAttribute = (attributes: WooProductAttribute[]) => {
  const sizeAttribute = attributes.find(attribute => attribute.slug === 'pa_size')
  if (!sizeAttribute) return null
  return sizeAttribute.options
}
