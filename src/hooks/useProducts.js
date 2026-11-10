import { useCallback, useEffect, useState } from 'react'
import { api } from '../utils/api'
import { SAMPLE_PRODUCTS_EXPORT } from '../utils/productStore'

let cache = null

/** Shared product catalogue — always from MongoDB so every customer sees the same list. */
export function useProducts() {
  const [products, setProducts] = useState(() => cache || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.listProducts()
      const list = data.products || []
      cache = list
      setProducts(list)
      return list
    } catch (err) {
      setError(err?.message || 'Could not load products')
      // Offline fallback so the shop is never blank for customers
      const fallback = cache || SAMPLE_PRODUCTS_EXPORT()
      setProducts(fallback)
      return fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, reload: load, setProducts }
}

export function invalidateProductCache() {
  cache = null
}
