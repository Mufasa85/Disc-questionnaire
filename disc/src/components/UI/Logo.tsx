export function Logo({ size = 64 }: { size?: number }) {
  return <div style={{ width: size, height: size }} aria-label="Logo DISC"
    className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-2 shadow-lg">
    {['D', 'I', 'S', 'C'].map((l, i) => <span key={l} className={`grid place-items-center rounded-md text-xs font-bold ${i % 3 === 0 ? 'bg-brand text-white' : 'bg-accent text-navy'}`}>{l}</span>)}
  </div>
}
