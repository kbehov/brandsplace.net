/**
 * Shared promo links for main catalog navigation (desktop + mobile).
 */
export const PROMO_CATALOG_LINKS: {
  href: string
  label: string
  className?: string
  badge?: string
}[] = [
  { href: '/new-in', label: 'Ново' },
  {
    href: '/sale',
    label: 'Разпродажба',
    className: 'font-semibold text-foreground/90',
    badge: '−40%',
  },
]
