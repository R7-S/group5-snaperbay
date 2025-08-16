// src/components/ui/SplitTextReveal.jsx
import { useEffect } from "react";
import { motion, useAnimate } from "framer-motion";

export default function SplitTextReveal({ text, delay = 0, className = "" }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const letters = scope.current.querySelectorAll("[data-letter]");
    // timeline: slight upward slide + fade, staggered
    animate(
      letters,
      { opacity: [0, 1], y: [8, 0] },
      { delay, duration: 0.45, stagger: 0.02, ease: "easeOut" }
    );
  }, [animate, delay, scope]);

  return (
    <motion.h1 ref={scope} className={className}>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            data-letter
            className="inline-block opacity-0 will-change-transform"
          >
            {ch}
          </span>
        )
      )}
    </motion.h1>
  );
}
