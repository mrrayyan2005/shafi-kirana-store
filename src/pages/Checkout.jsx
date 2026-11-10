import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CustomerForm from '../components/CustomerForm'
import { validateCustomer } from '../utils/validate'
import { buildOrderMessage, openWhatsApp } from '../utils/whatsapp'

export default function Checkout() {
  const { items, message, setMessage, clear } = useCart()
  const { saveOrder } = useAuth()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
    area: '',
    landmark: '',
    instructions: '',
  })
  const [errors, setErrors] = useState({})

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="21" r="1.5" />
            <circle cx="19" cy="21" r="1.5" />
            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 mt-5">
          Your cart is empty
        </h1>
        <p className="text-slate-500 mt-2">Add products before checking out.</p>
        <Link
          to="/browse"
          className="mt-6 inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-7 py-3.5 rounded-full"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  const lineItems = items.flatMap((item) =>
    Array.from({ length: item.units }, () => ({ name: item.name, qty: item.qty }))
  )

  function handleSubmit(e) {
    e.preventDefault()
    const custErrors = validateCustomer(customer)
    setErrors(custErrors)
    if (Object.keys(custErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const orderMsg = buildOrderMessage({
      customer,
      items: lineItems,
      notes: message || customer.instructions,
      orderType: 'catalogue',
    })
    saveOrder({
      items: lineItems,
      notes: message || customer.instructions,
      orderType: 'catalogue',
      customer,
    })
    openWhatsApp(orderMsg)
    clear()
    navigate('/order-sent', {
      state: { itemCount: lineItems.length, orderType: 'catalogue' },
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-36 lg:pb-6">
      {/* Back */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-600 text-sm font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to Cart
      </Link>

      <div>
        <p className="text-brand-600 font-semibold text-xs uppercase tracking-wider">
          Step 3 of 3
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Delivery Details
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Fill your details and add a message for the shop.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ★ SHOP MESSAGE — prominent, mobile-first */}
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
                  Message for the Shop/ Description of the Items (Optional)
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

        {/* Customer details */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft p-5">
          <h2 className="font-display font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </span>
            Your details
          </h2>
          <CustomerForm value={customer} onChange={setCustomer} errors={errors} />
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft overflow-hidden">
          <div className="px-5 py-3.5 bg-brand-50/60 border-b border-brand-100/50 flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900 text-sm">
              Order summary
            </h2>
            <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2.5 py-1 rounded-full">
              {lineItems.length} item{lineItems.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="divide-y divide-slate-50">
            {lineItems.map((item, i) => (
              <li key={i} className="px-5 py-2.5 flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-slate-800 font-medium text-[13px] truncate">
                  {item.name}
                </span>
                <span className="text-[12px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {item.qty}
                </span>
              </li>
            ))}
          </ul>
          {/* Show the custom message so user can confirm before sending */}
          {message.trim() && (
            <div className="px-5 py-3 bg-accent-50/60 border-t border-accent-100/50">
              <p className="text-[11px] font-semibold text-accent-700 uppercase tracking-wider mb-1">
                Your message to the shop
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {message.trim()}
              </p>
            </div>
          )}
        </div>

        {/* Desktop CTA (hidden on mobile — sticky bar below) */}
        <button
          type="submit"
          className="hidden lg:flex w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-base items-center justify-center gap-2.5 shadow-lift"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Open WhatsApp & Send Order
        </button>
      </form>

      {/* ★ STICKY MOBILE ACTION BAR — above bottom nav */}
      <div className="fixed bottom-[58px] left-0 right-0 lg:hidden z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lift pb-safe">
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-[15px] flex items-center justify-center gap-2.5 shadow-lift btn-press"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Send Order on WhatsApp
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-1.5">
            WhatsApp will open with your order ready to send
          </p>
        </div>
      </div>
    </div>
  )
}
