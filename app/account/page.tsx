import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профил',
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Профил</h1>
      <p className="mt-2 text-sm text-muted-foreground">Тук скоро ще намерите поръчки, адреси и настройки на акаунта.</p>
    </div>
  )
}
