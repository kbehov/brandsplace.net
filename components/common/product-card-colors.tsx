import { COLORS_VALUES } from '@/constants/colors'
import { cn } from '@/lib/utils'
const ProductCardColors = ({ colors }: { colors: string[] }) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
      {colors.map(color => (
        <div
          key={color}
          className={cn('w-4 h-4 rounded-full border border-border', 'hover:border-foreground/80')}
          style={{ backgroundColor: COLORS_VALUES[color as keyof typeof COLORS_VALUES] }}
        >
          <span className="sr-only">{color}</span>
        </div>
      ))}
    </div>
  )
}

export default ProductCardColors
