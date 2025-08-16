// src/components/ui/Skeleton.jsx
// Contributors: Bhumil Parate(8994642)
export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-slate-800/70 rounded-xl ${className}`}
      {...props}
    />
  );
}
