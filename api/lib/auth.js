import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me-in-vercel'

export function signToken(user) {
  return jwt.sign(
    {
      sub: user._id?.toString?.() || user.username,
      username: user.username,
      role: user.role || 'customer',
      name: user.name || user.username,
      mobile: user.mobile || '',
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

/** Reads Authorization: Bearer <token> → payload or null */
export function getTokenFromReq(req) {
  const header = req.headers?.authorization || req.headers?.Authorization || ''
  const raw = Array.isArray(header) ? header[0] : header
  if (!raw) return null
  const m = String(raw).match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : null
}

export function requireAuth(req, res) {
  const token = getTokenFromReq(req)
  if (!token) {
    res.status(401).json({ ok: false, error: 'Login required' })
    return null
  }
  try {
    return verifyToken(token)
  } catch {
    res.status(401).json({ ok: false, error: 'Session expired — login again' })
    return null
  }
}

export function requireOwner(req, res) {
  const payload = requireAuth(req, res)
  if (!payload) return null
  if (payload.role !== 'owner') {
    res.status(403).json({ ok: false, error: 'Store owner access only' })
    return null
  }
  return payload
}
