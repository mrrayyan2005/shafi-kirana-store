import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Field({ label, value, onChange, type = 'text', placeholder, error, autoComplete }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`field ${error ? 'field-error' : ''}`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const [uname, setUname] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!uname.trim()) errs.uname = 'Username is required'
    if (!password) errs.password = 'Password is required'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setBusy(true)
    try {
      await login(uname, password)
      setErrors({})
    } catch (err) {
      setErrors({ form: err?.message || 'Login failed. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {errors.form}
        </div>
      )}
      <Field label="Username" value={uname} onChange={(v) => { setUname(v); setErrors({}) }} placeholder="Your username" error={errors.uname} autoComplete="username" />
      <Field label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setErrors({}) }} placeholder="Your password" error={errors.password} autoComplete="current-password" />
      <button type="submit" disabled={busy} className="w-full rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold py-3.5 btn-press shadow-lift">
        {busy ? 'Signing in…' : 'Login'}
      </button>
    </form>
  )
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [uname, setUname] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!uname.trim()) errs.uname = 'Username is required'
    if (uname.trim().length < 3) errs.uname = 'At least 3 characters'
    if (!password || password.length < 6) errs.password = 'At least 6 characters'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setBusy(true)
    try {
      await register(name, uname, password, mobile)
      setErrors({})
    } catch (err) {
      setErrors({ form: err?.message || 'Could not create account.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {errors.form}
        </div>
      )}
      <Field label="Your name (optional)" value={name} onChange={setName} placeholder="e.g. Rahul Sharma" autoComplete="name" />
      <Field label="Username" value={uname} onChange={(v) => { setUname(v); setErrors({}) }} placeholder="Pick a username" error={errors.uname} autoComplete="username" />
      <Field label="Mobile number (optional)" value={mobile} onChange={setMobile} placeholder="e.g. 9876543210" autoComplete="tel" />
      <Field label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setErrors({}) }} placeholder="At least 6 characters" error={errors.password} autoComplete="new-password" />
      <button type="submit" disabled={busy} className="w-full rounded-full bg-accent-600 hover:bg-accent-700 disabled:bg-slate-300 text-white font-bold py-3.5 btn-press shadow-lift">
        {busy ? 'Creating…' : 'Create Account'}
      </button>
      <p className="text-xs text-slate-400 text-center leading-relaxed">
        Your account is saved securely in our database.{' '}
        <button type="button" onClick={onSwitch} className="text-brand-600 font-semibold underline">
          Already have an account? Login
        </button>
      </p>
    </form>
  )
}

function OrderHistory() {
  const { orders, user, logout } = useAuth()

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-[1.5rem] p-6 text-white shadow-lift">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-extrabold backdrop-blur-sm">
            {(user?.name || user?.username || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold text-xl leading-tight truncate">
              {user?.name || user?.username}
            </p>
            <p className="text-brand-100 text-sm truncate">@{user?.username}</p>
            {user?.mobile && (
              <p className="text-brand-200 text-xs mt-0.5">{user.mobile}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Order history */}
      <div>
        <h2 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
          Order History
          <span className="ml-auto text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
            {orders.length} order{orders.length === 1 ? '' : 's'}
          </span>
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft p-8 text-center mt-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8M16 17H8" />
              </svg>
            </div>
            <p className="font-semibold text-slate-600 mt-4">No orders yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Your orders will appear here after you send them on WhatsApp.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-6 py-3 rounded-full btn-press"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft overflow-hidden">
                {/* Header row */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      ·{' '}
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    {order.status === 'sent' ? 'Sent' : order.status}
                  </span>
                </div>

                {/* Items */}
                <ul className="divide-y divide-slate-50">
                  {(order.items || []).slice(0, 5).map((item, i) => (
                    <li key={i} className="px-5 py-2.5 flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-slate-800 font-medium text-[13px] truncate">
                        {item.name}
                      </span>
                      <span className="text-[12px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.qty || '—'}
                      </span>
                    </li>
                  ))}
                  {(order.items || []).length > 5 && (
                    <li className="px-5 py-2 text-xs text-slate-400">
                      +{order.items.length - 5} more item{order.items.length - 5 === 1 ? '' : 's'}
                    </li>
                  )}
                </ul>

                {/* Message if any */}
                {order.notes && (
                  <div className="px-5 py-2.5 bg-accent-50/50 border-t border-accent-100/50">
                    <p className="text-[10px] font-semibold text-accent-600 uppercase tracking-wider mb-0.5">
                      Your message
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <Link to="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Continue shopping
        </Link>
      </div>
    </div>
  )
}

export default function Account() {
  const { isLoggedIn } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {isLoggedIn ? (
        <OrderHistory />
      ) : (
        <>
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center mx-auto shadow-lift">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
              {mode === 'login' ? 'Welcome back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login'
                ? 'Login to see your order history.'
                : 'Sign up to track your orders easily.'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-slate-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft p-6">
            {mode === 'login' ? (
              <LoginForm />
            ) : (
              <RegisterForm onSwitch={() => setMode('login')} />
            )}
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Accounts and order history are saved on this device only.
            <br />
            No online payment — orders go directly to WhatsApp.
          </p>
        </>
      )}
    </div>
  )
}
