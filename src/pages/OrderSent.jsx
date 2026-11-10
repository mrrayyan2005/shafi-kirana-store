import { Link, useLocation } from 'react-router-dom'

export default function OrderSent() {
  const { state } = useLocation()
  const itemCount = state?.itemCount ?? 0

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      {/* Success animation */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lift animate-scale-in">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-24 h-24 rounded-full border-2 border-brand-200 animate-ping mx-auto opacity-40" />
        </div>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-8">
        Almost there! 🎉
      </h1>
      <p className="text-slate-500 mt-3 leading-relaxed max-w-md mx-auto">
        We&apos;ve opened WhatsApp with your order ready to send
        {itemCount > 0 && (
          <>
            {' '}({itemCount} item{itemCount === 1 ? '' : 's'})
          </>
        )}
        .
      </p>

      {/* Action card */}
      <div className="mt-8 bg-white rounded-3xl border-2 border-brand-100 shadow-soft p-6 text-left">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base">
              What happens next?
            </h2>
            <ol className="mt-3 space-y-3">
              {[
                'Press the Send button in WhatsApp',
                'We reply to confirm availability & pricing',
                'Pay on delivery when your order arrives',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-4 flex items-start gap-3 bg-accent-50 border border-accent-100 rounded-2xl p-4 text-left">
        <div className="w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 9v4M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <p className="text-sm text-accent-900/80 leading-relaxed">
          Your order is <strong>only confirmed</strong> after you press Send in
          WhatsApp. If WhatsApp didn&apos;t open, please check that it&apos;s
          installed on your phone.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 btn-press shadow-lift"
        >
          Back to Home
        </Link>
        <Link
          to="/browse"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 text-slate-700 font-bold px-7 py-3.5 hover:bg-slate-50 btn-press"
        >
          Order More
        </Link>
      </div>
    </div>
  )
}
