// src/components/ui/TopProgressBar.jsx
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function TopProgressBar({
  offset = 72, // distance from top in px (fits your top-3 + h-14 navbar ≈ 12 + 56 = 68~72)
  height = 6, // bar thickness in px
  maxWidth = "64rem", // match your navbar container (max-w-6xl)
}) {
  const { scrollYProgress } = useScroll();

  // Smooth, responsive progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.4,
  });

  // Fade in after a tiny scroll so it’s noticeable
  const opacity = useTransform(scrollYProgress, [0, 0.015], [0, 1]);

  return (
    <div
      className="fixed left-0 right-0 pointer-events-none"
      style={{ top: offset, zIndex: 120 }}
      aria-hidden="true"
    >
      <div className="mx-auto" style={{ maxWidth }}>
        {/* Track */}
        <div
          className="overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]
                     bg-slate-900/10 dark:bg-white/10"
          style={{ height }}
        >
          {/* Fill */}
          <motion.div
            style={{ scaleX, opacity }}
            className="h-full origin-left rounded-full
                       bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500
                       drop-shadow-[0_0_10px_rgba(56,189,248,0.55)]"
          />
        </div>
      </div>
    </div>
  );
}
