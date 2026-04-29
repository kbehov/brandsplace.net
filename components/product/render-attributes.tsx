import { COLORS_VALUES } from '@/constants/colors'
import { cn } from '@/lib/utils'
import type { WooProductAttribute } from '@/types/product.types'
import { Button } from '../ui/button'
interface RenderAttributesProps {
  attributes: WooProductAttribute[]
  onSelect: (attribute: WooProductAttribute) => void
  selectedAttributes: string[]
}
const ColorAttribute = ({ attribute }: { attribute: WooProductAttribute }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attribute.options.map(option => (
        <div
          key={option}
          className={cn(
            `w-6 h-6 rounded-full border border-border bg-[${COLORS_VALUES[option as keyof typeof COLORS_VALUES]}]`,
            'hover:border-foreground/80',
          )}
        >
          <span className="sr-only">{option}</span>
        </div>
      ))}
    </div>
  )
}
const SizeAttribute = ({ attribute }: { attribute: WooProductAttribute }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attribute.options.map(option => (
        <Button key={option} variant="outline" size="sm" className="cursor-pointer">
          {option}
        </Button>
      ))}
    </div>
  )
}
const DefaultAttribute = ({ attribute }: { attribute: WooProductAttribute }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attribute.options.map(option => (
        <div key={option} className="text-xs font-medium">
          {option}
        </div>
      ))}
    </div>
  )
}

const RenderAttributes = ({ attributes, onSelect }: RenderAttributesProps) => {
  return (
    <div>
      {attributes.map(attribute => (
        <div className="flex flex-col gap-2" key={attribute.slug}>
          <p className="text-xs font-medium capitalize">{attribute.name}</p>
          {attribute.slug === 'pa_color' ? (
            <ColorAttribute attribute={attribute} />
          ) : attribute.slug === 'pa_size' ? (
            <SizeAttribute attribute={attribute} />
          ) : (
            <DefaultAttribute attribute={attribute} />
          )}
        </div>
      ))}
    </div>
  )
}

export default RenderAttributes
