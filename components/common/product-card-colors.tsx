import { COLORS_VALUES } from '@/constants/colors'
import { cn } from '@/lib/utils'

const MAX_VISIBLE = 4

const ProductCardColors = ({ colors }: { colors: string[] }) => {
  const visibleColors = colors.slice(0, MAX_VISIBLE)
  const remainingCount = colors.length - MAX_VISIBLE

  if (colors.length <= 1) return null

  return (
    <div className="flex flex-col items-center gap-1  text-muted-foreground">
      {visibleColors.map(color => (
        <div
          key={color}
          className={cn('w-4 h-4 rounded-full border border-border', 'hover:border-foreground/80')}
          style={{ backgroundColor: COLORS_VALUES[color as keyof typeof COLORS_VALUES] }}
        >
          <span className="sr-only">{color}</span>
        </div>
      ))}
      {remainingCount > 0 && <span className="text-xs text-white">+{remainingCount}</span>}
    </div>
  )
}

export default ProductCardColors
