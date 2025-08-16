// Contributors: Bhumil Parate(8994642) 
import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";

export default function AnimatedTabs({ tabs, onChange }) {
  const [active, setActive] = useState(tabs[0].key);
  return (
    <LayoutGroup>
      <div
        className="relative flex gap-4 text-sm font-medium"
        role="tablist"
        aria-label="Image info tabs"
      >
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.key}`}
              id={`tab-${t.key}`}
              onClick={() => {
                setActive(t.key);
                onChange?.(t.key);
              }}
              className={`relative pb-1 transition focus-visible:outline-none
                          focus-visible:ring-2 focus-visible:ring-offset-2
                          focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900
                ${
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
