import { getCollection } from './lib/db.js'
import { requireAuth } from './lib/auth.js'
import { ok, fail, readJsonBody } from './lib/http.js'

/**
 * GET  /api/cart  → current user's cart
 * PUT  /api/cart  → replace cart { items, message }
 * Cart follows the logged-in user across devices (MongoDB).
 */
export default async function handler(req, res) {
  try {
    const payload = requireAuth(req, res)
    if (!payload) return

    const col = await getCollection('carts')
    const username = payload.username

    if (req.method === 'GET') {
      const doc = await col.findOne({ username })
      return ok(res, {
        cart: {
          items: Array.isArray(doc?.items) ? doc.items : [],
          message: String(doc?.message || ''),
          updatedAt: doc?.updatedAt || null,
        },
      })
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await readJsonBody(req)
      const items = Array.isArray(body.items)
        ? body.items.map((i) => ({
            key: String(i.key || `${i.id}|${i.qty || ''}`),
            id: String(i.id || ''),
            name: String(i.name || ''),
            qty: String(i.qty || ''),
            units: Math.max(1, Number(i.units) || 1),
            category: String(i.category || 'other-grocery'),
          }))
        : []
      const message = String(body.message || '')

      await col.updateOne(
        { username },
        {
          $set: {
            username,
            items,
            message,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      )
      return ok(res, { cart: { items, message } })
    }

    return fail(res, 405, 'Method not allowed.')
  } catch (err) {
    console.error('cart API', err)
    return fail(res, 500, err?.message || 'Server error')
  }
}
