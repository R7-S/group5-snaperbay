// Contributors: Bhumil Parate(8994642)
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ParallaxHover({
  children,
  range = 10,
  className = "",
}) {
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const rx = useTransform(my, [-50, 50], [range, -range]);
  const ry = useTransform(mx, [-50, 50], [-range, range]);

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - (r.left + r.width / 2));
        my.set(e.clientY - (r.top + r.height / 2));
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry }}
    >
      {children}
    </motion.div>
  );
}
