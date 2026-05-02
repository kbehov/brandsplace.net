import { useEffect, useState } from 'react'

export function useIsMobile(mobileBreakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    mql.addEventListener('change', onChange)
    setTimeout(() => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }, 0)
    return () => mql.removeEventListener('change', onChange)
  }, [mobileBreakpoint])

  return !!isMobile
}
