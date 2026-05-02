'use client'
import { cn } from '@/lib/utils'
import type { WooImage } from '@/types/product.types'
import Image from 'next/image'
import { useState } from 'react'

const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'

const ProductCardImage = ({ image, productName }: { image: WooImage; productName: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative h-full w-full bg-muted overflow-hidden">
      {/* Shimmer skeleton — visible until image loads */}
      {!imageLoaded && (
        <div className="absolute inset-0 z-10 bg-muted">
          <div className="absolute inset-0 -translate-x-full animate-pulse bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
      {image?.src && (
        <Image
          src={image.src}
          alt={image.alt ?? productName}
          fill
          sizes={image.sizes ?? DEFAULT_IMAGE_SIZES}
          onLoad={() => setImageLoaded(true)}
          className={cn('object-cover transition-all duration-500', {
            'opacity-100 scale-100': imageLoaded,
            'opacity-0 scale-95': !imageLoaded,
          })}
        />
      )}
    </div>
  )
}

export default ProductCardImage
