# Shafi Kirana Store – Online Grocery Ordering Website

A modern, mobile-first grocery ordering website for **Shafi Kirana Store**.

Customers can:
- Browse products and add them to a cart (**Option A**), or
- Type any custom grocery list (**Option B**)

Both options generate a formatted WhatsApp message and open WhatsApp (Click-to-Chat).  
**No online payment. No backend cost.**

---

## 1. Quick start (on your computer)

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Start the local website
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

---

## 2. Configure the store (important!)

Open **one file only**: [`src/config.js`](src/config.js)

| Setting | What to change |
|---|---|
| `WHATSAPP_NUMBER` | Your father's WhatsApp number in **international format**, digits only. Example for India: `919876543210` |
| `STORE_NAME` | `Shafi Kirana Store` |
| `ADMIN_PIN` | PIN for the admin page. **Change from `1234`!** |
| `OWNER_PHOTO` | Path to the shop owner's photo used as the logo (default `/owner.jpg`) |

### Shop owner logo photo

1. Copy the photo into the `public/` folder and name it **`owner.jpg`**
   (or change `OWNER_PHOTO` in `src/config.js` to `/owner.png` etc.)
2. Refresh the site — the photo appears in the top-left logo next to **Shafi Kirana Store**
3. If the file is missing, the site shows a green cart icon instead (nothing breaks)

Save the file and refresh the website.

---

## 3. Project structure

```
store/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── sample-data/
│   └── products-sample.csv      ← example product file for import
├── src/
│   ├── main.jsx                 ← app entry
│   ├── App.jsx                  ← routes
│   ├── index.css                ← Tailwind styles
│   ├── config.js                ← WhatsApp number, store name, admin PIN
│   ├── context/
│   │   └── CartContext.jsx      ← cart state (saved in browser)
│   ├── data/
│   │   └── categories.js        ← product categories
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx      ← product card + quantity selector
│   │   └── CustomerForm.jsx     ← shared delivery-details form
│   ├── pages/
│   │   ├── Home.jsx             ← homepage (search + 2 ordering options)
│   │   ├── Browse.jsx           ← Option A: catalogue
│   │   ├── CustomList.jsx       ← Option B: write your own list
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx         ← customer details + WhatsApp
│   │   ├── OrderSent.jsx        ← "please press Send in WhatsApp"
│   │   └── Admin.jsx            ← product management + CSV/Excel import
│   └── utils/
│       ├── productStore.js      ← load/save/import/export products
│       └── whatsapp.js          ← builds & opens the WhatsApp message
└── dist/                        ← production build (created by npm run build)
```

---

## 4. Customer-facing features

### Homepage
- Store name / logo
- Search bar
- **Option A:** Browse and Select Products
- **Option B:** Write Your Grocery List
- Category shortcuts
- How-ordering-works explanation

### Option A – Catalogue & cart
- Product cards with name, image, category, packaging info
- Packaged products show predefined variants
- Loose products show sensible weights (250g, 500g, 1kg…) **plus free custom quantity**
- Add / edit / remove cart items
- **No prices anywhere**

### Option B – Custom grocery list
- Multiple rows (add / remove)
- Product name + quantity per row
- Optional extra instructions
- **No restriction to catalogue items**

### Customer details (same for both options)
- Name, mobile, full address, area, landmark, optional instructions
- No registration / login

### WhatsApp order
- One shared message format for both options
- Properly URL-encoded
- Opens `https://wa.me/<number>?text=...`
- Customer must **manually press Send** in WhatsApp
- The website never claims the order is submitted

Example message:

```
NEW ORDER – SHAFI KIRANA STORE

Customer Name: Rahul
Mobile: 9876543210

Delivery Address:
Hazrat Nagar, Noorpur
Area: Hazrat Nagar, Noorpur
Landmark: Near Hospital

ORDER ITEMS:
1. Rice – 5 kg
2. Sugar – 2 kg
3. Mustard Oil – 1 litre
4. Potato – 2 kg

Additional Instructions: Please deliver in the evening.

Please confirm availability and pricing with the customer.
```

---

## 5. Admin dashboard (for your father)

Open: **`https://your-site.com/admin`**

1. Enter the PIN from `src/config.js` (default `1234` — change it).
2. Manage products from the phone:
   - **Add / Edit / Delete** a product
   - Mark **Available / Unavailable**
   - **Search** and filter by category
   - **Export** current list as CSV
   - **Download CSV template**
   - **Bulk import** CSV or Excel (hundreds/thousands of products)

### Spreadsheet columns

| Column | Example | Notes |
|---|---|---|
| `Product Name` | Basmati Rice | Required |
| `Category` | `atta-rice-dal` | See list below |
| `Product Type` | `loose`, `packaged`, or `both` | `both` = Packaged & Loose |
| `Unit` | kg / g / litre / pack | |
| `Available Variants` | `250g, 500g, 1kg` | Comma-separated |
| `Image` | https://… | **Optional** |
| `Availability` | Yes / No | |

### Category values (use these exact IDs)

- `atta-rice-dal` — Atta, Rice & Dal
- `oil-ghee` — Oil & Ghee
- `spices-masala` — Spices & Masala
- `biscuits-snacks` — Biscuits & Snacks
- `chocolates-confectionery` — Chocolates & Confectionery
- `beverages` — Beverages
- `dairy-products` — Dairy Products
- `personal-care` — Personal Care
- `household-cleaning` — Household Cleaning
- `other-grocery` — Other Grocery Items

Unknown or missing category → automatically saved as **Other Grocery Items**.

