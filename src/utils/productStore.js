import { CATEGORIES } from '../data/categories'

const STORAGE_KEY = 'shafi_products_v1'
const SEED_KEY = 'shafi_products_seeded_v1'

// Starter catalogue — used only on the very first visit.
// After that, the admin owns the list in the browser (survives refresh).
const SAMPLE_PRODUCTS = [
  { name: 'Basmati Rice', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '1, 5, 10, 25', available: true, image: '' },
  { name: 'Wheat Atta', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '1, 5, 10', available: true, image: '' },
  { name: 'Toor Dal', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '0.5, 1, 5', available: true, image: '' },
  { name: 'Chana Dal', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '0.5, 1, 5', available: true, image: '' },
  { name: 'Sugar', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '1, 5, 10', available: true, image: '' },
  { name: 'Mustard Oil', category: 'oil-ghee', type: 'packaged', unit: 'litre', variants: '500ml, 1 litre, 5 litre', available: true, image: '' },
  { name: 'Sunflower Oil', category: 'oil-ghee', type: 'packaged', unit: 'litre', variants: '1 litre, 5 litre', available: true, image: '' },
  { name: 'Ghee', category: 'oil-ghee', type: 'packaged', unit: 'kg', variants: '200g, 500g, 1kg', available: true, image: '' },
  { name: 'Turmeric Powder', category: 'spices-masala', type: 'loose', unit: 'g', variants: '100, 250, 500', available: true, image: '' },
  { name: 'Red Chilli Powder', category: 'spices-masala', type: 'loose', unit: 'g', variants: '100, 250, 500', available: true, image: '' },
  { name: 'Garam Masala', category: 'spices-masala', type: 'packaged', unit: 'g', variants: '50, 100, 200', available: true, image: '' },
  { name: 'Parle-G Biscuits', category: 'biscuits-snacks', type: 'packaged', unit: 'pack', variants: 'Small, Large, Family pack', available: true, image: '' },
  { name: 'Kurkure', category: 'biscuits-snacks', type: 'packaged', unit: 'pack', variants: 'Small, Large', available: true, image: '' },
  { name: 'Dairy Milk Chocolate', category: 'chocolates-confectionery', type: 'packaged', unit: 'pack', variants: 'Small, Medium, Large', available: true, image: '' },
  { name: 'Tea Leaves', category: 'beverages', type: 'packaged', unit: 'g', variants: '100, 250, 500, 1kg', available: true, image: '' },
  { name: 'Coffee Powder', category: 'beverages', type: 'packaged', unit: 'g', variants: '50, 100, 200', available: true, image: '' },
  { name: 'Toned Milk', category: 'dairy-products', type: 'packaged', unit: 'litre', variants: '500ml, 1 litre', available: true, image: '' },
  { name: 'Curd', category: 'dairy-products', type: 'packaged', unit: 'g', variants: '200, 400, 1kg', available: true, image: '' },
  { name: 'Bathing Soap', category: 'personal-care', type: 'packaged', unit: 'pack', variants: '1, 3, 6', available: true, image: '' },
  { name: 'Toothpaste', category: 'personal-care', type: 'packaged', unit: 'pack', variants: 'Small, Medium, Large', available: true, image: '' },
  { name: 'Surf Excel', category: 'household-cleaning', type: 'packaged', unit: 'packet', variants: '250g, 500g, 1kg', available: true, image: '' },
  { name: 'Dish Wash Bar', category: 'household-cleaning', type: 'packaged', unit: 'pack', variants: '1, 2, 3', available: true, image: '' },
  { name: 'Salt', category: 'other-grocery', type: 'loose', unit: 'kg', variants: '1, 5', available: true, image: '' },
  { name: 'Poha', category: 'other-grocery', type: 'loose', unit: 'kg', variants: '0.5, 1, 2', available: true, image: '' },
]

/** Offline / first-paint sample list (same data Mongo is seeded with). */
export function SAMPLE_PRODUCTS_EXPORT() {
  return SAMPLE_PRODUCTS.map((p, i) => normalise(p, i))
}

function makeId() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

