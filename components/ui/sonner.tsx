'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      offset="4.5rem"
      toastOptions={{
        classNames: {
          toast:
            'font-sans border border-border/60 bg-background/95 text-foreground shadow-lg backdrop-blur-md',
        },
      }}
    />
  )
}
