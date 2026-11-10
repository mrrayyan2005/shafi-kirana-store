/**
 * Import products from a CSV (Admin → Export CSV) into MongoDB.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/import-products.mjs path/to/products.csv
 *   MONGODB_URI="..." node scripts/import-products.mjs products.csv replace
 */
import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI
const fileArg = process.argv[2]
const mode = (process.argv[3] || 'merge').toLowerCase()

if (!uri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}
if (!fileArg) {
  console.error('Usage: node scripts/import-products.mjs <file.csv> [merge|replace]')
  process.exit(1)
}

const csv = fs.readFileSync(path.resolve(fileArg), 'utf8')
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true })
const rows = parsed.data

function cleanProduct(raw) {
  const name = String(raw.name || raw['Product Name'] || '').trim()
  if (!name) return null
  const typeRaw = String(raw.type || raw['Product Type'] || 'packaged').toLowerCase()
  let type = 'packaged'
  if (typeRaw.includes('both') || (typeRaw.includes('packaged') && typeRaw.includes('loose'))) type = 'both'
  else if (typeRaw.includes('loose')) type = 'loose'
  return {
    name,
    category: String(raw.category || raw.Category || 'other-grocery').trim(),
    type,
    unit: String(raw.unit || raw.Unit || (type === 'loose' ? 'kg' : 'pack')).trim(),
    variants: String(raw.variants || raw['Available Variants'] || '').trim(),
    image: String(raw.image || raw.Image || '').trim(),
    available: !['no', 'false', '0', 'unavailable', 'out of stock'].includes(
      String(raw.available ?? raw.Available ?? raw.Availability ?? 'yes').toLowerCase()
    ),
  }
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
})
await client.connect()
const col = client.db(process.env.MONGODB_DB || 'shafi_kirana').collection('products')

if (mode === 'replace') {
  const del = await col.deleteMany({})
  console.log(`Removed ${del.deletedCount} existing products`)
}

const summary = { added: 0, updated: 0, skipped: 0 }
for (let i = 0; i < rows.length; i++) {
  const item = cleanProduct(rows[i])
  if (!item) {
    summary.skipped += 1
    continue
  }
  const existing = await col.findOne({ nameLower: item.name.toLowerCase() })
  if (existing) {
    await col.updateOne(
      { _id: existing._id },
      { $set: { ...item, nameLower: item.name.toLowerCase(), updatedAt: new Date() } }
    )
    summary.updated += 1
  } else {
    await col.insertOne({ ...item, nameLower: item.name.toLowerCase(), createdAt: new Date() })
    summary.added += 1
  }
}

console.log(summary)
await client.close()
