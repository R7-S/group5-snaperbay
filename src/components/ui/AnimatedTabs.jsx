// src/components/ui/AnimatedTabs.jsx
import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

export default function AnimatedTabs({ tabs, onChange }) {
  const [active, setActive] = useState(tabs[0].key);
  return (
    <LayoutGroup>
      <div className="relative flex gap-4 text-sm font-medium">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActive(t.key);
                onChange?.(t.key);
              }}
              className={`relative pb-1 transition ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {t.label}
              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-sky-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
