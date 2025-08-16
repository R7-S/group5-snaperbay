import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollParallaxDecor({ className = "" }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 60]);
  const y2 = useTransform(scrollY, [0, 600], [0, -50]);

  const Blob = ({ style, grad, size }) => (
    <motion.div
      style={style}
      className={`absolute blur-3xl opacity-35 ${size} ${grad} rounded-full`}
    />
  );

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <Blob
        style={{ y: y1, left: "6%", top: "10%" }}
        grad="bg-gradient-to-tr from-violet-500 to-sky-400"
        size="w-56 h-56"
      />
      <Blob
        style={{ y: y2, right: "8%", top: "35%" }}
        grad="bg-gradient-to-tr from-emerald-400 to-cyan-400"
        size="w-72 h-72"
      />
    </div>
  );
}
