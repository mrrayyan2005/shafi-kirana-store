import { Link } from 'react-router-dom'
import { STORE_NAME, SHOP_ADDRESS, SHOP_LANDMARK } from '../config'

export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-16 border-t border-brand-100/60 bg-white/60 backdrop-blur-sm pb-16 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-soft">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1.5" />
                  <circle cx="19" cy="21" r="1.5" />
                  <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                </svg>
              </div>
              <div>
                <p className="font-display font-extrabold text-brand-900 text-base">{STORE_NAME}</p>
                <p className="text-xs text-brand-600/70">Your neighbourhood kirana store</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Fresh groceries delivered locally. Place your order on WhatsApp — pay
              when you receive your items.
            </p>
            <div className="mt-4 flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 shrink-0 mt-0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-sm text-slate-600 leading-relaxed">
                <p className="font-semibold text-brand-800 text-xs uppercase tracking-wider mb-1">
                  Visit / Delivery area
                </p>
                <p>{SHOP_ADDRESS}</p>
                <p className="text-xs text-slate-500 mt-1">
                  🏥 Landmark: {SHOP_LANDMARK}
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-display font-bold text-brand-900 text-sm uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-brand-700 transition-colors">
                  → Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm text-slate-600 hover:text-brand-700 transition-colors">
                  → Browse Products
                </Link>
              </li>
              <li>
                <Link to="/custom-list" className="text-sm text-slate-600 hover:text-brand-700 transition-colors">
                  → Write Grocery List
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-slate-600 hover:text-brand-700 transition-colors">
                  → My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <p className="font-display font-bold text-brand-900 text-sm uppercase tracking-wider">
              How it works
            </p>
            <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                Write a list or choose products
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                Enter your delivery details
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                Send order on WhatsApp
              </li>
            </ol>
            <Link
              to="/admin"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-600 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Store owner login
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-100/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} {STORE_NAME}. Made with 💚 for local shopping.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Orders confirmed on WhatsApp
          </div>
        </div>

        {/* Developer credit */}
        <div className="mt-4 pt-4 border-t border-brand-100/40 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <p className="text-xs text-slate-500">
            Developed by{' '}
            <span className="font-bold text-brand-800">Mohd Rayyan</span>
          </p>
          <a
            href="https://www.instagram.com/mo_rayyan18"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-600 hover:text-fuchsia-700"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @mo_rayyan18
          </a>
        </div>
      </div>
    </footer>
  )
}
