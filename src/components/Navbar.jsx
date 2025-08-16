// src/components/Navbar.jsx
// Contributors: Your Name (nav + dark mode a11y)
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import DarkModeToggle from "./ui/DarkModeToggle";

export default function Navbar() {
  const { scrollY } = useScroll();
  const last = useRef(0);
  const hidden = useRef(false);
  const [state, setState] = React.useState({ hidden: false });

  useMotionValueEvent(scrollY, "change", (v) => {
    const d = v - last.current;
    hidden.current = d > 2 && v > 80; 
    if (d < -2) hidden.current = false; 
    last.current = v;
    setState({ hidden: hidden.current });
  });

  return (
    <motion.nav
      role="navigation"
      aria-label="Main"
      initial={false}
      animate={{ y: state.hidden ? -72 : 0, opacity: state.hidden ? 0.95 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="sticky top-3 z-50"
    >
      
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0
                   focus:m-2 focus:rounded focus:bg-blue-600 focus:px-3 focus:py-2
                   focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-6xl px-3">
        <div className="relative flex h-14 items-center justify-between rounded-full border
                        bg-white/60 dark:bg-slate-950/60 border-slate-200/60 dark:border-white/10
                        backdrop-blur-xl shadow-lg">
          
          <Link to="/" className="ml-2 flex items-center gap-2 px-3 py-1.5">
            {/* Light-mode logo */}
            <img
              src="/images/logo/snaperbay.svg"
              alt="Snaperbay"
              className="h-10 w-auto block dark:hidden"
              draggable="false"
            />
            {/* Dark-mode logo */}
            <img
              src="/images/logo/snaperbay-dark.svg"
              alt="Snaperbay"
              className="h-10 w-auto hidden dark:block"
              draggable="false"
            />
            <span className="sr-only">Snaperbay</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900"
            >
              Contact
            </Link>
          </div>

          {/* Dark mode toggle */}
          <div className="mr-2">
            <DarkModeToggle
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border
                         border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5
                         hover:bg-slate-100/70 dark:hover:bg-white/10"
            />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
