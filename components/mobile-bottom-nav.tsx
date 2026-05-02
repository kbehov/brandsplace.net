'use client'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@/lib/utils'
import { Bell, Compass, Home, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', icon: Home, label: 'Начало' },
  { href: '/categories', icon: Compass, label: 'Пазаруване' },
  { href: '/notifications', icon: Bell, label: 'Известия', badge: true },
  { href: '/account', icon: User, label: 'Профил' },
]

const MobileBottomNav = () => {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  if (!isMobile) return null

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 z-50 w-full border-t border-border/20 bg-background/90 backdrop-blur-xl"
    >
      <div className="flex h-16 items-end justify-around pb-2 px-2">
        {tabs.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return <NavTab key={href} href={href} icon={Icon} label={label} isActive={isActive} />
        })}

        {tabs.slice(2).map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href
          return <NavTab key={href} href={href} icon={Icon} label={label} isActive={isActive} badge={badge} />
        })}
      </div>

      {/* Home indicator spacer for iOS */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}

type NavTabProps = {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
  badge?: boolean
}

const NavTab = ({ href, icon: Icon, label, isActive, badge }: NavTabProps) => (
  <Link
    href={href}
    className={cn(
      'relative flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors',
      isActive ? 'text-violet-600' : 'text-muted-foreground hover:text-foreground',
    )}
    aria-current={isActive ? 'page' : undefined}
  >
    <div className="relative">
      <Icon className="size-[22px]" strokeWidth={isActive ? 2 : 1.5} />
      {badge && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />}
    </div>
    <span className={cn('text-[10px] tracking-wide', isActive && 'font-medium')}>{label}</span>
    {isActive && <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-600" />}
  </Link>
)

export default MobileBottomNav
