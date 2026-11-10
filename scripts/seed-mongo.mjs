/**
 * Seed MongoDB Atlas with sample products + store owner account.
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed-mongo.mjs
 *
 * Optional:
 *   OWNER_USER=shaban.idrishi
 *   OWNER_PASS=change-me
 *   SEED_OWNER=1
 */
import { MongoClient, ServerApiVersion } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Set MONGODB_URI first')
  process.exit(1)
}

const SAMPLE_PRODUCTS = [
  { name: 'Basmati Rice', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '1, 5, 10, 25', available: true, image: '' },
  { name: 'Wheat Atta', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '1, 5, 10', available: true, image: '' },
  { name: 'Toor Dal', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '0.5, 1, 5', available: true, image: '' },
  { name: 'Chana Dal', category: 'atta-rice-dal', type: 'loose', unit: 'kg', variants: '0.5, 1, 5', available: true, image: '' },
  { name: 'Sugar', category: 'atta-rice-dal', type: 'both', unit: 'kg', variants: '1, 5, 10', available: true, image: '' },
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
  { name: 'Coffee Powder', category: 'beverages', type: 'packaged', unit: 'g', variants: '100, 250, 500', available: true, image: '' },
  { name: 'Toned Milk', category: 'dairy-products', type: 'packaged', unit: 'litre', variants: '500ml, 1 litre', available: true, image: '' },
  { name: 'Curd', category: 'dairy-products', type: 'packaged', unit: 'g', variants: '200, 400, 1kg', available: true, image: '' },
  { name: 'Bathing Soap', category: 'personal-care', type: 'packaged', unit: 'pack', variants: '1, 3, 6', available: true, image: '' },
  { name: 'Toothpaste', category: 'personal-care', type: 'packaged', unit: 'pack', variants: 'Small, Medium, Large', available: true, image: '' },
  { name: 'Surf Excel', category: 'household-cleaning', type: 'packaged', unit: 'packet', variants: '250g, 500g, 1kg', available: true, image: '' },
  { name: 'Dish Wash Bar', category: 'household-cleaning', type: 'packaged', unit: 'pack', variants: '1, 2, 3', available: true, image: '' },
  { name: 'Salt', category: 'other-grocery', type: 'loose', unit: 'kg', variants: '1, 5', available: true, image: '' },
  { name: 'Poha', category: 'other-grocery', type: 'loose', unit: 'kg', variants: '0.5, 1, 2', available: true, image: '' },
]

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
})

await client.connect()
const db = client.db(process.env.MONGODB_DB || 'shafi_kirana')
const products = db.collection('products')

const existingCount = await products.countDocuments()
if (existingCount === 0) {
  const docs = SAMPLE_PRODUCTS.map((p) => ({
    ...p,
    nameLower: p.name.toLowerCase(),
    createdAt: new Date(),
  }))
  await products.insertMany(docs)
  console.log(`Inserted ${docs.length} products`)
} else {
  console.log(`Products already exist (${existingCount}) — skipping seed`)
}

if (process.env.SEED_OWNER === '1') {
  const users = db.collection('users')
  const username = (process.env.OWNER_USER || 'shaban.idrishi').toLowerCase()
  const password = process.env.OWNER_PASS || 'shaban.idrishi'
  const passwordHash = await bcrypt.hash(password, 10)
  await users.updateOne(
    { username },
    {
      $set: {
        username,
        name: 'Store Owner',
        mobile: '',
        passwordHash,
        role: 'owner',
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )
  console.log(`Owner user ready: ${username} / ${password}`)
  console.log('CHANGE OWNER_PASS after first login!')
}

await client.close()
console.log('Done')
