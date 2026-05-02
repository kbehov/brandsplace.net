'use client'
import { authClient } from '@/lib/auth-client'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
export const UserProfile = ({ iconButtonClass }: { iconButtonClass: string }) => {
  const { data: session } = authClient.useSession()
  if (!session) {
    return (
      <Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Профил">
        <User className="size-5" strokeWidth={1.5} />
      </Button>
    )
  }
  return (
    <Button variant="ghost" size="icon" className={iconButtonClass} aria-label="Профил">
      <Avatar>
        <AvatarImage src={session.user.image ?? ''} />
        <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </Button>
  )
}
