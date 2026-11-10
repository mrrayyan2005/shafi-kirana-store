import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CustomerForm from '../components/CustomerForm'
import { validateCustomer } from '../utils/validate'
import { buildOrderMessage, openWhatsApp } from '../utils/whatsapp'

const emptyRow = () => ({ id: 'r_' + Date.now() + Math.random(), name: '', qty: '' })

export default function CustomList() {
  const navigate = useNavigate()
  const { saveOrder } = useAuth()
  const [rows, setRows] = useState([emptyRow(), emptyRow()])
  const [notes, setNotes] = useState('')
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
    area: '',
    landmark: '',
    instructions: '',
  })
  const [errors, setErrors] = useState({})
  const [rowErrors, setRowErrors] = useState({})
  const [step, setStep] = useState(1)

  function updateRow(id, field, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(id) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)))
  }

  function validateRows() {
    const filled = rows.filter((r) => r.name.trim() || r.qty.trim())
    if (filled.length === 0) {
      setRowErrors({ _form: 'Please add at least one item to your list.' })
      return null
    }
    const errs = {}
    const cleaned = filled.map((r) => {
      if (!r.name.trim()) errs[r.id] = 'Item name is required.'
      if (!r.qty.trim()) errs[r.id] = 'Quantity is required.'
      return { name: r.name.trim(), qty: r.qty.trim() }
    })
    setRowErrors(errs)
    return Object.keys(errs).length === 0 ? cleaned : null
  }

  function handleContinue(e) {
    e.preventDefault()
    const cleaned = validateRows()
    if (!cleaned) return
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const cleaned = validateRows()
    if (!cleaned) {
      setStep(1)
      return
    }
    const custErrors = validateCustomer(customer)
    setErrors(custErrors)
    if (Object.keys(custErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const message = buildOrderMessage({
      customer,
      items: cleaned,
      notes: notes || customer.instructions,
      orderType: 'custom',
    })
    saveOrder({
      items: cleaned,
      notes: notes || customer.instructions,
      orderType: 'custom',
      customer,
    })
    openWhatsApp(message)
    navigate('/order-sent', {
      state: { itemCount: cleaned.length, orderType: 'custom' },
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28 lg:pb-0">
      {/* Header */}
      <div>
        <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider">
          Option B
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Write Your Grocery List
        </h1>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">
          Type anything you need — even items not in our catalogue. We&apos;ll send
          your list on WhatsApp.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: 'Your list' },
          { n: 2, label: 'Delivery details' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            {i > 0 && (
              <div className={`w-10 h-1 rounded-full ${step >= s.n ? 'bg-accent-500' : 'bg-slate-150'}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all ${
                  step === s.n
                    ? 'bg-accent-600 text-white shadow-lift'
                    : step > s.n
                      ? 'bg-accent-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.n ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  s.n
                )}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= s.n ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ STEP 1: LIST ═══ */}
      {step === 1 && (
        <form onSubmit={handleContinue} className="space-y-5 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-accent-50 to-transparent border-b border-accent-100/60 flex items-center justify-between">
              <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </span>
                Items
              </h2>
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800 bg-accent-50 hover:bg-accent-100 px-3.5 py-2 rounded-full btn-press"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add item
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {rowErrors._form && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {rowErrors._form}
                </div>
              )}

              {rows.map((row, idx) => {
                const hasError = Boolean(rowErrors[row.id])
                return (
                  <div
                    key={row.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      hasError
                        ? 'border-red-200 bg-red-50/40'
                        : 'border-slate-100 bg-slate-50/60 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-accent-100 text-accent-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          Item {idx + 1}
                        </span>
                      </div>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                        placeholder="Product name (e.g. Rice)"
                        className={`field sm:col-span-3 ${hasError && !row.name.trim() ? 'field-error' : ''}`}
                      />
                      <input
                        type="text"
                        value={row.qty}
                        onChange={(e) => updateRow(row.id, 'qty', e.target.value)}
                        placeholder="Qty (e.g. 5 kg)"
                        className={`field sm:col-span-2 ${hasError && !row.qty.trim() ? 'field-error' : ''}`}
                      />
                    </div>
                    {hasError && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                        {rowErrors[row.id]}
                      </p>
                    )}
                  </div>
                )
              })}

              <button
                type="button"
                onClick={addRow}
                className="w-full rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-accent-300 hover:text-accent-600 hover:bg-accent-50/50 font-semibold py-3.5 text-sm btn-press transition-colors"
              >
                + Add another item
              </button>
            </div>
          </div>

          {/* ★ Message for the shop */}
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
                    Message for the Shop
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Items may be out of stock. Tell us what to do — we&apos;ll read
                    this message.
                  </p>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={'e.g. If sugar is not available, please skip it.\nOr: Please deliver in the evening after 5 PM.'}
                className="mt-3 w-full rounded-2xl border-2 border-accent-200/80 bg-white px-4 py-3.5 text-[15px] text-slate-800 placeholder:text-slate-400 focus:border-accent-400 focus:ring-4 focus:ring-accent-100 resize-none leading-relaxed"
              />

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
                      setNotes((prev) =>
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

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pb-2">
            <Link
              to="/"
              className="flex-1 text-center rounded-full border-2 border-slate-200 text-slate-700 font-bold py-4 hover:bg-slate-50 btn-press"
            >
              ← Back to Home
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-full bg-accent-600 hover:bg-accent-700 text-white font-bold py-4 btn-press shadow-lift hover:shadow-glow flex items-center justify-center gap-2"
            >
              Continue to Details
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* ═══ STEP 2: DETAILS ═══ */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5 sm:p-6">
            <h2 className="font-display font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
                </svg>
              </span>
              Delivery details
            </h2>
            <CustomerForm value={customer} onChange={setCustomer} errors={errors} />
          </div>

          {/* Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-accent-50 to-transparent border-b border-accent-100/60">
              <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M8 6h13M8 12h13M8 18h13" />
                    <path d="M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                </span>
                Your grocery list
                <span className="ml-auto text-xs font-semibold text-accent-700 bg-accent-50 px-2.5 py-1 rounded-full">
                  {rows.filter((r) => r.name.trim()).length} item
                  {rows.filter((r) => r.name.trim()).length === 1 ? '' : 's'}
                </span>
              </h2>
            </div>
            <ul className="divide-y divide-slate-50">
              {rows
                .filter((r) => r.name.trim())
                .map((r, i) => (
                  <li key={r.id} className="px-5 sm:px-6 py-3 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-50 text-accent-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-slate-800 font-medium text-sm">
                      {r.name.trim()}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-full">
                      {r.qty.trim() || '—'}
                    </span>
                  </li>
                ))}
            </ul>
            {/* Show the custom message so user can confirm before sending */}
            {notes.trim() && (
              <div className="px-5 sm:px-6 py-3 bg-accent-50/60 border-t border-accent-100/50">
                <p className="text-[11px] font-semibold text-accent-700 uppercase tracking-wider mb-1">
                  Your message to the shop
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {notes.trim()}
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 font-bold py-4 hover:bg-slate-50 btn-press"
            >
              ← Back to List
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 btn-press shadow-lift hover:shadow-glow flex items-center justify-center gap-2.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Open WhatsApp & Send Order
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            WhatsApp will open with your order pre-filled. Please press{' '}
            <strong>Send</strong> to confirm your order.
          </p>
        </form>
      )}
    </div>
  )
}
