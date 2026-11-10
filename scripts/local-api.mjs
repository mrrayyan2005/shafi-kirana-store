/**
 * Local API server — same handlers as Vercel `/api/*`.
 * Run:  npm run api
 * Vite dev should proxy /api → http://localhost:8787
 */
import http from 'node:http'
import { parse as parseUrl } from 'node:url'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const PORT = Number(process.env.API_PORT || 8787)

// Load env from .env.local if present
try {
  const fs = await import('node:fs')
  const envPath = path.join(root, '.env.local')
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
    console.log('Loaded .env.local')
  }
} catch {
  /* ignore */
}

const routes = {
  '/api/products': path.join(root, 'api/products.js'),
  '/api/cart': path.join(root, 'api/cart.js'),
  '/api/orders': path.join(root, 'api/orders.js'),
  '/api/auth/register': path.join(root, 'api/auth/register.js'),
  '/api/auth/login': path.join(root, 'api/auth/login.js'),
  '/api/auth/me': path.join(root, 'api/auth/me.js'),
}

const server = http.createServer(async (req, res) => {
  const url = parseUrl(req.url, true)
  const pathname = url.pathname.replace(/\/$/, '') || '/'

  // CORS for Vite on :5173
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const file = routes[pathname]
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: false, error: 'Not found' }))
    return
  }

  try {
    // Parse JSON body into req.body (same as Vercel)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      req.body = await new Promise((resolve, reject) => {
        let raw = ''
        req.on('data', (c) => {
          raw += c
        })
        req.on('end', () => {
          if (!raw) return resolve({})
          try {
            resolve(JSON.parse(raw))
          } catch (e) {
            reject(e)
          }
        })
        req.on('error', reject)
      })
    } else {
      req.body = {}
    }
    req.query = url.query || {}

    // Minimal res.status().json() used by our handlers
    res.status = (code) => {
      res.statusCode = code
      return res
    }
    res.json = (body) => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json')
      }
      res.end(JSON.stringify(body))
    }

    const mod = await import(pathToFileURL(file).href)
    const handler = mod.default
    await handler(req, res)
  } catch (err) {
    console.error('API error', err)
    if (!res.writableEnded) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: err?.message || 'Server error' }))
    }
  }
})

server.listen(PORT, () => {
  console.log(`Local API → http://localhost:${PORT}`)
  console.log(`Mongo URI set: ${Boolean(process.env.MONGODB_URI)}`)
})
