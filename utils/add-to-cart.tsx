'use client'
import RenderAttributes from '@/components/product/render-attributes'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart.store'
import { WooProduct, WooProductAttribute } from '@/types/product.types'
import { useState } from 'react'
const AddToCartSection = ({ product }: { product: WooProduct }) => {
  const { addItem } = useCartStore()
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const hasOptions = product.type === 'variable' && product.variations.length > 0
  const needsOptions = hasOptions && selectedAttributes.length === 0

  const handleSelectAttribute = (attribute: WooProductAttribute) => {
    setSelectedAttributes(prev => [...prev, attribute.slug])
  }
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
    })
  }
  return (
    <div className="flex flex-col gap-2">
      {needsOptions ? (
        <RenderAttributes
          attributes={product.attributes}
          onSelect={handleSelectAttribute}
          selectedAttributes={selectedAttributes}
        />
      ) : null}
      <Button onClick={handleAddToCart} disabled={needsOptions && selectedAttributes.length === 0}>
        Добави в количката
      </Button>
    </div>
  )
}

export default AddToCartSection
