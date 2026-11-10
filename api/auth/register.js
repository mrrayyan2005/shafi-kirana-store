import bcrypt from 'bcryptjs'
import { getCollection } from '../lib/db.js'
import { signToken } from '../lib/auth.js'
import { ok, fail, readJsonBody } from '../lib/http.js'

/** POST /api/auth/register { name, username, password, mobile } */
export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed.')
  try {
    const body = await readJsonBody(req)
    const username = String(body.username || '').trim().toLowerCase()
    const password = String(body.password || '')
    const name = String(body.name || '').trim() || username
    const mobile = String(body.mobile || '').trim()

    if (!username || username.length < 3) return fail(res, 400, 'Username must be at least 3 characters.')
    if (!password || password.length < 6) return fail(res, 400, 'Password must be at least 6 characters.')
    if (!/^[a-z0-9._-]+$/.test(username)) return fail(res, 400, 'Username may use letters, numbers, . _ - only.')

    const users = await getCollection('users')
    const existing = await users.findOne({ username })
    if (existing) return fail(res, 409, 'This username is already taken.')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      username,
      name,
      mobile,
      passwordHash,
      role: 'customer',
      createdAt: new Date(),
    }
    const result = await users.insertOne(user)
    const token = signToken({ ...user, _id: result.insertedId })

    return ok(res, {
      token,
      user: {
        username,
        name,
        mobile,
        role: 'customer',
      },
    })
  } catch (err) {
    console.error('register', err)
    return fail(res, 500, err?.message || 'Server error')
  }
}
