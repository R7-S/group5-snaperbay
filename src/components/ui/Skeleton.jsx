// components/ui/Skeleton.jsx
export default function Skeleton({ className = "", style, ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-slate-800/70 rounded-xl ${className}`}
      style={style}
      {...props}
    />
  );
}
