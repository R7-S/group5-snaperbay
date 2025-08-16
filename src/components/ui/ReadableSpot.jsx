// src/components/ui/ReadableSpot.jsx
import React from "react";

/**
 * An oval, blurred "halo" that sits behind text to guarantee contrast.
 * Theme-aware: light uses white glow, dark uses black glow.
 */
export default function ReadableSpot({
  className = "", // size/position (give width/height here)
  rounding = "rounded-[2rem]",
  blur = "blur-2xl",
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
    >
      {/* light theme glow */}
      <div
        className={`dark:hidden ${rounding} ${blur}`}
        style={{
          width: "min(900px, 90%)",
          height: "220px",
          background:
            "radial-gradient(65% 60% at 50% 45%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0) 85%)",
        }}
      />
      {/* dark theme glow */}
      <div
        className={`hidden dark:block ${rounding} ${blur}`}
        style={{
          width: "min(900px, 90%)",
          height: "220px",
          background:
            "radial-gradient(65% 60% at 50% 45%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0) 85%)",
        }}
      />
    </div>
  );
}
