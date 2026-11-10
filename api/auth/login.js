import bcrypt from 'bcryptjs'
import { getCollection } from '../lib/db.js'
import { signToken } from '../lib/auth.js'
import { ok, fail, readJsonBody } from '../lib/http.js'

/** POST /api/auth/login { username, password } */
export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed.')
  try {
    const body = await readJsonBody(req)
    const username = String(body.username || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!username || !password) return fail(res, 400, 'Username and password are required.')

    const users = await getCollection('users')
    const user = await users.findOne({ username })
    if (!user) return fail(res, 401, 'No account found with this username.')

    const match = await bcrypt.compare(password, user.passwordHash || '')
    if (!match) return fail(res, 401, 'Incorrect password. Try again.')

    const token = signToken(user)
    return ok(res, {
      token,
      user: {
        username: user.username,
        name: user.name || user.username,
        mobile: user.mobile || '',
        role: user.role || 'customer',
      },
    })
  } catch (err) {
    console.error('login', err)
    return fail(res, 500, err?.message || 'Server error')
  }
}
