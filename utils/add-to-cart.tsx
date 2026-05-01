'use client'

import RenderAttributes from '@/components/product/render-attributes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buildCartItem } from '@/lib/build-cart-item'
import { findMatchingVariation, selectionIsComplete, variationAttributeSlugs } from '@/lib/match-product-variation'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import { formatBgnFromEur, formatMoney, salePercentOff, variationPriceRange } from '@/utils/price.utils'
import { stockLabel } from '@/utils/product.utils'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

function initialSelection(product: WooProduct): Record<string, string> {
  const sel: Record<string, string> = {}
  for (const d of product.default_attributes) {
    const byId = product.attributes.find(a => a.id === d.id)
    const byName = product.attributes.find(
      a => a.slug === d.name?.trim() || a.name.trim().toLowerCase() === d.name?.trim().toLowerCase(),
    )
    const slug = byId?.slug ?? byName?.slug
    if (slug && d.option) sel[slug] = d.option
  }
  return sel
}

type AddToCartSectionProps = {
  product: WooProduct
  /** Pre-fetched on the server for variable products */
  variations?: WooProductVariation[]
}

const AddToCartSection = ({ product, variations = [] }: AddToCartSectionProps) => {
  const { on_sale, bgn_price, sku, stock_status } = product
  const { addItem } = useCartStore()
  const [selection, setSelection] = useState<Record<string, string>>(() => initialSelection(product))
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const isVariableProduct = product.type === 'variable' && product.variations.length > 0
  const hasAttrMatrix = variationAttributeSlugs(product).length > 0
  const isVariable = isVariableProduct && hasAttrMatrix
  const hasVariationRows = variations.length > 0
  const vRange = isVariable && variations.length > 0 ? variationPriceRange(variations) : null

  const matchedVariation = useMemo(() => {
    if (!isVariable || !hasVariationRows) return null
    return findMatchingVariation(product, variations, selection)
  }, [product, variations, selection, isVariable, hasVariationRows])

  const canSubmitVariable =
    isVariable && hasVariationRows && selectionIsComplete(product, selection) && matchedVariation
  const canSubmitSimple = product.type === 'simple'
  const canAdd =
    product.purchasable &&
    (canSubmitVariable || canSubmitSimple) &&
    (matchedVariation ? matchedVariation.stock_status !== 'outofstock' || matchedVariation.backorders_allowed : true) &&
    (!isVariable ? product.stock_status !== 'outofstock' || product.backorders_allowed : true)

  const maxQty = product.sold_individually ? 1 : 99
  const effectiveQty = Math.min(quantity, maxQty)

  const displayPrice = matchedVariation?.price ?? product.price
  const displayRegular = matchedVariation?.regular_price ?? product.regular_price
  const displayOnSale = matchedVariation?.on_sale ?? product.on_sale
  const percentOff = displayOnSale && displayRegular ? salePercentOff(displayRegular, displayPrice) : null

  const handleSelectOption = (slug: string, option: string) => {
    setSelection(prev => ({ ...prev, [slug]: option }))
  }

  const handleAddToCart = () => {
    if (!product.purchasable) {
      toast.error('Този продукт не може да бъде закупен онлайн.')
      return
    }
    if (isVariable) {
      if (!hasVariationRows) {
        toast.error('Вариантите не са налични. Опитайте отново по-късно.')
        return
      }
      if (!selectionIsComplete(product, selection)) {
        toast.message('Изберете опции', {
          description: 'Моля, изберете всички варианти преди да добавите в количката.',
        })
        return
      }
      if (!matchedVariation) {
        toast.error('Тази комбинация не е налична.')
        return
      }
    }

    const item = buildCartItem(product, {
      quantity: effectiveQty,
      variation: isVariable ? matchedVariation : null,
      selectedAttributes: selection,
    })
    addItem(item)
    toast.success('Добавено в количката', {
      description: product.name,
    })
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2000)
  }

  if (product.type === 'external' && product.external_url) {
    return (
      <div className="space-y-4 border-t border-border/50 pt-6">
        <Button asChild className="h-12 w-full rounded-sm text-sm font-medium tracking-wide" size="lg">
          <a
            href={product.external_url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center justify-center"
          >
            {product.button_text?.trim() || 'Към продукта'}
          </a>
        </Button>
      </div>
    )
  }

  if (product.type === 'grouped') {
    return null
  }

  if (isVariableProduct && !hasAttrMatrix) {
    return (
      <p className="border-t border-border/50 pt-6 text-sm leading-relaxed text-muted-foreground">
        Този продукт има варианти, но опциите не са конфигурирани за онлайн избор. Свържете се с нас за поръчка.
      </p>
    )
  }

  if (isVariable && !hasVariationRows) {
    return (
      <p className="text-sm text-muted-foreground">
        Вариантите за този продукт не можаха да се заредят. Моля, презаредете страницата.
      </p>
    )
  }

  return (
    <div className="space-y-6 ">
      <div>
        {on_sale ? (
          <Badge
            variant="outline"
            className="rounded-sm  bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase  text-white "
          >
            Намаление
          </Badge>
        ) : null}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {isVariable && vRange ? (
                <>
                  <span className="text-2xl font-medium tabular-nums tracking-tight text-foreground">
                    {formatMoney(vRange.min)} €
                  </span>
                  {!vRange.single ? (
                    <span className="text-base tabular-nums text-muted-foreground">– {formatMoney(vRange.max)} €</span>
                  ) : null}
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      'text-2xl font-medium tabular-nums tracking-tight',
                      on_sale ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                    )}
                  >
                    {formatMoney(displayPrice)} €
                  </span>
                  {on_sale && displayRegular ? (
                    <span className="text-base tabular-nums text-muted-foreground line-through decoration-muted-foreground/60">
                      {formatMoney(displayRegular)} €
                    </span>
                  ) : null}
                </>
              )}
              {percentOff !== null ? (
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  −{percentOff}%
                </Badge>
              ) : null}
            </div>
            {!isVariable ? (
              <span className="text-sm tabular-nums text-muted-foreground">/ {formatMoney(bgn_price)} лв.</span>
            ) : vRange ? (
              <span className="text-sm text-muted-foreground">Цената в лева се показва след избор на вариант.</span>
            ) : null}
          </div>

          <p
            className={cn(
              'text-xs font-medium uppercase tracking-[0.16em]',
              stock_status === 'instock' ? 'text-foreground/75' : 'text-muted-foreground',
            )}
          >
            {stockLabel(stock_status)}
            {sku ? <span className="ml-2 text-muted-foreground normal-case tracking-normal">· SKU {sku}</span> : null}
          </p>
        </div>
      </div>
      {isVariable ? (
        <>
          <RenderAttributes
            attributes={product.attributes}
            selection={selection}
            onSelectOption={handleSelectOption}
            disabled={!product.purchasable}
          />
          {selectionIsComplete(product, selection) && !matchedVariation ? (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Тази комбинация не е налична. Изберете други опции.
            </p>
          ) : null}
        </>
      ) : null}

      {isVariable && matchedVariation ? (
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-sm border border-border/40 bg-muted/20 px-4 py-3">
          <span className="text-xl font-medium tabular-nums text-foreground">{formatMoney(displayPrice)} €</span>
          {displayOnSale && displayRegular ? (
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              {formatMoney(displayRegular)} €
            </span>
          ) : null}
          {percentOff !== null ? (
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">−{percentOff}%</span>
          ) : null}
          <span className="text-sm tabular-nums text-muted-foreground">/ {formatBgnFromEur(displayPrice)} лв.</span>
          <span className="w-full text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {stockLabel(matchedVariation.stock_status)}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        {!product.sold_individually ? (
          <div className="flex h-12 shrink-0 items-stretch rounded-sm border border-border/80 bg-background">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-none rounded-l-sm"
              aria-label="Намали количество"
              disabled={effectiveQty <= 1}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <Minus className="size-4" aria-hidden />
            </Button>
            <div className="flex min-w-12 items-center justify-center border-x border-border/80 text-sm font-medium tabular-nums">
              {effectiveQty}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-none rounded-r-sm"
              aria-label="Увеличи количество"
              disabled={effectiveQty >= maxQty}
              onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
            >
              <Plus className="size-4" aria-hidden />
            </Button>
          </div>
        ) : null}

        <Button
          type="button"
          size="lg"
          disabled={!canAdd}
          onClick={handleAddToCart}
          className="h-12 flex-1 rounded-sm text-sm font-medium tracking-[0.12em] uppercase shadow-sm transition-[transform,box-shadow] active:scale-[0.99]"
        >
          {justAdded ? (
            'Добавено'
          ) : (
            <>
              <ShoppingBag className="mr-2 size-4 opacity-90" aria-hidden />
              Добави в количката
            </>
          )}
        </Button>
      </div>

      {!product.purchasable ? (
        <p className="text-xs text-muted-foreground">Този артикул не е достъпен за покупка в момента.</p>
      ) : null}
    </div>
  )
}

export default AddToCartSection
