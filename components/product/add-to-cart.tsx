'use client'

import RenderAttributes from '@/components/product/render-attributes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { buildCartItem } from '@/lib/build-cart-item'
import { findMatchingVariation, selectionIsComplete, variationAttributeSlugs } from '@/lib/match-product-variation'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import type { WooProductVariation } from '@/types/product-variation.types'
import type { WooProduct } from '@/types/product.types'
import { formatBgnFromEur, formatMoney, salePercentOff, variationPriceRange } from '@/utils/price.utils'
import { stockLabel } from '@/utils/product.utils'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import ProductTrustIndicators from './product-trust-indicators'
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
  const { bgn_price, stock_status } = product
  const { addItem } = useCartStore()
  const [selection, setSelection] = useState<Record<string, string>>(() => initialSelection(product))
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const variationSlugs = useMemo(() => variationAttributeSlugs(product), [product])
  const isVariableProduct = product.type === 'variable' && product.variations.length > 0
  const hasAttrMatrix = variationSlugs.length > 0
  const isVariable = isVariableProduct && hasAttrMatrix
  const hasVariationRows = variations.length > 0
  const vRange = isVariable && variations.length > 0 ? variationPriceRange(variations) : null
  const selectionComplete = isVariable ? selectionIsComplete(product, selection) : true

  const matchedVariation = useMemo(() => {
    if (!isVariable || !hasVariationRows) return null
    return findMatchingVariation(product, variations, selection)
  }, [product, variations, selection, isVariable, hasVariationRows])

  const variationIsAvailable = matchedVariation
    ? matchedVariation.purchasable &&
      (matchedVariation.stock_status !== 'outofstock' || matchedVariation.backorders_allowed)
    : false
  const productIsAvailable = product.stock_status !== 'outofstock' || product.backorders_allowed
  const canSubmitVariable = Boolean(
    isVariable && hasVariationRows && selectionComplete && matchedVariation && variationIsAvailable,
  )
  const canSubmitSimple = product.type === 'simple' && productIsAvailable
  const canAdd = product.purchasable && (canSubmitVariable || canSubmitSimple)

  const maxQty = product.sold_individually ? 1 : 99
  const effectiveQty = Math.min(quantity, maxQty)

  const displayPrice = matchedVariation?.price ?? product.price
  const displayRegular = matchedVariation?.regular_price ?? product.regular_price
  const displayOnSale = matchedVariation?.on_sale ?? product.on_sale
  const displayStockStatus = matchedVariation?.stock_status ?? stock_status
  const percentOff = displayOnSale && displayRegular ? salePercentOff(displayRegular, displayPrice) : null
  const rangePrice = isVariable && !matchedVariation ? vRange : null
  const hasUnavailableSelection = isVariable && selectionComplete && !matchedVariation
  const selectedVariationOutOfStock = Boolean(matchedVariation && !variationIsAvailable)
  const ctaLabel = justAdded
    ? 'Добавено в количката'
    : isVariable && !selectionComplete
      ? 'Изберете вариант'
      : 'Добави в количката'
  const helperText = !product.purchasable
    ? 'Този артикул не е достъпен за покупка в момента.'
    : hasUnavailableSelection
      ? 'Тази комбинация не е налична. Изберете други опции.'
      : selectedVariationOutOfStock
        ? 'Избраният вариант е изчерпан. Изберете друг вариант.'
        : isVariable && !selectionComplete
          ? 'Изберете всички опции, за да активирате бутона.'
          : 'Следваща стъпка: преглед на количката и финализиране.'

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
        <Button
          asChild
          className="h-12 w-full rounded-sm text-sm font-medium tracking-wide touch-manipulation"
          size="lg"
        >
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
      <p className="border-t border-border/50 pt-6 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
        Този продукт има варианти, но опциите не са конфигурирани за онлайн избор. Свържете се с нас за поръчка.
      </p>
    )
  }

  if (isVariable && !hasVariationRows) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Вариантите за този продукт не можаха да се заредят. Моля, презаредете страницата.
      </p>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* ── Pricing block ── */}
      <div className="space-y-4">
        {/* Badges row: sale pill + stock status side-by-side */}
        <div className="flex items-center gap-2">
          {displayOnSale ? (
            <Badge className="rounded-xs bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white ">
              Промоция
            </Badge>
          ) : null}
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 rounded-none px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]',
              displayStockStatus === 'instock'
                ? 'border-emerald-600/30 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300'
                : 'border-border bg-muted/40 text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'size-1.5 shrink-0 rounded-full',
                displayStockStatus === 'instock' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-muted-foreground/50',
              )}
              aria-hidden
            />
            {stockLabel(displayStockStatus)}
          </Badge>
        </div>

        {/* Price cluster */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {rangePrice ? (
              <>
                <span className="text-3xl font-black tabular-nums tracking-tight text-foreground">
                  {formatMoney(rangePrice.min)} €
                </span>
                {!rangePrice.single ? (
                  <span className="text-base tabular-nums text-muted-foreground">
                    – {formatMoney(rangePrice.max)} €
                  </span>
                ) : null}
              </>
            ) : (
              <>
                <span
                  className={cn(
                    'text-3xl font-black tabular-nums tracking-tight',
                    displayOnSale ? 'text-red-600 dark:text-red-400' : 'text-foreground',
                  )}
                >
                  {formatMoney(displayPrice)} €
                </span>
                {displayOnSale && displayRegular ? (
                  <span className="text-base tabular-nums text-muted-foreground line-through decoration-muted-foreground/60">
                    {formatMoney(displayRegular)} €
                  </span>
                ) : null}
                {percentOff !== null ? (
                  <Badge variant="secondary" className="rounded-none text-[10px] uppercase tracking-wider">
                    −{percentOff}%
                  </Badge>
                ) : null}
              </>
            )}
          </div>

          {!isVariable ? (
            <p className="text-sm tabular-nums text-muted-foreground">{formatMoney(bgn_price)} лв.</p>
          ) : matchedVariation ? (
            <p className="text-sm tabular-nums text-muted-foreground">{formatBgnFromEur(displayPrice)} лв.</p>
          ) : vRange ? (
            <p className="text-sm text-muted-foreground">Цената в лева се показва след избор на вариант.</p>
          ) : null}
        </div>
      </div>

      <Separator />

      {isVariable ? (
        <>
          <RenderAttributes
            attributes={product.attributes}
            selection={selection}
            onSelectOption={handleSelectOption}
            disabled={!product.purchasable}
          />
          {hasUnavailableSelection || selectedVariationOutOfStock ? (
            <p className="text-sm text-amber-700 dark:text-amber-400" aria-live="polite">
              {helperText}
            </p>
          ) : null}
        </>
      ) : null}

      {isVariable ? <Separator /> : null}

      {/* ── Qty stepper + CTA ── */}
      <div className="flex flex-col gap-4  sm:items-stretch">
        {!product.sold_individually ? (
          <div className="flex h-12 w-full lg:w-fit shrink-0 select-none items-stretch rounded-sm border border-border/80 bg-background">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-none rounded-l-sm touch-manipulation"
              aria-label="Намали количество"
              disabled={effectiveQty <= 1}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <Minus className="size-3.5" aria-hidden />
            </Button>
            <div
              className="flex min-w-14 w-full lg:w-fit items-center justify-center border-x border-border/80 text-sm font-medium tabular-nums cursor-pointer"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sr-only">Количество: </span>
              {effectiveQty}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 shrink-0 rounded-none rounded-r-sm touch-manipulation cursor-pointer"
              aria-label="Увеличи количество"
              disabled={effectiveQty >= maxQty}
              onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
            >
              <Plus className="size-3.5" aria-hidden />
            </Button>
          </div>
        ) : null}

        <Button
          type="button"
          size="lg"
          disabled={!canAdd}
          onClick={handleAddToCart}
          aria-describedby="add-to-cart-helper"
          className="cursor-pointer h-14"
        >
          {justAdded ? (
            <>
              <Check className="mr-2 size-4 opacity-90" aria-hidden />
              {ctaLabel}
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 size-4 opacity-90" aria-hidden />
              {ctaLabel}
            </>
          )}
        </Button>
      </div>
      <ProductTrustIndicators />
      <p id="add-to-cart-helper" className="text-xs leading-5 text-muted-foreground" aria-live="polite">
        {helperText}
      </p>
    </div>
  )
}

export default AddToCartSection
