# MongoDB Atlas setup — Shafi Kirana Store

This site uses a **real MongoDB Atlas database** so the shop owner’s product list is shared with every customer.

## What lives in Mongo

| Collection | What |
|---|---|
| `products` | Full product catalogue (add / edit / delete / CSV import) |
| `users` | Customer accounts + store owner (`role: "owner"`) — passwords bcrypt-hashed |
| `orders` | Saved order history (WhatsApp still sends the message) |
| `carts` | Logged-in user's cart (follows them across devices) |

---

## 1. Create the free cluster (5 minutes)

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and sign up (free).
2. **Build a database** → **M0 FREE** → pick a region near India (e.g. Mumbai / Singapore).
3. **Database Access** → **Add New Database User**
   - Username: `shafi_user` (or anything you like)
   - Password: generate a strong one and **save it**
   - Built-in role: **Read and write to any database**
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   (needed so Vercel can connect)
5. **Database** → **Connect** → **Connect your application**  
   Copy the URI like:
   `mongodb+srv://shafi_user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## 2. Put the connection string in Vercel

**Vercel dashboard → your project → Settings → Environment Variables**

Add these three (Production **and** Preview):

| Name | Value |
|---|---|
| `MONGODB_URI` | the URI from step 1 (replace `<password>`) |
| `MONGODB_DB` | `shafi_kirana` |
| `JWT_SECRET` | long random text, e.g. `shafi-2025-secure-key-do-not-share` |

Then **Deployments → ⋯ → Redeploy**.

### Local testing (optional)

```bash
cp .env.example .env.local
# paste the same three values
```

---

## 3. Seed products + create owner login

From the project folder (needs Node 18+):

```bash
MONGODB_URI="your-atlas-uri" SEED_OWNER=1 OWNER_USER=shaban.idrishi OWNER_PASS="pick-a-strong-password" node scripts/seed-mongo.mjs
```

This inserts the sample grocery list and creates the **store owner** account.

> The owner password is **hashed with bcrypt** in Mongo. It is not the old hard-coded `config.js` password anymore.

---

## 4. How the app talks to the database

Vercel serverless functions in `api/`:

| Endpoint | Who | What |
|---|---|---|
| `GET /api/products` | Public | Full catalogue for Home / Browse |
| `POST /api/products` | Owner JWT | Create product |
| `PUT /api/products` | Owner JWT | Update product |
| `DELETE /api/products` | Owner JWT | Delete product |
| `POST /api/products?import=1` | Owner JWT | CSV/Excel bulk import |
| `POST /api/auth/register` | Public | Customer sign-up |
| `POST /api/auth/login` | Public | Customer / owner login → JWT |
| `GET /api/auth/me` | Logged in | Validate token |
| `GET /api/orders` | Logged in | Owner: all · customer: last 10 |
| `POST /api/orders` | Anyone | Save order after WhatsApp send |
| `GET /api/cart` | Logged in | Load cart from Mongo |
| `PUT /api/cart` | Logged in | Save cart to Mongo |

**Login** returns a JWT. The frontend stores it in `localStorage` (`shafi_token_v1`) and sends `Authorization: Bearer …` on owner/admin calls.

**Flow now:**

1. Owner logs in on `/admin` → token saved  
2. Owner adds/edits/imports products → written to **MongoDB**  
3. Every customer’s Home/Browse loads `GET /api/products` → **same list on every phone**

---

## 5. Day-to-day management

- **Add / edit / delete items** → Admin dashboard on the site (works on any phone once you log in as owner).
- **Bulk upload** → Admin → Import CSV/Excel (merge or replace).
- **Backup** → Admin → Export CSV (keeps a file copy).
- **Customer accounts** → live in `users` (passwords hashed).
- **Orders** → saved in `orders` + still sent to WhatsApp.

### Change the owner password

Run the seed script again with a new `OWNER_PASS` (it upserts the owner), or update the `users` document in Atlas and re-hash — easiest is re-run `scripts/seed-mongo.mjs` with `SEED_OWNER=1`.

### Change WhatsApp number

Still only [src/config.js](src/config.js) → `WHATSAPP_NUMBER`, then deploy.

---

## 6. What breaks if env vars are missing

| Missing | Symptom |
|---|---|
| `MONGODB_URI` | `GET /api/products` returns 500 → site shows offline sample list |
| `JWT_SECRET` | Login still works locally (dev default) but tokens should be rotated |
| DB user / IP not open | API errors — check Atlas **Network Access** |

After any Atlas change: **Vercel → Redeploy**.

---

## 7. Cost

- Atlas **M0** free tier: enough for a village grocery catalogue.
- Vercel **Hobby** free tier: enough for this site.
- WhatsApp Click-to-Chat: free.

No payment gateway. No monthly bill if you stay on free tiers.
