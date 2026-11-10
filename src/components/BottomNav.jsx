import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

/** Mobile app-style bottom navigation — Home, Categories, Cart, Account */
export default function BottomNav() {
  const { items } = useCart()
  const { isLoggedIn, user } = useAuth()
  const loc = useLocation()
  const cartCount = items.reduce((n, i) => n + i.units, 0)

  const itemClass = (active) =>
    `flex flex-col items-center justify-center gap-0.5 min-w-0 rounded-2xl py-1.5 transition-colors ${
      active ? 'text-brand-700 bg-brand-50' : 'text-slate-500'
    }`

  const iconWrap = 'w-6 h-6 flex items-center justify-center'

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] pb-safe"
      aria-label="Main"
    >
      <div className="max-w-lg mx-auto px-1.5 pt-1.5 pb-1 grid grid-cols-5 gap-0.5">
        {/* Home */}
        <Link to="/" className={itemClass(loc.pathname === '/')}>
          <span className={iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>
          </span>
          <span className="text-[9px] font-semibold leading-none">Home</span>
        </Link>

        {/* Shop / categories */}
        <Link
          to="/browse"
          className={itemClass(loc.pathname === '/browse')}
        >
          <span className={iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span className="text-[9px] font-semibold leading-none">Shop</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className={`${itemClass(loc.pathname === '/cart' || loc.pathname === '/checkout')} relative`}>
          <span className={`${iconWrap} relative`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent-500 text-white text-[9px] font-extrabold rounded-full min-w-[16px] h-4 px-0.5 flex items-center justify-center border border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </span>
          <span className="text-[9px] font-semibold leading-none">Cart</span>
        </Link>

        {/* Account */}
        <Link
          to="/account"
          className={itemClass(loc.pathname === '/account')}
        >
          <span className={iconWrap}>
            {isLoggedIn ? (
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                {(user?.name || user?.username || '?').charAt(0).toUpperCase()}
              </span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            )}
          </span>
          <span className="text-[9px] font-semibold leading-none">Account</span>
        </Link>

        {/* Shop owner / Admin */}
        <Link
          to="/admin"
          className={itemClass(loc.pathname === '/admin')}
        >
          <span className={iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span className="text-[9px] font-semibold leading-none">Owner</span>
        </Link>
      </div>
    </nav>
  )
}
