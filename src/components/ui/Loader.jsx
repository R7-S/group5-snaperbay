// src/components/ui/Loader.jsx
// Contributors: Bhumil Parate(8994642)

const SIZE_MAP = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
  xl: "h-12 w-12",
};

export default function Loader({ size = "md", className = "" }) {
  const sz = SIZE_MAP[size] || SIZE_MAP.md;
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-slate-500/70 dark:border-slate-300/70 border-t-transparent ${sz} ${className}`}
    />
  );
}
