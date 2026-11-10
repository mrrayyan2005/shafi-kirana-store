import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Browse from './pages/Browse'
import CustomList from './pages/CustomList'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSent from './pages/OrderSent'
import Account from './pages/Account'

const Admin = lazy(() => import('./pages/Admin'))

/** Every route change starts at the top (e.g. Cart after scrolling on Home). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function Loading() {
  return (
    <div className="py-20 text-center">
      <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mx-auto" />
      <p className="text-brand-700 font-semibold mt-4 text-sm">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-24 sm:pt-8 lg:pb-10">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/custom-list" element={<CustomList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-sent" element={<OrderSent />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m15 9-6 6M9 9l6 6" />
                    </svg>
                  </div>
                  <h1 className="font-display text-3xl font-extrabold text-slate-900 mt-6">
                    Page not found
                  </h1>
                  <p className="text-slate-500 mt-2">
                    The page you&apos;re looking for doesn&apos;t exist.
                  </p>
                  <Link
                    to="/"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 btn-press shadow-lift"
                  >
                    Go Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
