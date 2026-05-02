import { CreditCard, PackageCheck, RotateCcw } from 'lucide-react'
import { Badge } from '../ui/badge'
const ProductTrustIndicators = () => {
  return (
    <div className="flex flex-wrap items-center gap-2  text-muted-foreground">
      <Badge variant="outline">
        <CreditCard strokeWidth={1.5} className="size-3.5 shrink-0 text-foreground/70" aria-hidden />
        Наложен платеж
      </Badge>
      <Badge variant="outline">
        <PackageCheck strokeWidth={1.5} className="size-3.5 shrink-0 text-foreground/70" aria-hidden />
        Тест и преглед
      </Badge>
      <Badge variant="outline">
        <RotateCcw strokeWidth={1.5} className="size-3.5 shrink-0 text-foreground/70" aria-hidden />
        14 дни за връщане
      </Badge>
    </div>
  )
}

export default ProductTrustIndicators
