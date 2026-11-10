import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../data/categories'
import ProductCard from '../components/ProductCard'
import SearchMissCard from '../components/SearchMissCard'
import { STORE_NAME } from '../config'

export default function Home() {
  const [query, setQuery] = useState('')
  const { products: allProducts, loading } = useProducts()
  const products = useMemo(() => allProducts.filter((p) => p.available), [allProducts])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8)
  }, [query, products])

  // Mix products from different categories so the grid isn't all one type
  const mixedProducts = useMemo(() => {
    const byCategory = {}
    products.forEach((p) => {
      const key = p.category || 'other'
      if (!byCategory[key]) byCategory[key] = []
      byCategory[key].push(p)
    })
    const mixed = []
    let added = true
    while (added && mixed.length < 8) {
      added = false
      for (const cat of Object.keys(byCategory)) {
        const item = byCategory[cat].shift()
        if (item) {
          mixed.push(item)
          added = true
          if (mixed.length >= 8) break
        }
      }
    }
    return mixed
  }, [products])

  return (
    <div className="space-y-5 sm:space-y-8 pb-4 lg:pb-0">
      {/* ═══ COMPACT HERO (app-style) ═══ */}
      <section className="relative rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900">
        <div className="blob w-[180px] h-[180px] bg-brand-400/25 -top-12 -right-8" />
        <div className="relative px-4 py-4 sm:px-7 sm:py-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 bg-white/12 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-300 animate-pulse" />
                  Pay on delivery
                </span>
              </div>
              <h1 className="mt-2 font-display text-white text-[1.35rem] sm:text-3xl font-extrabold leading-tight">
                {STORE_NAME}
              </h1>
              <p className="mt-1 text-brand-100/85 text-[13px] sm:text-[15px] leading-snug sm:max-w-md">
                Groceries from your neighbourhood shop — order on WhatsApp.
              </p>
              <p className="mt-1.5 text-accent-200 text-[12px] sm:text-[13px]">
                We&apos;re still working on this website for you.
              </p>
            </div>

            {/* Price note — highlighted */}
            <div className="shrink-0 max-w-[42%] sm:max-w-none sm:min-w-[170px] rounded-xl bg-accent-400/25 border border-accent-300/50 px-2.5 py-2 shadow-md">
              <p className="text-white text-[10px] sm:text-[11px] font-bold leading-snug">
                Prices on WhatsApp
                <span className="block text-accent-100 text-[9px] font-semibold mt-0.5">
                  after order
                </span>
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-slate-400">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3-3" />
                </svg>
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border-0 pl-9 pr-3 py-2.5 text-slate-900 shadow-soft focus:outline-none focus:ring-4 focus:ring-brand-400/25 text-[13px] sm:text-[15px] bg-white/95"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH RESULTS (only when searching) ═══ */}
      {query.trim() && (
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Results for <span className="text-brand-600">&quot;{query.trim()}&quot;</span>
            </h2>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-sm text-slate-500 font-medium"
            >
              Clear
            </button>
          </div>
          {searchResults.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <SearchMissCard name={query.trim()} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {searchResults.length <= 2 && (
                <SearchMissCard name={query.trim()} />
              )}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════
           ★ TWO MAIN OPTIONS — the focus of the page
           ═══════════════════════════════════════════ */}
        <section>
          <div className="text-center mb-5">
            <p className="text-accent-600 font-semibold text-xs uppercase tracking-[0.15em]">
              Start here
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
              How would you like to order?
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 px-2">
              Both ways send your order to our WhatsApp
            </p>
          </div>

          {/* OPTION A — Browse & Select */}
          <Link
            to="/browse"
            className="option-card block relative rounded-[1.75rem] overflow-hidden shadow-lift mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-600" />
            <div className="blob w-[200px] h-[200px] bg-white/10 -top-10 -right-10" />

            <div className="relative p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/25 shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                    <circle cx="9" cy="21" r="1.5" />
                    <circle cx="19" cy="21" r="1.5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-900 bg-white/85 px-2 py-0.5 rounded-full">
                      OPTION A
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-tight mt-1">
                    Browse & Select Products
                  </h3>
                </div>
              </div>

              <p className="mt-3 text-white/90 text-[14px] leading-relaxed">
                Look through our product list, choose quantities and add items to
                your cart. <strong>Fast and easy</strong> for everyday shopping.
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {['See all products', 'Custom quantities', 'Quick search'].map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-semibold text-white bg-white/15 px-2.5 py-1 rounded-full border border-white/15"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Big CTA */}
              <div className="mt-4 w-full rounded-full bg-white text-emerald-700 font-extrabold py-3.5 text-center text-[15px] shadow-lift btn-press flex items-center justify-center gap-2">
                Browse Products
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* OPTION B — Write Your List */}
          <Link
            to="/custom-list"
            className="option-card block relative bg-white rounded-[1.75rem] border-2 border-accent-200 overflow-hidden shadow-card hover:border-accent-400 mb-2"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-accent-100/70 to-transparent rounded-bl-[3.5rem]" />
            <div className="relative p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-orange-600 text-white flex items-center justify-center shadow-lift shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
                      OPTION B
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mt-1">
                    Write Your Grocery List
                  </h3>
                </div>
              </div>

              <p className="mt-3 text-slate-500 text-[14px] leading-relaxed">
                Type anything you need — <strong>even items we don&apos;t have in
                our list</strong>. Perfect for monthly shopping and village orders.
              </p>

              {/* Big CTA */}
              <div className="mt-4 w-full rounded-full bg-accent-600 text-white font-bold py-3.5 text-center text-[15px] shadow-lift btn-press flex items-center justify-center gap-2">
                Write My List Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </Link>

          <p className="text-center text-xs text-slate-400 mt-3 px-4">
            💡 Shop items may sometimes be out of stock — you&apos;ll be able to add
            a message when you finalize your order.
          </p>
        </section>

      {/* ═══ CATEGORIES — app-style grid (all screens) ═══ */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
            Shop by Category
          </h2>
          <Link
            to="/browse"
            className="text-brand-700 text-xs sm:text-sm font-semibold flex items-center gap-1"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/browse?category=${c.id}`}
              className="cat-pill group bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden hover:shadow-card hover:border-brand-200"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                <span className="absolute top-1.5 left-1.5 text-sm sm:text-base drop-shadow-sm">
                  {c.emoji}
                </span>
              </div>
              <p className="px-2 py-2 font-semibold text-slate-800 text-[10px] sm:text-[11px] leading-tight line-clamp-2">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PRODUCTS (secondary) ═══ */}
      {products.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Our Items
            </h2>
            <Link
              to="/browse"
              className="text-brand-700 text-sm font-semibold flex items-center gap-1"
            >
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          {loading && products.length === 0 && (
            <p className="text-sm text-slate-400 col-span-full text-center py-6">Loading products…</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            {mixedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {/* Item not listed? add it directly */}
            <SearchMissCard name="" autoFill={false} />
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS — compact for mobile ═══ */}
      <section className="rounded-[1.75rem] bg-gradient-to-br from-brand-800 to-brand-900 overflow-hidden relative">
        <div className="blob w-[180px] h-[180px] bg-brand-400/20 top-0 right-0" />
        <div className="relative px-5 py-8 sm:px-8">
          <h2 className="font-display text-xl font-extrabold text-white text-center">
            Order in 3 steps
          </h2>
          <div className="mt-6 space-y-4">
            {[
              { n: '1', t: 'Choose items', d: 'Write a list or browse products' },
              { n: '2', t: 'Add your details', d: 'Name, phone & address' },
              { n: '3', t: 'Send on WhatsApp', d: 'Add a message & press Send' },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3 bg-white/8 rounded-2xl p-3.5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-white/15 text-white font-display font-bold text-base flex items-center justify-center shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{s.t}</p>
                  <p className="text-brand-100/70 text-xs mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/custom-list"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-brand-800 font-bold py-3.5 rounded-full shadow-lift btn-press text-[15px]"
          >
            Start Your Order
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
