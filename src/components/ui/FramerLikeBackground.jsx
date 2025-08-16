import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";


function useDarkModeStatus() {
  const getIsDark = () => {
    const root = document.documentElement;
    const has = root.classList.contains("dark");
    const prefers = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return has || prefers;
  };
  const [isDark, setIsDark] = useState(() => {
    try {
      return getIsDark();
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const update = () => setIsDark(getIsDark());
    try {
      mql?.addEventListener?.("change", update);
    } catch {
      mql?.addListener?.(update);
    }
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      try {
        mql?.removeEventListener?.("change", update);
      } catch {
        mql?.removeListener?.(update);
      }
      obs.disconnect();
    };
  }, []);
  return isDark;
}


function useDrift(t, phase, amp = 40, speed = 0.05) {
  return useTransform(t, (v) => Math.sin(v * speed + phase) * amp);
}

export default function FramerLikeBackground({
  blur = 80,
  intensity = 0.9, 
  variant = "auto", 
  className = "",
  fadeAfter = 0.62, 
}) {
  const reduce = useReducedMotion();
  const isDark = useDarkModeStatus();
  const mode = variant === "auto" ? (isDark ? "dark" : "light") : variant;

 
  const t = useMotionValue(0);
  useAnimationFrame((time) => t.set(time / 1000));

  
  const x1 = useDrift(t, 0.2, 40, 0.045);
  const y1 = useDrift(t, 1.1, 55, 0.05);
  const x2 = useDrift(t, 2.1, 45, 0.04);
  const y2 = useDrift(t, 1.8, 40, 0.042);
  const x3 = useDrift(t, 0.7, 55, 0.032);
  const y3 = useDrift(t, 2.4, 50, 0.035);
  const rot = useTransform(t, (v) => (v * 2) % 360);
  const dyn = (style) => (reduce ? {} : style);

  const palette = useMemo(() => {
    if (mode === "dark") {
      return {
        canvas: "#070A0F",
        vignette:
          "radial-gradient(120% 120% at 50% -10%, transparent, rgba(0,0,0,0.18))",
        noiseOpacity: 0.06,
        planet: `radial-gradient(55% 60% at 45% 40%,
          rgba(14,165,233,0.90) 0%,
          rgba(56,189,248,0.55) 35%,
          rgba(37,99,235,0.40) 55%,
          rgba(23,37,84,0.20) 70%,
          transparent 78%)`,
        crescent: `conic-gradient(from 210deg at 50% 50%,
          rgba(96,165,250,0.65), rgba(56,189,248,0.0) 55%)`,
        halo: `radial-gradient(60% 60% at 50% 50%,
          rgba(244,63,94,0.85), rgba(217,70,239,0.45) 45%, transparent 70%)`,
        ring: `radial-gradient(closest-side,
          rgba(16,185,129,0.85), rgba(16,185,129,0.35) 55%, transparent 70%)`,
        intens: intensity,
        blend: "normal",
        mask: undefined, 
      };
    }
    
    return {
      canvas: "transparent", 
      vignette:
        "radial-gradient(120% 120% at 50% -10%, transparent, rgba(0,0,0,0.06))",
      noiseOpacity: 0.02,
      planet: `radial-gradient(55% 60% at 45% 40%,
        rgba(99,102,241,0.20) 0%,
        rgba(59,130,246,0.16) 35%,
        rgba(14,165,233,0.12) 55%,
        rgba(2,132,199,0.06) 70%,
        transparent 78%)`,
      crescent: `conic-gradient(from 210deg at 50% 50%,
        rgba(96,165,250,0.20), rgba(56,189,248,0.0) 55%)`,
      halo: `radial-gradient(60% 60% at 50% 50%,
        rgba(244,114,182,0.28), rgba(217,70,239,0.18) 45%, transparent 70%)`,
      ring: `radial-gradient(closest-side,
        rgba(45,212,191,0.30), rgba(16,185,129,0.18) 55%, transparent 70%)`,
      intens: Math.min(0.7, intensity), 
      blend: "screen", 
      
      mask: `linear-gradient(to bottom,
        black 0%,
        black ${Math.round(fadeAfter * 100)}%,
        transparent 100%)`,
    };
  }, [mode, intensity, fadeAfter]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      style={
        palette.mask
          ? { WebkitMaskImage: palette.mask, maskImage: palette.mask }
          : undefined
      }
    >
      
      {palette.canvas !== "transparent" && (
        <div
          className="absolute inset-0"
          style={{ background: palette.canvas }}
        />
      )}

      
      <motion.div
        style={dyn({ x: x1, y: y1, rotate: rot })}
        className="absolute -left-[22vw] -bottom-[26vh] w-[95vw] h-[95vw] rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            filter: `blur(${blur}px)`,
            opacity: palette.intens,
            background: palette.planet,
            mixBlendMode: palette.blend,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            filter: `blur(${Math.max(10, blur - 20)}px)`,
            opacity: palette.intens * 0.9,
            background: palette.crescent,
            mixBlendMode: palette.blend,
            WebkitMask:
              "radial-gradient(100% 100% at 45% 40%, black 58%, transparent 70%)",
            mask: "radial-gradient(100% 100% at 45% 40%, black 58%, transparent 70%)",
          }}
        />
      </motion.div>

      
      <motion.div
        style={dyn({ x: x2, y: y2 })}
        className="absolute -right-[18vw] -top-[14vh] w-[70vw] h-[70vw] rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            filter: `blur(${blur + 10}px)`,
            opacity: palette.intens * (mode === "dark" ? 0.7 : 0.5),
            background: palette.halo,
            mixBlendMode: palette.blend,
          }}
        />
      </motion.div>

      
      <motion.div
        style={dyn({ x: x3, y: y3 })}
        className="absolute left-1/2 top-[36%] -translate-x-1/2 w-[85vw] h-[85vw]"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            filter: `blur(${Math.max(10, blur - 15)}px)`,
            opacity: palette.intens * (mode === "dark" ? 0.65 : 0.42),
            background: palette.ring,
            mixBlendMode: palette.blend,
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 56%, black 58%)",
            mask: "radial-gradient(circle at 50% 50%, transparent 56%, black 58%)",
          }}
        />
      </motion.div>

      
      <div
        className="absolute inset-0"
        style={{ background: palette.vignette }}
      />
      <svg
        className="absolute inset-0 w-full h-full mix-blend-soft-light"
        style={{ opacity: palette.noiseOpacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence baseFrequency="0.8" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
