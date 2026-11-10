import { getCollection } from './lib/db.js'
import { requireOwner } from './lib/auth.js'
import { ok, fail, readJsonBody, cleanProduct } from './lib/http.js'

/**
 * GET    /api/products              → all products (public)
 * POST   /api/products              → create (owner)
 * POST   /api/products?import=1     → bulk import { rows, mode } (owner)
 * PUT    /api/products              → update { id, ...fields } (owner)
 * DELETE /api/products              → delete { id } (owner)
 */
export default async function handler(req, res) {
  try {
    const col = await getCollection('products')

    if (req.method === 'GET') {
      const products = await col.find({}).sort({ name: 1 }).toArray()
      return ok(res, {
        products: products.map((p) => ({
          id: p._id.toString(),
          name: p.name,
          category: p.category,
          type: p.type,
          unit: p.unit,
          variants: p.variants,
          image: p.image,
          available: p.available !== false,
        })),
      })
    }

    if (req.method === 'POST') {
      const owner = requireOwner(req, res)
      if (!owner) return

      const body = await readJsonBody(req)
      const url = new URL(req.url, 'http://localhost')
      const isImport = url.searchParams.get('import') === '1'

      if (isImport) {
        const rows = Array.isArray(body.rows) ? body.rows : []
        const mode = body.mode === 'replace' ? 'replace' : 'merge'
        const summary = { added: 0, updated: 0, skipped: 0, errors: [] }

        if (rows.length === 0) return fail(res, 400, 'File has no rows.')

        if (mode === 'replace') {
          await col.deleteMany({})
        }

        const existing = await col.find({}).toArray()
        const byName = new Map(existing.map((p) => [p.name.toLowerCase(), p]))

        for (let i = 0; i < rows.length; i += 1) {
          const item = cleanProduct(rows[i])
          if (!item) {
            summary.skipped += 1
            if (summary.errors.length < 10) summary.errors.push(`Row ${i + 2}: missing product name.`)
            continue
          }
          const key = item.name.toLowerCase()
          const found = byName.get(key)
          if (found) {
            await col.updateOne({ _id: found._id }, { $set: item })
            summary.updated += 1
          } else {
            await col.insertOne(item)
            summary.added += 1
          }
        }
        return ok(res, { summary })
      }

      const item = cleanProduct(body)
      if (!item) return fail(res, 400, 'Product name is required.')
      const result = await col.insertOne(item)
      return ok(res, {
        product: {
          id: result.insertedId.toString(),
          ...item,
        },
      })
    }

    if (req.method === 'PUT') {
      const owner = requireOwner(req, res)
      if (!owner) return

      const body = await readJsonBody(req)
      const id = String(body.id || '')
      if (!id) return fail(res, 400, 'Product id is required.')

      const { ObjectId } = await import('mongodb')
      let _id
      try {
        _id = new ObjectId(id)
      } catch {
        return fail(res, 400, 'Invalid product id.')
      }

      const item = cleanProduct({ ...body, available: body.available })
      if (!item) return fail(res, 400, 'Product name is required.')

      await col.updateOne({ _id }, { $set: item })
      return ok(res, { product: { id, ...item } })
    }

    if (req.method === 'DELETE') {
      const owner = requireOwner(req, res)
      if (!owner) return

      const body = await readJsonBody(req)
      const id = String(body.id || '')
      if (!id) return fail(res, 400, 'Product id is required.')

      const { ObjectId } = await import('mongodb')
      let _id
      try {
        _id = new ObjectId(id)
      } catch {
        return fail(res, 400, 'Invalid product id.')
      }

      await col.deleteOne({ _id })
      return ok(res, {})
    }

    return fail(res, 405, 'Method not allowed.')
  } catch (err) {
    console.error('products API', err)
    return fail(res, 500, err?.message || 'Server error')
  }
}
