import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [ready, setReady] = useState(false)

  // Restore session from JWT on first load
  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (!getToken()) {
        if (!cancelled) setReady(true)
        return
      }
      try {
        const data = await api.me()
        if (!cancelled) {
          setUser(data.user)
          setReady(true)
        }
      } catch {
        api.logout()
        if (!cancelled) {
          setUser(null)
          setReady(true)
        }
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  // Load orders when logged in
  useEffect(() => {
    let cancelled = false
    if (!user) {
      setOrders([])
      return undefined
    }
    api
      .listOrders()
      .then((data) => {
        if (!cancelled) setOrders(data.orders || [])
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const login = useCallback(async (username, password) => {
    const data = await api.login({ username, password })
    setUser(data.user)
    return { ok: true }
  }, [])

  const register = useCallback(async (name, username, password, mobile) => {
    const data = await api.register({ name, username, password, mobile })
    setUser(data.user)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
    setOrders([])
  }, [])

  const saveOrder = useCallback(
    async (order) => {
      try {
        const data = await api.saveOrder(order)
        if (data?.order) setOrders((prev) => [data.order, ...prev].slice(0, 10))
        return data?.order
      } catch {
        // Orders still go to WhatsApp even if the server write fails
        return null
      }
    },
    []
  )

  const value = useMemo(
    () => ({
      user,
      username: user?.username || '',
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === 'owner',
      orders: orders.slice(0, 10),
      ready,
      login,
      register,
      logout,
      saveOrder,
    }),
    [user, orders, ready, login, register, logout, saveOrder]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
