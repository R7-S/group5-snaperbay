// src/components/FeatureCard.jsx
import React from "react";

export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 ring-1 ring-slate-200/70 dark:ring-slate-800 p-4 backdrop-blur">
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full
                        bg-white/80 dark:bg-slate-800/80 ring-1 ring-slate-200/70 dark:ring-slate-700"
        >
          
          <span className="text-lg leading-none">
            {typeof icon === "string" ? icon : icon}
          </span>
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="text-sm opacity-80 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
