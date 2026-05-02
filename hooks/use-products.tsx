'use client'
import { fetchProductsClient } from '@/lib/fetch-products-client'
import type { GetProductsParams } from '@/services/product.service'
import type { WooProductListItem } from '@/types/product.types'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseProductsProps = {
  initialProducts?: WooProductListItem[]
  initialPage?: number
  initialPerPage?: number
  initialTotal?: number
  initialTotalPages?: number
  params?: GetProductsParams
}

type ProductsState = {
  products: WooProductListItem[]
  total: number
  totalPages: number
  currentPage: number
}

function deriveTotalPages(initialTotalPages: number, initialTotal: number, perPage: number): number {
  if (initialTotalPages > 0) return initialTotalPages
  if (initialTotal > 0 && perPage > 0) return Math.max(1, Math.ceil(initialTotal / perPage))
  return initialTotal > 0 ? 1 : 0
}

export const useProducts = ({
  initialProducts = [],
  initialPage = 1,
  initialPerPage = 10,
  initialTotal = 0,
  initialTotalPages = 1,
  params,
}: UseProductsProps) => {
  const [state, setState] = useState<ProductsState>(() => ({
    products: initialProducts,
    total: initialTotal,
    totalPages: deriveTotalPages(initialTotalPages, initialTotal, initialPerPage),
    currentPage: initialPage,
  }))

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<GetProductsParams | undefined>(params)

  const filtersRef = useRef(filters)
  const stateRef = useRef(state)
  const isFetchingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Sync refs after render, not during — fixes React 19 warning
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const fetchProducts = useCallback(async (page: number, replace = false, query?: GetProductsParams) => {
    if (isFetchingRef.current) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    isFetchingRef.current = true
    setIsLoading(true)
    setError(null)

    const merged = { ...(query ?? filtersRef.current), page }

    try {
      const { items, total, totalPages } = await fetchProductsClient(merged)

      setState(prev => ({
        products: replace ? items : [...prev.products, ...items],
        total,
        totalPages: totalPages > 0 ? totalPages : prev.totalPages,
        currentPage: page,
      }))
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') return
      setError(err instanceof Error ? err : new Error('Failed to fetch products'))
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }, [])

  const loadMore = useCallback(() => {
    if (error) return
    const { currentPage, totalPages } = stateRef.current
    if (isFetchingRef.current || currentPage >= totalPages) return
    void fetchProducts(currentPage + 1)
  }, [fetchProducts, error])

  const applyFilters = useCallback(
    (newFilters: GetProductsParams) => {
      filtersRef.current = newFilters
      setFilters(newFilters)
      setState(prev => ({ ...prev, products: [], currentPage: 1 }))
      void fetchProducts(1, true, newFilters)
    },
    [fetchProducts],
  )

  const retry = useCallback(() => {
    if (!error) return
    setError(null)
    void fetchProducts(stateRef.current.currentPage, false)
  }, [fetchProducts, error])

  const clearError = useCallback(() => setError(null), [])

  const hasMore = state.totalPages > 0 && state.currentPage < state.totalPages

  return {
    products: state.products,
    isLoading,
    isError: error !== null,
    error,
    total: state.total,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    hasMore,
    filters,
    loadMore,
    applyFilters,
    retry,
    clearError,
  }
}
