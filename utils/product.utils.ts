import { WooStockStatus } from '@/types/product.types'

export function stockLabel(status: WooStockStatus): string {
  switch (status) {
    case 'instock':
      return 'В наличност'
    case 'outofstock':
      return 'Изчерпан'
    case 'onbackorder':
      return 'По поръчка'
    default:
      return status
  }
}
