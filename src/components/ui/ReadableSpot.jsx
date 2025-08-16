// Contributors: Bhumil Parate(8994642)

import React from "react";

export default function ReadableSpot({
  className = "",
  rounding = "rounded-[2rem]",
  blur = "blur-2xl",
  size = "w-[min(900px,90%)] h-[220px]",
  offsetY = 0,
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      style={offsetY ? { transform: `translateY(${offsetY}px)` } : undefined}
    >
      {/* light mode */}
      <div
        className={`dark:hidden ${rounding} ${blur} ${size}
          bg-[radial-gradient(65%_60%_at_50%_45%,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.25)_55%,rgba(255,255,255,0)_85%)]`}
      />
      {/* dark mode */}
      <div
        className={`hidden dark:block ${rounding} ${blur} ${size}
          bg-[radial-gradient(65%_60%_at_50%_45%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.30)_55%,rgba(0,0,0,0)_85%)]`}
      />
    </div>
  );
}
