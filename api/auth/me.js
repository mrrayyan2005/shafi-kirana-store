import { requireAuth } from '../lib/auth.js'
import { ok, fail } from '../lib/http.js'

/** GET /api/auth/me — validate JWT and return current user */
export default async function handler(req, res) {
  if (req.method !== 'GET') return fail(res, 405, 'Method not allowed.')
  const payload = requireAuth(req, res)
  if (!payload) return
  return ok(res, {
    user: {
      username: payload.username,
      name: payload.name,
      mobile: payload.mobile || '',
      role: payload.role,
    },
  })
}
