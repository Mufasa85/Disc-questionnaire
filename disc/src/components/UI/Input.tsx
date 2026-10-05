import { forwardRef, type InputHTMLAttributes } from 'react'
interface P extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }
export const Input = forwardRef<HTMLInputElement, P>(({ label, error, id, ...p }, ref) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
    <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} {...p}
      className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-danger" />
    {error && <p id={`${id}-e`} role="alert" className="mt-1 text-sm text-danger">{error}</p>}
  </div>
))
