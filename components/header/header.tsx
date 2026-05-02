import { storeConfig } from '@/config/store.config'
import type { WooCategory } from '@/types/product.types'
import type { SearchTrendingCategory } from '@/types/search.types'
import Link from 'next/link'
import Cart from './cart'
import DesktopNav from './desktop-nav'
import MobileNav from './mobile-nav'
import SearchBar from './search-bar'
import { UserProfile } from './user-profile'
import Wishlist from './wishlist'
type HeaderProps = {
  categories: WooCategory[]
  trendingCategories: SearchTrendingCategory[]
}

const iconButtonClass =
  'size-9 shrink-0 rounded-full text-foreground/80 transition-colors hover:bg-foreground/[0.04] hover:text-foreground dark:hover:bg-foreground/[0.06]'

const Header = ({ categories, trendingCategories }: HeaderProps) => {
  return (
    <header className="w-full border-b border-border/25 bg-background/80 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-border/20 dark:bg-background/88 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-3 gap-y-3 py-3 sm:gap-x-4 md:h-16 md:grid-cols-[auto_minmax(0,1fr)_auto] md:grid-rows-1 md:items-center md:gap-x-8 md:py-0 lg:h-17">
          <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2.5 sm:gap-3 md:col-start-1 md:row-start-1">
            <MobileNav categories={categories} className="md:hidden" />
            <Link
              href="/"
              className="shrink-0 font-heading text-[0.9375rem] font-semibold tracking-[0.18em] text-foreground no-underline uppercase transition-opacity hover:opacity-75 sm:text-base"
            >
              {storeConfig.STORE_NAME}
            </Link>
          </div>

          <div className="col-start-2 row-start-1 flex shrink-0 items-center gap-0.5 sm:gap-1 md:col-start-3 md:row-start-1">
            <div className="hidden md:block">
              <UserProfile iconButtonClass={iconButtonClass} />
            </div>
            <Wishlist />
            <Cart />
          </div>

          <SearchBar
            trendingCategories={trendingCategories}
            className="col-span-2 row-start-2 min-w-0 w-full md:col-span-1 md:col-start-2 md:row-start-1 md:max-w-xl md:justify-self-stretch lg:max-w-2xl"
          />
        </div>
      </div>
      <DesktopNav categories={categories} />
    </header>
  )
}

export default Header
