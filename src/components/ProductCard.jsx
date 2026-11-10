import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { getCategory } from '../data/categories'

/** Split "1kg, 5kg, 10kg" into chip suggestions */
function qtyChips(variants) {
  return (variants || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
}

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [qty, setQty] = useState('')
  const [added, setAdded] = useState(false)
  const cat = getCategory(product.category)

  const selectedQty = qty.trim()
  const fallbackImage = cat.image
  const chips = qtyChips(product.variants)

  // Quantity is optional here — cart requires it before checkout
  function handleAdd() {
    if (!product.available) return
    add(product, selectedQty)
    setQty('')
    setAdded(true)
    setTimeout(() => setAdded(false), 1300)
  }

  return (
    <article className="product-card group bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden flex flex-col">
      {/* Image — grocery-app proportions (shorter, wider) */}
      <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-brand-50 to-cream-100">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImage) e.currentTarget.src = fallbackImage
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 bg-white/95 text-brand-800 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <span className="text-[10px] leading-none">{cat.emoji}</span>
            {cat.name}
          </span>
          {!product.available && (
            <span className="bg-red-500/95 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-slate-900 leading-snug text-[13px] sm:text-[14px] line-clamp-2">
          {product.name}
        </h3>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQty(c)}
                className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                  selectedQty === c
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-brand-50 text-brand-700 border-brand-100 hover:border-brand-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-2">
          <input
            type="text"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qty (optional)"
            aria-label={`Quantity for ${product.name}`}
            className="field !py-2 !px-3 !text-[13px] !rounded-xl font-medium"
          />

          <button
            type="button"
            disabled={!product.available}
            onClick={handleAdd}
            className={`w-full rounded-xl font-bold py-2.5 text-[13px] btn-press inline-flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-brand-700 text-white shadow-lift'
                : !product.available
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lift'
            }`}
          >
            {added ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
