// src/components/ui/Loader.jsx
export default function Loader({ size = 24, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-slate-500/70 dark:border-slate-300/70 border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
