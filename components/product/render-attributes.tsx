'use client'

import { Button } from '@/components/ui/button'
import { COLORS_VALUES } from '@/constants/colors'
import { cn } from '@/lib/utils'
import type { WooProductAttribute } from '@/types/product.types'

type RenderAttributesProps = {
  attributes: WooProductAttribute[]
  selection: Record<string, string>
  onSelectOption: (slug: string, option: string) => void
  disabled?: boolean
}

const isColorSlug = (slug: string) => slug === 'pa_color' || slug.toLowerCase().includes('color')

const RenderAttributes = ({ attributes, selection, onSelectOption, disabled }: RenderAttributesProps) => {
  const forVariation = attributes.filter(a => a.variation && a.visible && a.options.length > 0)

  if (forVariation.length === 0) return null

  return (
    <div className="space-y-6">
      {forVariation.map(attr => (
        <fieldset key={attr.slug} disabled={disabled} className="min-w-0 space-y-2.5">
          <legend className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {attr.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {attr.options.map(option => {
              const selected = selection[attr.slug] === option

              if (isColorSlug(attr.slug)) {
                const hex = COLORS_VALUES[option as keyof typeof COLORS_VALUES]
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${attr.name}: ${option}`}
                    onClick={() => onSelectOption(attr.slug, option)}
                    className={cn(
                      'relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-[transform,box-shadow] touch-manipulation focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-95',
                      selected
                        ? 'border-foreground ring-2 ring-foreground/15 ring-offset-2 ring-offset-background'
                        : 'border-border hover:border-foreground/40',
                    )}
                    style={hex ? { backgroundColor: hex } : undefined}
                  >
                    <span className="sr-only">{option}</span>
                    {!hex ? <span className="px-1 text-center text-[10px] font-medium leading-tight">{option}</span> : null}
                  </button>
                )
              }

              return (
                <Button
                  key={option}
                  type="button"
                  variant={selected ? 'default' : 'outline'}
                  size="sm"
                  aria-pressed={selected}
                  className="min-h-10 min-w-10 rounded-sm px-3.5 text-xs font-medium tracking-wide"
                  onClick={() => onSelectOption(attr.slug, option)}
                >
                  {option}
                </Button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export default RenderAttributes
