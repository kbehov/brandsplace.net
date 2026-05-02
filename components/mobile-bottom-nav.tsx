'use client'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Bell, Compass, Home, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const tabs: {
  href: string
  icon: LucideIcon
  label: string
  match: (p: string) => boolean
  badge?: boolean
}[] = [
  { href: '/', icon: Home, label: 'Начало', match: p => p === '/' },
  {
    href: '/brands',
    icon: Compass,
    label: 'Брандове',
    match: p => p === '/brands' || p.startsWith('/brands/'),
  },
  {
    href: '/notifications',
    icon: Bell,
    label: 'Известия',
    match: p => p.startsWith('/notifications'),
    badge: true,
  },
]

export default function MobileBottomNav() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()

  const hideOnAuth = pathname.startsWith('/auth')
  if (!isMobile || hideOnAuth) return null

  const profileHref = session ? '/account' : '/auth/login'
  const profileActive = pathname.startsWith('/account') || pathname.startsWith('/auth/login')
  const initial = session?.user?.name?.trim()?.charAt(0) ?? session?.user?.email?.charAt(0) ?? '?'

  return (
    <nav
      aria-label="Основна навигация"
      className="fixed inset-x-0 bottom-0 z-50 pb-[calc(env(safe-area-inset-bottom,0)+0.05rem)]"
    >
      <div className="border-t border-border/30 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-stretch px-2 pb-3 pt-2 sm:px-3">
          {tabs.map(({ href, icon: Icon, label, match, badge }) => (
            <NavTab key={href} href={href} icon={Icon} label={label} isActive={match(pathname)} badge={badge} />
          ))}

          <Link
            href={profileHref}
            className={cn(
              'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
              profileActive ? 'text-foreground' : 'text-muted-foreground',
            )}
            aria-current={profileActive ? 'page' : undefined}
          >
            <span className="relative flex size-9 items-center justify-center">
              {session ? (
                <Avatar className="size-7 border border-border/50">
                  <AvatarImage src={session.user.image ?? undefined} alt="" />
                  <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="size-[22px]" strokeWidth={1.5} aria-hidden />
              )}
            </span>
            <span className="max-w-full truncate text-[10px] font-medium leading-none tracking-wide">
              {session ? 'Профил' : 'Вход'}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

type NavTabProps = {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  badge?: boolean
}

function NavTab({ href, icon: Icon, label, isActive, badge }: NavTabProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
        isActive ? 'text-foreground' : 'text-muted-foreground',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative flex size-9 items-center justify-center">
        <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
        {badge ? (
          <span
            className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-red-500 ring-2 ring-background"
            aria-hidden
          />
        ) : null}
      </span>
      <span className="max-w-full truncate text-[10px] font-medium leading-none tracking-wide">{label}</span>
    </Link>
  )
}