### Import behaviour
- **Merge**: adds new products and updates existing ones matched by name (safe default)
- **Replace**: deletes the current list and uses only the uploaded file
- Invalid rows (missing name) are skipped and reported
- Duplicate names inside one file are merged, not duplicated

A ready sample file is here: [`sample-data/products-sample.csv`](sample-data/products-sample.csv)

### Recommended daily workflow (on mobile)
1. Open `/admin`
2. **Export Products** → save CSV
3. Edit in Google Sheets / WPS / Excel
4. Upload again with **Merge**

---

## 6. How product data is stored (please read)

This project is **zero-cost**, so it uses the browser's local storage:

- Products saved on **one phone/browser** stay there after refresh and reboot.
- They are **not automatically shared** with customers' phones.
- The starter catalogue loads only on the **first visit**; after that the admin list is used.

### Free options to share products with all customers

| Option | Cost | Effort | Result |
|---|---|---|---|
| **A. Keep everything in the site (recommended to start)** | Free | None | Put your product CSV in the repo, update the code seed list. All customers see the same catalogue after you redeploy. |
| **B. Google Sheets as a public sheet** | Free | Medium | Publish the sheet as CSV/JSON and load it on the homepage. All customers always see the latest list. No secret keys. |
| **C. Free backend (e.g. Supabase free tier)** | Free | Higher | Real shared database + real admin for many devices. |

**My recommendation:** start with **Option A** — it is the simplest and fully reliable.  
When you want the catalogue updated from your father's phone without redeploying, I can switch it to **Option B** (public Google Sheet) in a few minutes. That keeps the budget at **zero** and puts **no private credentials** in the frontend.

---

## 7. Deploy for free (GitHub + Vercel)

### Step 1 – Create a GitHub repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it e.g. `shafi-kirana-store`
3. Keep it **Private** if you prefer
4. Do **not** add a README (this project already has one)

### Step 2 – Upload this project

On your own machine (from the `store` folder):

```bash
git init
git add .
git commit -m "Shafi Kirana Store website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shafi-kirana-store.git
git push -u origin main
```

> If you prefer, you can also upload the folder directly on GitHub via **Add file → Upload files**.

### Step 3 – Deploy on Vercel (free)
1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. **Add New… → Project**
3. Select `shafi-kirana-store`
4. Vercel auto-detects Vite. Keep defaults:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**

Your site goes live on: `https://shafi-kirana-store.vercel.app`

### Step 4 – Put the WhatsApp number live
1. Edit `src/config.js` → set `WHATSAPP_NUMBER`
2. Commit & push
3. Vercel redeploys automatically

### Free-tier limitations (honest list)

| Service | Free limit | Enough for you? |
|---|---|---|
| Vercel Hobby | 100 GB bandwidth/month | **Yes** for a local kirana store |
| GitHub | Unlimited public/private repos | **Yes** |
| WhatsApp Click-to-Chat | Free (uses normal WhatsApp) | **Yes** |
| Browser storage (products) | Free, per device | **Yes** if you follow Option A above |
| No database / no payment gateway | $0 | **Yes** |

There are **no paid APIs, no paid plugins, no paid database** in this project.

---

## 8. Testing checklist

Use this before you share the website:

**Homepage**
- [ ] Store name shows correctly
- [ ] Search finds products
- [ ] Both ordering options are visible and easy to tap

**Option A**
- [ ] Products show name, category, quantity options
- [ ] No prices appear anywhere
- [ ] Add to cart works; cart badge updates
- [ ] Cart: change quantity / remove item works

**Option B**
- [ ] Can add and remove rows
- [ ] Can type items **not** in the catalogue
- [ ] Additional instructions field works

**Customer details**
- [ ] Missing name / mobile / address / area shows a clear error
- [ ] Mobile accepts 10-digit number

**WhatsApp**
- [ ] Message opens in WhatsApp with all items listed
- [ ] Message is correctly formatted and URL-encoded
- [ ] Long lists (30+ items) still open correctly
- [ ] Website says "please press Send" and does **not** claim the order is submitted

**Admin**
- [ ] Wrong PIN is rejected
- [ ] Correct PIN opens the dashboard
- [ ] Add / edit / delete product works
- [ ] Toggle available/unavailable works
- [ ] CSV export downloads a file
- [ ] CSV import (sample file) adds/updates products
- [ ] Excel import works
- [ ] Invalid CSV (missing names) is handled without crashing

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| WhatsApp opens with wrong number | Check `WHATSAPP_NUMBER` in `src/config.js` — digits only, with country code (`91…` for India) |
| Admin PIN not working | Change `ADMIN_PIN` in `src/config.js`, rebuild |
| Products disappeared | Check if import used **Replace** mode. Re-import the sample CSV |
| Images not loading | Images are optional. A placeholder is used automatically |
| Site works on laptop but products missing on phone | Expected with browser-only storage — see section 6 |
| Build fails | Run `npm install` again, then `npm run build` |

---

## 10. Tech stack (all free)

- **React 18 + Vite 5** – fast, modern frontend
- **Tailwind CSS 3** – clean, mobile-first design
- **React Router** – simple pages
- **PapaParse** – CSV parsing in the browser
- **SheetJS (xlsx)** – Excel parsing in the browser
- **WhatsApp Click-to-Chat** – order submission
- **GitHub + Vercel** – free source control & hosting

No backend, no payment gateway, no paid service.

---

## 11. What to do first after downloading

1. `npm install`
2. Open `src/config.js`
3. Put the real WhatsApp number → save
4. Change `ADMIN_PIN` → save
5. `npm run dev` and test both ordering flows
6. Open `/admin`, export the sample products, replace them with your real list
7. Deploy to Vercel
8. Share the link with customers

---

Made for **Shafi Kirana Store** 🌿
