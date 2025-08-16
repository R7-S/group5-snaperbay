// src/components/ui/Skeleton.jsx
// Contributors: <Your Name>
export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-slate-800/70 rounded-xl ${className}`}
      {...props}
    />
  );
}
