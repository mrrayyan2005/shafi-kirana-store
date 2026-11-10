import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES, getCategory } from '../data/categories'
import ProductCard from '../components/ProductCard'
import SearchMissCard from '../components/SearchMissCard'

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') || 'all'
  const [query, setQuery] = useState('')

  const { products, loading } = useProducts()

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.available)
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    return list
  }, [products, activeCategory, query])

  function selectCategory(id) {
    if (id === 'all') setParams({})
    else setParams({ category: id })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Catalogue
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Browse Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Select quantities, add to cart, then send your order on WhatsApp.
          </p>
        </div>
        <Link
          to="/custom-list"
          className="inline-flex items-center gap-2 bg-accent-50 hover:bg-accent-100 text-accent-700 font-semibold text-sm px-5 py-3 rounded-2xl border border-accent-200 btn-press self-start sm:self-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Custom List instead
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-slate-400">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="field !py-3.5 !pl-12 !rounded-full shadow-soft font-medium"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => selectCategory('all')}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold border btn-press ${
            activeCategory === 'all'
              ? 'bg-brand-600 text-white border-brand-600 shadow-lift'
              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          All Products
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCategory(c.id)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold border whitespace-nowrap btn-press ${
              activeCategory === c.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-lift'
                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filtered.length === 0
            ? 'No products'
            : `Showing ${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
          {activeCategory !== 'all' && (
            <>
              {' '}in{' '}
              <span className="font-semibold text-brand-700">
                {getCategory(activeCategory).name}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Grid */}
      {loading && filtered.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">Loading products…</p>
      ) : filtered.length === 0 && query.trim() ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SearchMissCard name={query.trim()} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SearchMissCard name="" autoFill={false} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {/* Yellow card — type any item name, add it straight to cart */}
          <SearchMissCard name={query.trim()} autoFill={Boolean(query.trim())} />
        </div>
      )}
    </div>
  )
}
