import { motion } from "framer-motion";

export default function Button({ children, className = "", ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-900 text-white dark:bg-white dark:text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
