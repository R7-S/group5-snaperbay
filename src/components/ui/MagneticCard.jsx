// src/components/ui/MagneticCard.jsx
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function MagneticCard({
  children,
  intensity = 8,
  className = "",
}) {
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const rx = useTransform(my, [-60, 60], [intensity, -intensity]);
  const ry = useTransform(mx, [-60, 60], [-intensity, intensity]);

  return (
    <motion.div
      className={`will-change-transform [transform-style:preserve-3d] ${className}`}
      style={{ rotateX: rx, rotateY: ry }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
      whileTap={{ scale: 0.985 }}
    >
      {children}
    </motion.div>
  );
}
