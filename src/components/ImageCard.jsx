//Contributors: Bhumil Parate , 8994642
import { motion } from "framer-motion";

export default function ImageCard({ src, alt, footer, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotateZ: -0.25 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-900/60 shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-800"
    >
      <div className="relative">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block rounded-2xl"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      {footer && (
        <div className="p-3 flex items-center justify-between">{footer}</div>
      )}
    </motion.div>
  );
}
