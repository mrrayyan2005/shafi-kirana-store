/** Small helpers so every API handler answers JSON the same way. */

export function json(res, status, body) {
  res.status(status).json(body)
}

export function ok(res, data = {}) {
  json(res, 200, { ok: true, ...data })
}

export function fail(res, status, error) {
  json(res, status, { ok: false, error })
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  // Vercel / Node may already parse JSON; otherwise read the stream
  if (typeof req.on === 'function') {
    return await new Promise((resolve, reject) => {
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
  }
  return {}
}

export const PRODUCT_FIELDS = [
  'name',
  'category',
  'type',
  'unit',
  'variants',
  'image',
  'available',
]

export function cleanProduct(raw, { requireName = true } = {}) {
  const name = String(raw?.name || '').trim()
  if (requireName && !name) return null

  let category = String(raw?.category || 'other-grocery').trim()
  const known = [
    'atta-rice-dal',
    'oil-ghee',
    'spices-masala',
    'biscuits-snacks',
    'chocolates-confectionery',
    'beverages',
    'dairy-products',
    'personal-care',
    'household-cleaning',
    'other-grocery',
  ]
  if (!known.includes(category)) category = 'other-grocery'

  const typeRaw = String(raw?.type || 'packaged').toLowerCase()
  let type = 'packaged'
  if (typeRaw.includes('both') || (typeRaw.includes('packaged') && typeRaw.includes('loose'))) {
    type = 'both'
  } else if (typeRaw.includes('loose')) {
    type = 'loose'
  }

  return {
    name,
    category,
    type,
    unit: String(raw?.unit || (type === 'loose' ? 'kg' : 'pack')).trim(),
    variants: String(raw?.variants || '').trim(),
    image: String(raw?.image || '').trim(),
    available: raw?.available !== false && String(raw?.available ?? 'yes').toLowerCase() !== 'no',
  }
}
