const FIELDS = [
  { name: 'name', label: 'Customer name', required: true, placeholder: 'e.g. Rahul', icon: 'user' },
  { name: 'mobile', label: 'Mobile number', required: true, placeholder: '10-digit mobile', type: 'tel', inputMode: 'numeric', icon: 'phone' },
  { name: 'address', label: 'Full delivery address', required: true, placeholder: 'House / street / colony', as: 'textarea', icon: 'home' },
  { name: 'area', label: 'Area / Locality', required: true, placeholder: 'e.g. Hazrat Nagar, Noorpur', icon: 'pin' },
  { name: 'landmark', label: 'Landmark (optional)', required: false, placeholder: 'e.g. Near Hospital', icon: 'pin' },
  { name: 'instructions', label: 'Delivery instructions (optional)', required: false, placeholder: 'e.g. Please deliver in the evening', as: 'textarea', icon: 'note' },
]

const ICONS = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  note: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
}

export default function CustomerForm({ value, onChange, errors = {} }) {
  function set(field, v) {
    onChange({ ...value, [field]: v })
  }

  return (
    <div className="space-y-4">
      {FIELDS.map((f) => {
        const hasError = Boolean(errors[f.name])
        return (
          <div key={f.name}>
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-1.5">
              <span className="text-slate-400">{ICONS[f.icon]}</span>
              {f.label}
              {f.required && (
                <span className="text-red-500 text-xs">*</span>
              )}
            </label>
            {f.as === 'textarea' ? (
              <textarea
                value={value[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={f.name === 'address' ? 3 : 2}
                className={`field ${hasError ? 'field-error' : ''}`}
              />
            ) : (
              <input
                type={f.type || 'text'}
                inputMode={f.inputMode}
                value={value[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`field ${hasError ? 'field-error' : ''}`}
              />
            )}
            {hasError && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                {errors[f.name]}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
