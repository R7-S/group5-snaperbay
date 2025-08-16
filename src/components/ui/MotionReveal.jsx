// src/components/ui/MotionReveal.jsx
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function MotionReveal({
  children,
  delay = 0,
  y = 16,
  as = "div",
  once = true,
  amount = 0.15,
  margin = "-8% 0px",
  forceOnMount = false, 
}) {
  const M = motion[as] || motion.div;
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount, margin });

  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);

  
  useEffect(() => {
    try {
      const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      if (mq?.matches) setReduced(true);
    } catch {}
  }, []);

 
  useEffect(() => {
    if (inView) setShow(true);
  }, [inView]);

  
  useEffect(() => {
    if (!forceOnMount) return;
    setShow(true);
    const onPageShow = () => setShow(true);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [forceOnMount]);

  const variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  };

  return (
    <M
      ref={ref}
      initial={reduced ? "show" : "hidden"}
      animate={reduced || show ? "show" : "hidden"}
      variants={variants}
    >
      {children}
    </M>
  );
}
