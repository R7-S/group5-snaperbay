// Contributors: Bhumil Parate(8994642)
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function TopProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.4,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.015], [0, 1]);

  return (
    <div
      className="fixed left-0 right-0 pointer-events-none top-[72px] z-[120]"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[64rem]">
        <div className="overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] bg-slate-900/10 dark:bg-white/10 h-[6px]">
          <motion.div
            style={{ scaleX, opacity }}
            className="h-full origin-left rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500 drop-shadow-[0_0_10px_rgba(56,189,248,0.55)]"
          />
        </div>
      </div>
    </div>
  );
}
