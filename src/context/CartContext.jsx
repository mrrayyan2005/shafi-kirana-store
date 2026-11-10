import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

function readCart() {
  try {
    const raw = localStorage.getItem('shafi_cart_v1')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function readMessage() {
  try {
    return localStorage.getItem('shafi_cart_msg_v1') || ''
  } catch {
    return ''
  }
}

function writeLocal(items, message) {
  try {
    localStorage.setItem('shafi_cart_v1', JSON.stringify(items))
    localStorage.setItem('shafi_cart_msg_v1', message)
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }) {
  const { isLoggedIn, ready } = useAuth()
  const [items, setItems] = useState(readCart)
  const [message, setMessage] = useState(readMessage)
  const skipNextSave = useRef(false)

  // Load MongoDB cart when a user logs in (replaces local cart)
  useEffect(() => {
    if (!ready || !isLoggedIn) return
    let cancelled = false
    api
      .getCart()
      .then((data) => {
        if (cancelled) return
        const cart = data?.cart
        if (cart && Array.isArray(cart.items)) {
          skipNextSave.current = true
          setItems(cart.items)
          setMessage(cart.message || '')
        }
      })
      .catch(() => {
        /* keep local cart if offline */
      })
    return () => {
      cancelled = true
    }
  }, [ready, isLoggedIn])

  // Keep local copy (guest / offline) and push to Mongo when logged in
  useEffect(() => {
    writeLocal(items, message)
    if (!isLoggedIn) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    const t = setTimeout(() => {
      api.saveCart({ items, message }).catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [items, message, isLoggedIn])

  const apiValue = useMemo(
    () => ({
      items,
      count: items.length,
      message,
      setMessage,
      add(product, qty) {
        setItems((prev) => {
          const key = product.id + '|' + qty
          const existing = prev.find((i) => i.key === key)
          if (existing) {
            return prev.map((i) =>
              i.key === key ? { ...i, units: i.units + 1 } : i
            )
          }
          return [
            ...prev,
            {
              key,
              id: product.id,
              name: product.name,
              qty,
              units: 1,
              category: product.category,
            },
          ]
        })
      },
      setUnits(key, units) {
        setItems((prev) =>
          units <= 0
            ? prev.filter((i) => i.key !== key)
            : prev.map((i) => (i.key === key ? { ...i, units } : i))
        )
      },
      setQty(key, qty) {
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, qty } : i))
        )
      },
      remove(key) {
        setItems((prev) => prev.filter((i) => i.key !== key))
      },
      clear() {
        setItems([])
        setMessage('')
      },
    }),
    [items, message]
  )

  return <CartContext.Provider value={apiValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
