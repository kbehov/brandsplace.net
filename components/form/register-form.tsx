'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { signUpSchema, type SignUpSchema } from '@/zod/auth'
import { toast } from 'sonner'

const accent = 'text-orange-500 hover:text-orange-600'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.17 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.65 4.08M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
    </svg>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [socialPending, setSocialPending] = React.useState<string | null>(null)

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: SignUpSchema) {
    setPending(true)
    form.clearErrors('root')
    const callbackURL = `${window.location.origin}/`
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL,
    })
    setPending(false)
    if (error) {
      form.setError('root', { message: error.message || 'Регистрацията не бе успешна.' })
      return
    }
    router.push('/')
    router.refresh()
  }

  async function signInSocial(provider: 'google' | 'apple') {
    setSocialPending(provider)
    const callbackURL = `${window.location.origin}/`
    const { error } = await authClient.signIn.social({ provider, callbackURL })
    setSocialPending(null)
    if (error) {
      toast.error(error.message || 'Неуспешен вход с профил.')
    }
  }

  const inputShell =
    'h-12 rounded-full border-border pr-4 pl-11 text-[#0c1222] placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-0'

  return (
    <div className="mx-auto flex w-full max-w-[min(100%,380px)] flex-col items-center px-1">
      <div
        className="mb-6 flex size-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white"
        aria-hidden
      >
        B
      </div>
      <h1 className="mb-1 text-center text-2xl font-semibold tracking-tight sm:text-3xl">Регистрация</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">Попълнете данните си, за да създадете акаунт.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Име</FormLabel>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Име и фамилия"
                      className={inputShell}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Имейл</FormLabel>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="mail@brandsplace.net"
                      className={inputShell}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Парола</FormLabel>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={`${inputShell} pr-12`}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Скрий паролата' : 'Покажи паролата'}
                  >
                    {showPassword ? <Eye className="size-[18px]" /> : <EyeOff className="size-[18px]" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-black text-base font-medium text-white hover:bg-black/90">
            {pending ? 'Създаване…' : 'Създай акаунт'}
          </Button>
        </form>
      </Form>

      <div className="mt-8 flex w-full items-center gap-3">
        <Separator className="shrink bg-border" />
        <span className="shrink-0 text-xs text-muted-foreground">или продължете с</span>
        <Separator className="shrink bg-border" />
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!!socialPending}
          className="h-12 rounded-full border-border bg-background font-normal hover:bg-muted/60"
          onClick={() => void signInSocial('google')}
        >
          <GoogleIcon className="size-5 shrink-0" />
          {socialPending === 'google' ? '…' : 'Google'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!!socialPending}
          className="h-12 rounded-full border-border bg-background font-normal hover:bg-muted/60"
          onClick={() => void signInSocial('apple')}
        >
          <AppleIcon className="size-5 shrink-0" />
          {socialPending === 'apple' ? '…' : 'Apple'}
        </Button>
      </div>

      <p className="mt-10 text-center text-sm">
        Вече имате профил?{' '}
        <Link href="/auth/login" className={`font-medium ${accent}`}>
          Вход
        </Link>
      </p>

      <div className="mt-10 h-1.5 w-28 rounded-full bg-foreground/90 sm:hidden" aria-hidden />
    </div>
  )
}
