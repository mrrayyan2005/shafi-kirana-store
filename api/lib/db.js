import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = process.env.MONGODB_URI
if (!uri) console.warn('MONGODB_URI not set')
let clientPromise
export async function getDb() {
  if (!uri) { const e = new Error('MONGODB_URI missing'); e.status = 500; throw e }
  if (!clientPromise) {
    const c = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      tls: true,
      tlsAllowInvalidCertificates: true,
    })
    clientPromise = c.connect()
  }
  const cl = await clientPromise
  return cl.db(process.env.MONGODB_DB || 'shafi_kirana')
}
export async function getCollection(name) {
  const db = await getDb()
  return db.collection(name)
}
