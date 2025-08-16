// src/components/CategoryChips.jsx
export default function CategoryChips({ items = [], onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c) => (
        <button
          key={c.key}
          onClick={() => onPick?.(c.query)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-white/80 dark:bg-slate-800/70 text-sm
                     ring-1 ring-slate-200/70 dark:ring-slate-700
                     hover:-translate-y-[1px] transition transform-gpu"
          aria-label={`Search ${c.label}`}
        >
          
          <span className="text-lg leading-none">{c.icon ?? c.emoji}</span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}
