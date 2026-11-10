import { useEffect, useMemo, useRef, useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { api } from '../utils/api'
import { invalidateProductCache } from '../hooks/useProducts'
import { downloadTextFile } from '../utils/productStore'
import { CATEGORIES, getCategoryName } from '../data/categories'
import { suggestCategory } from '../utils/suggestCategory'

function productsToCSV(list) {
  const header = 'Product Name,Category,Product Type,Unit,Available Variants,Image,Availability'
  const escape = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const lines = list.map((p) =>
    [
      escape(p.name),
      escape(p.category),
      escape(p.type),
      escape(p.unit),
      escape(p.variants),
      escape(p.image),
      p.available ? 'Yes' : 'No',
    ].join(',')
  )
  return [header, ...lines].join('\n')
}

function LoginGate({ onUnlock }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await api.login({ username, password })
      if (res?.user?.role !== 'owner') {
        api.logout()
        setError('This account is not the store owner.')
        return
      }
      onUnlock()
    } catch (err) {
      setError(err?.message || 'Incorrect username or password. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 mt-5">
          Store Owner Login
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Owners of this account — <span className="font-semibold text-brand-700">Mohd Rayyan</span> &amp; <span className="font-semibold text-brand-700">Mohd Shaban</span>
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Enter your username and password to manage products.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="field"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="field"
            autoComplete="current-password"
          />
          {error && (
            <p className="text-sm text-red-600 flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold py-3.5 btn-press shadow-lift"
          >
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

/**
 * Simple, large-button panel for the shop owner:
 * add an item quickly, and delete items from a simple list.
 */
function QuickAdd({ onChange }) {
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('')
  const [category, setCategory] = useState('')
  const [saved, setSaved] = useState('')

  // Auto-detect category from the typed name
  const suggested = suggestCategory(newName)
  const activeCategory = category || suggested

  async function handleQuickAdd(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    try {
      await api.createProduct({
        name,
        category: activeCategory,
        type: 'loose',
        unit: 'kg',
        variants: newQty.trim() || '',
        available: true,
      })
      invalidateProductCache()
      const catName = getCategoryName(activeCategory)
      setNewName('')
      setNewQty('')
      setCategory('')
      setSaved(`${name} → ${catName}`)
      setTimeout(() => setSaved(''), 3500)
      onChange()
    } catch (err) {
      setSaved(err?.message || 'Could not save')
      setTimeout(() => setSaved(''), 3500)
    }
  }

  return (
    <div className="rounded-[1.5rem] border-2 border-brand-200 bg-gradient-to-br from-brand-50 via-white to-cream-50 shadow-soft overflow-hidden">
      <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-brand-600 to-brand-700">
        <h2 className="font-display font-bold text-white text-base flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Quick Add
        </h2>
        <p className="text-brand-100/85 text-xs mt-0.5">
          Type a name and quantity — category is detected automatically. Use the product list below to edit or delete.
        </p>
      </div>

      {/* QUICK ADD */}
      <form onSubmit={handleQuickAdd} className="p-5 sm:p-6 border-b border-brand-100/50">
        <p className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
            +
          </span>
          Add a new item
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product name (e.g. Oreo)"
            className="field flex-1 !text-base"
          />
          <input
            type="text"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
            placeholder="Qty (e.g. 1 pack)"
            className="field sm:w-44 !text-base"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="rounded-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-7 py-3.5 btn-press shadow-lift text-base whitespace-nowrap"
          >
            Add Item
          </button>
        </div>

        {/* Live category preview */}
        {newName.trim() && (
          <div className="mt-3 rounded-2xl bg-brand-50 border border-brand-100 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Goes to category:</span>
              <select
                value={activeCategory}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-bold text-brand-800 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
              {!category && (
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
                  ✨ Auto-detected
                </span>
              )}
            </div>
          </div>
        )}

        {saved && (
          <p className="mt-2.5 text-sm text-brand-700 font-medium flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {saved} added to your product list
          </p>
        )}
      </form>
    </div>
  )
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      category: 'other-grocery',
      type: 'packaged',
      unit: 'pack',
      variants: '',
      image: '',
      available: true,
    }
  )
  const [error, setError] = useState('')

  function set(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      // Auto-suggest category when typing a product name
      if (field === 'name' && value.trim() && !f.category) {
        next.category = suggestCategory(value)
      }
      return next
    })
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }
    onSave(form)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="field"
          placeholder="e.g. Basmati Rice"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="field !cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Product Type
          </label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className="field !cursor-pointer"
          >
            <option value="packaged">Packaged</option>
            <option value="loose">Loose</option>
            <option value="both">Both (Packaged & Loose)</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Unit
          </label>
          <input
            type="text"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
            placeholder="kg / g / litre / pack"
            className="field"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Available Variants
          </label>
          <input
            type="text"
            value={form.variants}
            onChange={(e) => set('variants', e.target.value)}
            placeholder="e.g. 250g, 500g, 1kg"
            className="field"
          />
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Image URL <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={form.image}
          onChange={(e) => set('image', e.target.value)}
          placeholder="https://… (leave empty for placeholder)"
          className="field"
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
        <input
          type="checkbox"
          checked={form.available}
          onChange={(e) => set('available', e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Available for sale
      </label>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border-2 border-slate-200 text-slate-700 font-semibold py-3 hover:bg-slate-50 btn-press"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 btn-press shadow-lift"
        >
          {initial ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState('')
  const fileRef = useRef(null)
  const formRef = useRef(null)

  async function refresh() {
    try {
      const data = await api.listProducts()
      setProducts(data.products || [])
      invalidateProductCache()
      setLoadError('')
    } catch (err) {
      setLoadError(err?.message || 'Could not load products')
    }
  }

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((data) => {
        if (cancelled) return
        if (data?.user?.role === 'owner') {
          setUnlocked(true)
          return refresh()
        }
        api.logout()
        setUnlocked(false)
      })
      .catch(() => {
        if (!cancelled) setUnlocked(false)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Open the form and scroll to it (not to the page top)
  function openForm(product) {
    setEditing(product || null)
    setShowForm(true)
    // Wait a frame for the form to render, then scroll to it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  const filtered = useMemo(() => {
    let list = products
    if (filterCat !== 'all') list = list.filter((p) => p.category === filterCat)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    return list
  }, [products, query, filterCat])

  async function handleSave(form) {
    try {
      if (editing) await api.updateProduct(editing.id, form)
      else await api.createProduct(form)
      invalidateProductCache()
      await refresh()
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      setLoadError(err?.message || 'Could not save product')
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.deleteProduct(id)
      invalidateProductCache()
      await refresh()
    } catch (err) {
      setLoadError(err?.message || 'Could not delete product')
    }
  }

  function handleExport() {
    downloadTextFile('shafi-kirana-products.csv', productsToCSV(products))
  }

  function handleDownloadTemplate() {
    const header =
      'Product Name,Category,Product Type,Unit,Available Variants,Image,Availability'
    const sample = [
      'Basmati Rice,atta-rice-dal,loose,kg,"1, 5, 10, 25",,Yes',
      'Mustard Oil,oil-ghee,packaged,litre,"500ml, 1 litre, 5 litre",,Yes',
      'Sugar,atta-rice-dal,both,kg,"1, 5, 10",,Yes',
      'Parle-G Biscuits,biscuits-snacks,packaged,pack,"Small, Large",,Yes',
      'Surf Excel,household-cleaning,packaged,packet,"250g, 500g, 1kg",,Yes',
    ].join('\n')
    downloadTextFile('product-template.csv', header + '\n' + sample)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setImportResult(null)
    try {
      const rows = await parseFile(file)
      const mode = window.confirm(
        'Click OK to MERGE with existing products (add new / update by name).\n\nClick Cancel to REPLACE the entire catalogue with this file.'
      )
        ? 'merge'
        : 'replace'
      const result = await api.importProducts(rows, mode)
      invalidateProductCache()
      setImportResult({ ...(result.summary || result), mode })
      await refresh()
    } catch (err) {
      setImportResult({
        added: 0,
        updated: 0,
        skipped: 0,
        errors: ['Could not read file: ' + (err?.message || err)],
        mode: 'merge',
      })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function parseFile(file) {
    return new Promise((resolve, reject) => {
      const name = file.name.toLowerCase()
      if (name.endsWith('.csv') || name.endsWith('.txt')) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => resolve(res.data),
          error: reject,
        })
      } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const wb = XLSX.read(ev.target.result, { type: 'array' })
            const sheet = wb.Sheets[wb.SheetNames[0]]
            resolve(XLSX.utils.sheet_to_json(sheet, { defval: '' }))
          } catch (err) {
            reject(err)
          }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      } else {
        reject(new Error('Unsupported file type. Use .csv or .xlsx'))
      }
    })
  }

  if (checking) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mx-auto" />
        <p className="text-brand-700 font-semibold mt-4 text-sm">Checking owner session…</p>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <LoginGate
        onUnlock={() => {
          setUnlocked(true)
          refresh()
        }}
      />
    )
  }

  function handleLogout() {
    api.logout()
    setUnlocked(false)
    setProducts([])
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-medium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {loadError}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider">
            Store management
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your product catalogue. Changes save to the cloud and show for every customer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 btn-press"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>
      </div>

      {/* ★ QUICK ADD / DELETE — simple panel for the shop owner */}
      <QuickAdd onChange={refresh} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => openForm(null)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-3 rounded-full btn-press shadow-lift"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-white border border-brand-200 text-brand-700 text-sm font-semibold px-5 py-3 rounded-full btn-press hover:bg-brand-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Export
        </button>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-3 rounded-full btn-press hover:bg-slate-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
          </svg>
          CSV Template
        </button>
      </div>

      {/* Bulk import */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-50">
          <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </span>
            Bulk Import (CSV / Excel)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload a file with columns:{' '}
            <code className="bg-slate-50 px-1.5 py-0.5 rounded text-xs text-slate-600">
              Product Name, Category, Product Type, Unit, Available Variants, Image, Availability
            </code>
            <span className="block mt-1 text-xs text-slate-400">
              Product Type: <code>loose</code>, <code>packaged</code>, or <code>both</code> (Packaged &amp; Loose)
            </span>
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv"
              onChange={handleFile}
              className="block text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-600 file:text-white file:font-semibold file:px-5 file:py-2.5 file:cursor-pointer hover:file:bg-brand-700 file:btn-press"
            />
            {busy && (
              <span className="text-sm text-brand-700 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Reading file…
              </span>
            )}
          </div>

          {importResult && (
            <div
              className={`mt-4 rounded-2xl p-4 text-sm ${
                importResult.errors.length > 0
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-brand-50 text-brand-900 border border-brand-200'
              }`}
            >
              <p className="font-semibold">
                Import finished ({importResult.mode}): {importResult.added} added,{' '}
                {importResult.updated} updated, {importResult.skipped} skipped.
              </p>
              {importResult.errors.length > 0 && (
                <ul className="mt-2 list-disc list-inside space-y-0.5 text-amber-800">
                  {importResult.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5 sm:p-6 animate-slide-up">
          <h2 className="font-display font-bold text-slate-900 text-base mb-4">
            {editing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-slate-400">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="field !py-3 !pl-11 !rounded-full"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="field !rounded-full !cursor-pointer sm:!w-56"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product list */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            onClick={() => refresh()}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 font-medium"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-2.636-6.364" />
              <path d="M21 3v6h-6" />
            </svg>
            Refresh
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No products yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Add products manually or import a CSV file.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {filtered.map((p) => (
              <li key={p.id} className="admin-row p-4 sm:px-6 flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>
                  )}
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getCategoryName(p.category)} • {p.type === 'both' ? 'Packaged & Loose' : p.type}
                    {p.variants ? ` • ${p.variants}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.updateProduct(p.id, { ...p, available: !p.available })
                      invalidateProductCache()
                      await refresh()
                    } catch (err) {
                      setLoadError(err?.message || 'Could not update product')
                    }
                  }}
                  className={`text-xs font-bold rounded-full px-3 py-1.5 ${
                    p.available
                      ? 'bg-brand-50 text-brand-700 border border-brand-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}
                >
                  {p.available ? 'Available' : 'Unavailable'}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openForm(p)}
                    className="text-sm text-brand-700 hover:text-brand-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-brand-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.name)}
                    className="text-sm text-red-500 hover:text-red-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-2xl p-5">
        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-brand-900 text-sm">Tip for managing on mobile</p>
          <p className="text-sm text-brand-800/80 mt-1 leading-relaxed">
            Use <strong>Export Products</strong> to download a CSV, edit it in
            Google Sheets or Excel, then upload it again with <strong>Merge</strong>.
            This is the fastest way to manage hundreds of products from a phone.
          </p>
        </div>
      </div>
    </div>
  )
}
