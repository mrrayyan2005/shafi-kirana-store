const TOKEN_KEY = 'shafi_token_v1'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // ── Auth ──────────────────────────────────────────────
  async register(payload) {
    const data = await request('/api/auth/register', { method: 'POST', body: payload, auth: false })
    if (data.token) setToken(data.token)
    return data
  },
  async login(payload) {
    const data = await request('/api/auth/login', { method: 'POST', body: payload, auth: false })
    if (data.token) setToken(data.token)
    return data
  },
  async me() {
    return request('/api/auth/me')
  },
  logout() {
    setToken('')
  },

  // ── Products ──────────────────────────────────────────
  listProducts() {
    return request('/api/products', { auth: false })
  },
  createProduct(payload) {
    return request('/api/products', { method: 'POST', body: payload })
  },
  updateProduct(id, payload) {
    return request('/api/products', { method: 'PUT', body: { id, ...payload } })
  },
  deleteProduct(id) {
    return request('/api/products', { method: 'DELETE', body: { id } })
  },
  importProducts(rows, mode = 'merge') {
    return request('/api/products?import=1', { method: 'POST', body: { rows, mode } })
  },

  // ── Orders ────────────────────────────────────────────
  listOrders() {
    return request('/api/orders')
  },
  saveOrder(payload) {
    return request('/api/orders', { method: 'POST', body: payload })
  },

  // ── Cart (synced to MongoDB when logged in) ───────────
  getCart() {
    return request('/api/cart')
  },
  saveCart(payload) {
    return request('/api/cart', { method: 'PUT', body: payload })
  },
}