function normalise(raw, index = 0) {
  const name = String(raw.name || raw['Product Name'] || '').trim()
  if (!name) return null

  let category = String(raw.category || raw.Category || 'other-grocery').trim()
  // Accept friendly names too
  const byName = CATEGORIES.find(
    (c) => c.id === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase()
  )
  if (byName) category = byName.id
  else if (!CATEGORIES.some((c) => c.id === category)) category = 'other-grocery'

  const typeRaw = String(raw.type || raw['Product Type'] || 'packaged').toLowerCase()
  let type = 'packaged'
  if (typeRaw.includes('both') || (typeRaw.includes('packaged') && typeRaw.includes('loose'))) type = 'both'
  else if (typeRaw.includes('loose')) type = 'loose'
  else if (typeRaw.includes('packaged')) type = 'packaged'

  const unit = String(raw.unit || raw.Unit || (type === 'loose' ? 'kg' : 'pack')).trim()
  const variants = String(raw.variants || raw['Available Variants'] || '').trim()
  const image = String(raw.image || raw.Image || '').trim()

  const availRaw = String(raw.available ?? raw.Available ?? raw.Availability ?? 'yes').toLowerCase()
  const available = !['no', 'false', '0', 'unavailable', 'out of stock'].includes(availRaw)

  return {
    id: raw.id || makeId() + '_' + index,
    name,
    category,
    type,
    unit,
    variants,
    image,
    available,
  }
}

export function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.warn('Could not read saved products', e)
  }

  // First visit: seed with sample data so the shop is not empty
  if (!localStorage.getItem(SEED_KEY)) {
    const seeded = SAMPLE_PRODUCTS.map((p, i) => normalise(p, i))
    saveProducts(seeded)
    localStorage.setItem(SEED_KEY, '1')
    return seeded
  }
  return []
}

export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    return true
  } catch (e) {
    console.error('Could not save products', e)
    return false
  }
}

export function addProduct(product) {
  const list = loadProducts()
  const item = normalise({ ...product, id: makeId() })
  if (!item) return { ok: false, error: 'Product name is required.' }
  list.push(item)
  saveProducts(list)
  return { ok: true, product: item }
}

export function updateProduct(id, changes) {
  const list = loadProducts()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return { ok: false, error: 'Product not found.' }
  const updated = normalise({ ...list[idx], ...changes, id })
  if (!updated) return { ok: false, error: 'Product name is required.' }
  list[idx] = updated
  saveProducts(list)
  return { ok: true, product: updated }
}

export function deleteProduct(id) {
  const list = loadProducts().filter((p) => p.id !== id)
  saveProducts(list)
  return { ok: true }
}

export function toggleAvailable(id) {
  const list = loadProducts()
  const item = list.find((p) => p.id === id)
  if (!item) return { ok: false }
  item.available = !item.available
  saveProducts(list)
  return { ok: true, product: item }
}

/**
 * Import rows (already parsed from CSV/Excel).
 * mode: 'merge' (add new + update by name) or 'replace'
 */
export function importProducts(rows, mode = 'merge') {
  const summary = { added: 0, updated: 0, skipped: 0, errors: [] }

  if (!Array.isArray(rows) || rows.length === 0) {
    summary.errors.push('File has no rows.')
    return summary
  }

  let list = mode === 'replace' ? [] : loadProducts()
  const byName = new Map(list.map((p) => [p.name.toLowerCase(), p]))

  rows.forEach((row, i) => {
    const item = normalise(row, i)
    if (!item) {
      summary.skipped += 1
      if (summary.errors.length < 10) {
        summary.errors.push(`Row ${i + 2}: missing product name.`)
      }
      return
    }
    const key = item.name.toLowerCase()
    const existing = byName.get(key)
    if (existing) {
      // Update existing, keep its id
      Object.assign(existing, {
        category: item.category,
        type: item.type,
        unit: item.unit,
        variants: item.variants,
        image: item.image || existing.image,
        available: item.available,
      })
      summary.updated += 1
    } else {
      item.id = makeId()
      list.push(item)
      byName.set(key, item)
      summary.added += 1
    }
  })

  saveProducts(list)
  return summary
}

export function exportProductsCSV() {
  const list = loadProducts()
  const header = 'Product Name,Category,Product Type,Unit,Available Variants,Image,Availability'
  const escape = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = list.map((p) =>
    [
      escape(p.name),
      escape(p.category),
      escape(p.type),
      escape(p.unit),
      escape(p.variants),
      escape(p.image),
      p.available ? 'Yes' : 'No',
    ].join(',')
  )
  return [header, ...lines].join('\n')
}

export function downloadTextFile(filename, text, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Quick text list of categories, used in CSV templates */
export function categoriesForCSV() {
  return CATEGORIES.map((c) => `${c.id} (${c.name})`).join(' | ')
}
