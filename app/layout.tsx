import Header from '@/components/header/header'
import TopBar from '@/components/header/top-bar'
import { Toaster } from '@/components/ui/sonner'
import { getParentCategories } from '@/services/categories.service'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['cyrillic'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['cyrillic-ext'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['cyrillic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Brandsplace',
    template: '%s · Brandsplace',
  },
  description: 'Премиум брандова витрина за България. Открийте внимателно подбрана селекция.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const parentCategories = await getParentCategories()

  return (
    <html
      suppressHydrationWarning
      lang="bg"
      className={`${inter.className} ${inter.variable} ${geistMono.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="sticky top-0 z-50">
          <TopBar />
          <Header categories={parentCategories.items} />
        </div>
        <main className="mx-auto  flex-1 lg:container w-full px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
