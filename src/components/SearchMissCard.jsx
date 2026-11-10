import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { PLACEHOLDER_IMAGE } from '../config'

/**
 * Yellow "We might have this" card. Lets the customer add any item
 * straight to cart — the name is pre-filled from search but always
 * editable, so they can type a different product if they want.
 */
export default function SearchMissCard({ name = '', autoFill = true }) {
  const { add } = useCart()
  const [itemName, setItemName] = useState(autoFill ? name : '')
  const [qty, setQty] = useState('')
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const [userEdited, setUserEdited] = useState(false)

  // Keep the name in sync with the search bar as the user types,
  // unless they've manually edited the name field themselves.
  useEffect(() => {
    if (autoFill && !userEdited && name) setItemName(name)
  }, [name, autoFill, userEdited])

  function handleAdd() {
    const cleanName = itemName.trim()
    const cleanQty = qty.trim()
    if (!cleanName) {
      setError('Please enter the item name.')
      return
    }
    add(
      {
        id: 'custom_' + cleanName.toLowerCase().replace(/\s+/g, '_'),
        name: cleanName,
        category: 'other-grocery',
        type: 'custom',
        available: true,
      },
      cleanQty
    )
    setQty('')
    setError('')
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="product-card group bg-white rounded-2xl border-2 border-amber-200 shadow-soft overflow-hidden flex flex-col">
      {/* Image area with yellow "might have it" badge */}
      <div className="relative aspect-[5/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
        <img
          src={PLACEHOLDER_IMAGE}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        {/* Soft yellow tint so it still feels like a special card */}
        <div className="absolute inset-0 bg-amber-300/15" />

        {/* Yellow mark */}
        <div className="absolute top-2 left-2 right-2">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 9v4M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            Not listed — we might have it
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-display font-bold text-slate-900 leading-snug text-[13px] sm:text-[14px]">
            {itemName.trim() || 'Add any item'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            We may have this item — add it to your cart and check with the shop.
          </p>
        </div>

        <div className="mt-auto space-y-2">
          {/* Item name — always editable */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Item name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
                setUserEdited(true)
                setError('')
              }}
              placeholder="e.g. Amul Butter"
              className="field !py-2.5 !text-sm font-medium"
            />
          </div>

          {/* Quantity — optional; cart requires it before checkout */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Quantity (optional)
            </label>
            <input
              type="text"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value)
                setError('')
              }}
              placeholder="e.g. 250g, 1kg, 2 packs"
              className="field !py-2.5 !text-sm font-medium"
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={!itemName.trim()}
            onClick={handleAdd}
            className={`w-full rounded-2xl font-bold py-3 text-sm btn-press ${
              added
                ? 'bg-brand-700 text-white shadow-lift'
                : !itemName.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lift'
            }`}
          >
            {added ? (
              <span className="inline-flex items-center justify-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Added to cart
              </span>
            ) : (
              <span className="inline-flex items-center justify-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add to Cart
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
