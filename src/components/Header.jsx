import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { STORE_NAME, OWNER_PHOTO, INSTAGRAM_URL, CONTACT_NUMBER } from '../config'

/** Compact sticky app header — logo, brand, cart. Nav lives in BottomNav on mobile. */
export default function Header() {
  const { items } = useCart()
  const [photoError, setPhotoError] = useState(false)
  const cartCount = items.reduce((n, i) => n + i.units, 0)
  const loc = useLocation()
  const showOwnerPhoto = Boolean(OWNER_PHOTO) && !photoError

  return (
    <header className="sticky top-0 z-50">
      {/* Thin announcement — one short line */}
      <div className="strip-bg text-white text-center text-[10px] sm:text-xs font-semibold py-1.5 px-3">
        <span className="inline-flex items-center justify-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-brand-300 animate-pulse shrink-0" />
          <span className="truncate">Order on WhatsApp • Pay on delivery</span>
        </span>
      </div>

      {/* Compact main bar */}
      <div className="glass border-b border-brand-100/60 shadow-soft">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-2.5 h-12 sm:h-14">
            {/* Logo */}
            <Link to="/" className="shrink-0 group" aria-label={STORE_NAME}>
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lift group-hover:scale-105 transition-transform border-2 border-white">
                  {showOwnerPhoto ? (
                    <img
                      src={OWNER_PHOTO}
                      alt={`${STORE_NAME} owner`}
                      className="w-full h-full object-cover object-[50%_18%]"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1.5" />
                      <circle cx="19" cy="21" r="1.5" />
                      <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                    </svg>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-400 border-2 border-white" />
              </div>
            </Link>

            {/* Brand + social links — external <a> must stay outside the home Link */}
            <div className="min-w-0 flex-1">
              <Link to="/" className="block min-w-0">
                <p className="font-display font-extrabold text-brand-900 text-[13px] sm:text-[15px] leading-tight truncate">
                  {STORE_NAME}
                </p>
              </Link>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-[9px] sm:text-[10px] text-brand-600/80 font-medium truncate">
                  Fresh • Fast • Local
                </span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] sm:text-[10px] font-semibold text-fuchsia-600 hover:text-fuchsia-700 inline-flex items-center gap-0.5 shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>
                <a
                  href={`tel:${CONTACT_NUMBER}`}
                  className="text-[9px] sm:text-[10px] font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-0.5 shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {CONTACT_NUMBER}
                </a>
              </div>
            </div>

            {/* Desktop nav only — mobile uses BottomNav */}
            <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
              <a
                href={`tel:${CONTACT_NUMBER}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-brand-700 hover:bg-brand-50"
              >
                Call {CONTACT_NUMBER}
              </a>
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  loc.pathname === '/' ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  loc.pathname === '/browse' ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Browse
              </Link>
              <Link
                to="/account"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  loc.pathname === '/account' ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Account
              </Link>
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  loc.pathname === '/admin' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Admin
              </Link>
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lift btn-press"
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-accent-500 text-white text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile cart */}
            <Link
              to="/cart"
              className="lg:hidden relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-lift btn-press shrink-0"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[9px] font-extrabold rounded-full min-w-[16px] h-4 px-0.5 flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
