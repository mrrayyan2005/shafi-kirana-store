import { getCollection } from './lib/db.js'
import { requireAuth, getTokenFromReq, verifyToken } from './lib/auth.js'
import { ok, fail, readJsonBody } from './lib/http.js'

/**
 * GET  /api/orders        → owner: all · customer: own last 10
 * POST /api/orders        → save an order (after WhatsApp send)
 */
export default async function handler(req, res) {
  try {
    const col = await getCollection('orders')

    if (req.method === 'POST') {
      // Guests can save orders too (WhatsApp still works without login)
      let username = 'guest'
      try {
        const token = getTokenFromReq(req)
        if (token) username = verifyToken(token).username || 'guest'
      } catch {
        username = 'guest'
      }
      const body = await readJsonBody(req)
      const record = {
        username,
        orderType: String(body.orderType || 'catalogue'),
        items: Array.isArray(body.items) ? body.items : [],
        notes: String(body.notes || ''),
        customer: body.customer || {},
        status: 'sent',
        createdAt: new Date(),
      }
      const result = await col.insertOne(record)
      return ok(res, {
        order: {
          id: result.insertedId.toString(),
          ...record,
          createdAt: record.createdAt.toISOString(),
        },
      })
    }

    if (req.method === 'GET') {
      const tokenUser = requireAuth(req, res)
      if (!tokenUser) return

      const isOwner = tokenUser.role === 'owner'
      const filter = isOwner ? {} : { username: tokenUser.username }
      const orders = await col
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(isOwner ? 100 : 10)
        .toArray()

      return ok(res, {
        orders: orders.map((o) => ({
          id: o._id.toString(),
          username: o.username,
          orderType: o.orderType,
          items: o.items,
          notes: o.notes,
          customer: o.customer,
          status: o.status,
          createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
        })),
      })
    }

    return fail(res, 405, 'Method not allowed.')
  } catch (err) {
    console.error('orders API', err)
    return fail(res, 500, err?.message || 'Server error')
  }
}
