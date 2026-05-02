'use client'
import { useEffect, useMemo, useState } from 'react'

const formatPriceEUR = (value: number) => `${Number(value || 0).toFixed(2)} €`

type ProductCardSaleTriggersProps = {
  discountPercentage: number
  discountAmount: number
  totalSales: number
  ratingCount: number
  averageRating: number
  stockQty: number
}

const ProductCardSaleTriggers = ({
  discountPercentage,
  discountAmount,
  totalSales,
  ratingCount,
  averageRating,
  stockQty,
}: ProductCardSaleTriggersProps) => {
  // Stable random values — lazy init runs once per mount (not on every render)
  const [randoms] = useState(() => ({
    inCarts: Math.floor(Math.random() * 50) + 1,
    viewing: Math.floor(Math.random() * 50) + 1,
    likes: Math.floor(Math.random() * 50) + 1,
    startIndex: Math.floor(Math.random() * 10),
    interval: 2500 + Math.floor(Math.random() * 1000),
  }))

  const messages = useMemo(() => {
    // const { inCarts, viewing, likes } = randoms
    const texts: { text: string }[] = []

    if (discountPercentage > 0) texts.push({ text: `💰 Спестявате ${formatPriceEUR(discountAmount)}` })

    if (totalSales > 0) texts.push({ text: `🛒 ${totalSales} ${totalSales === 1 ? 'продажба' : 'продажби'}` })

    if (ratingCount > 0 && averageRating > 0)
      texts.push({
        text: `⭐ ${averageRating.toFixed(1)} от ${ratingCount} ${ratingCount === 1 ? 'оценка' : 'оценки'}`,
      })

    if (stockQty !== null && stockQty <= 5) texts.push({ text: `🔥 Последни ${stockQty} бр.` })

    if (totalSales > 50) texts.push({ text: `😍 #BestSeller` })

    if (discountPercentage > 30) texts.push({ text: `⚡ Супер цена сега` })

    // texts.push(
    //   { text: `🛍️ В ${inCarts} колички в момента` },
    //   { text: `👀 ${viewing} човека разглеждат` },
    //   { text: `❤️ ${likes} харесвания` },
    // )

    return texts
  }, [discountPercentage, discountAmount, totalSales, ratingCount, averageRating, stockQty])

  const [currentIndex, setCurrentIndex] = useState(() =>
    messages.length > 0 ? randoms.startIndex % messages.length : 0,
  )

  useEffect(() => {
    if (messages.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length)
    }, randoms.interval)
    return () => clearInterval(interval)
  }, [messages.length, randoms.interval])

  if (messages.length === 0) return null

  const displayIndex = currentIndex % messages.length
  const currentMessage = messages[displayIndex]

  return (
    <span
      key={displayIndex}
      className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-xs text-muted-foreground"
    >
      {currentMessage.text}
    </span>
  )
}

export default ProductCardSaleTriggers
