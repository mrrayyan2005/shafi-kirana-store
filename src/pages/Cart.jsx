import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

/** "4kg" + 2 → "8kg" · "250g" + 3 → "750g" · "2 packs" + 2 → "4 packs" */
function totalQty(qty, units) {
  const raw = (qty || '').trim()
  if (!raw || units <= 1) return ''
  const m = raw.match(/^([\d.]+)\s*(.*)$/)
  if (!m) return ''
  const num = parseFloat(m[1])
  if (!Number.isFinite(num)) return ''
  const unit = m[2].trim()
  const product = num * units
  const pretty = Number.isInteger(product) ? String(product) : String(product)
  return unit ? `${pretty} ${unit}` : pretty
}

export default function Cart() {
  const { items, setUnits, setQty, remove, clear, message, setMessage } = useCart()
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  const totalUnits = items.reduce((n, i) => n + i.units, 0)
  const missingQty = items.filter((i) => !i.qty.trim())

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 rounded-3xl bg-brand-50 text-brand-300 flex items-center justify-center mx-auto">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="21" r="1.5" />
            <circle cx="19" cy="21" r="1.5" />
            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 mt-5">
          Your cart is empty
        </h1>
        <p className="text-slate-500 mt-2">
          Browse products and add items, or write your own grocery list.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/browse"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 rounded-full btn-press shadow-lift"
          >
            Browse Products
          </Link>
          <Link
            to="/custom-list"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-accent-200 text-accent-700 font-bold px-7 py-3.5 rounded-full hover:bg-accent-50 btn-press"
          >
            Write Grocery List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-36 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Your order
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Shopping Cart
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalUnits} item{totalUnits === 1 ? '' : 's'} ready for checkout
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-slate-400 hover:text-red-500 font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {items.map((item, idx) => {
          const rowTotal = totalQty(item.qty, item.units)
          return (
          <div
            key={item.key}
            className={`p-5 flex items-start gap-4 ${
              idx !== 0 ? 'border-t border-slate-50' : ''
            }`}
          >
            {/* Item icon */}
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-slate-900 leading-snug">
                {item.name}
              </p>
              <div className="mt-2">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  value={item.qty}
                  onChange={(e) => setQty(item.key, e.target.value)}
                  placeholder="e.g. 250g, 1kg, 2 packs"
                  className={`field !py-2 !text-sm ${
                    item.qty.trim()
                      ? ''
                      : '!border-red-300 !bg-red-50/50 focus:!border-red-400 focus:!ring-red-100'
                  }`}
                />
                {!item.qty.trim() ? (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">
                    Quantity required
                  </p>
                ) : rowTotal ? (
                  <p className="text-[11px] text-brand-700 mt-1 font-semibold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    Total: {rowTotal}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => remove(item.key)}
                className="text-xs text-slate-300 hover:text-red-500 font-medium transition-colors"
              >
                Remove
              </button>

              <div className="flex items-center gap-1 bg-slate-50 rounded-full p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setUnits(item.key, item.units - 1)}
                  className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 shadow-sm flex items-center justify-center font-bold text-lg leading-none btn-press"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-slate-900">
                  {item.units}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setUnits(item.key, item.units + 1)}
                  className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-600 shadow-sm flex items-center justify-center font-bold text-lg leading-none btn-press"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* ★ Pricing & delivery notice */}
      <div className="rounded-[1.5rem] border-2 border-blue-200 bg-blue-50/70 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-[13px] font-bold text-blue-900 leading-snug">
                Prices will be sent on your WhatsApp by us
              </p>
              <p className="text-[11px] text-blue-700/80 mt-0.5 leading-relaxed">
                We&apos;ll confirm availability and pricing with you before delivery.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 rounded-xl px-3 py-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber-600 shrink-0">
                <path d="M12 9v4M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              <p className="text-[11px] font-bold text-amber-800 leading-snug">
                Minimum order ₹200 — orders below ₹200 cannot be delivered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ★ Message for the Shop — visible on cart page */}
      <div className="relative rounded-[1.5rem] overflow-hidden shadow-lift border-2 border-accent-300">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50 via-orange-50 to-amber-50" />
        <div className="relative p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-extrabold text-slate-900 text-base">
                Message for the Shop/ Description of Items (Optional)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Please specify any additional details about your order, if applicable.
              </p>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={'e.g. If sugar is not available, please skip it.\nOr: Please deliver in the evening after 5 PM.'}
            className="mt-3 w-full rounded-2xl border-2 border-accent-200/80 bg-white px-4 py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 focus:border-accent-400 focus:ring-4 focus:ring-accent-100 resize-none leading-relaxed"
          />

          {/* Quick suggestion chips */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[
              'If not available, skip it',
              'Deliver in evening',
              'Call before delivering',
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  setMessage((prev) =>
                    prev.trim() ? `${prev.trim()} ${suggestion}` : suggestion
                  )
                }
                className="text-[11px] font-semibold text-accent-700 bg-white border border-accent-200 px-2.5 py-1.5 rounded-full hover:bg-accent-100 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            This message will appear in your WhatsApp order
          </p>
        </div>
      </div>

      {/* Warning banner when qty is missing */}
      {showWarning && missingQty.length > 0 && (
        <div className="flex items-center gap-2.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-sm font-medium animate-fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Please add quantity for all items before checkout.
        </div>
      )}

      {/* Action bar — sticky on mobile, above bottom nav */}
      <div className="fixed bottom-[58px] left-0 right-0 lg:hidden z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lift pb-safe">
        <div className="px-4 py-3 flex gap-2">
          <Link
            to="/browse"
            className="flex-1 text-center rounded-full border-2 border-brand-200 text-brand-700 font-bold py-3.5 btn-press text-sm"
          >
            + Add more
          </Link>
          <button
            type="button"
            onClick={() => {
              if (missingQty.length > 0) {
                setShowWarning(true)
                return
              }
              navigate('/checkout')
            }}
            className={`flex-[1.4] inline-flex items-center justify-center gap-2 rounded-full font-bold py-3.5 btn-press shadow-lift text-sm ${
              missingQty.length > 0
                ? 'bg-slate-200 text-slate-400'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop action bar */}
      <div className="hidden lg:flex gap-3">
        <Link
          to="/browse"
          className="flex-1 text-center rounded-full border-2 border-brand-200 text-brand-700 font-bold py-3.5 hover:bg-brand-50 btn-press"
        >
          + Add more items
        </Link>
        <button
          type="button"
          onClick={() => {
            if (missingQty.length > 0) {
              setShowWarning(true)
              return
            }
            navigate('/checkout')
          }}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full font-bold py-3.5 btn-press shadow-lift ${
            missingQty.length > 0
              ? 'bg-slate-200 text-slate-400'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
        >
          Continue to Details
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
