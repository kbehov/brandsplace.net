import Header from '@/components/header/header'
import TopBar from '@/components/header/top-bar'
import { getParentCategories } from '@/services/categories.service'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['cyrillic'],
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
  console.log(parentCategories)

  return (
    <html lang="bg" className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <div className="sticky top-0 z-50">
          <TopBar />
          <Header categories={parentCategories.items} />
        </div>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
