import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ open, onClose, children, layoutId }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) onClose();
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 200, damping: 20 },
            }}
            exit={{ y: 10, opacity: 0 }}
          >
            {/* the magic wrapper: when layoutId matches the card, it morphs */}
            <motion.div layoutId={layoutId} className="max-w-5xl w-full">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
