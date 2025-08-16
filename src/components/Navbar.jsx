import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import DarkModeToggle from "./ui/DarkModeToggle";
import { Home, Info,Mail} from "lucide-react";
  
export default function Navbar() {
  const { scrollY } = useScroll();
  const last = useRef(0);
  const hidden = useRef(false);
  const y = React.useRef(0);

  const [state, setState] = React.useState({ hidden: false });

  useMotionValueEvent(scrollY, "change", (v) => {
    const d = v - last.current;
    hidden.current = d > 2 && v > 80; // down
    if (d < -2) hidden.current = false; // up
    last.current = v;
    setState({ hidden: hidden.current });
  });

  return (
    <motion.nav
      initial={false}
      animate={{ y: state.hidden ? -72 : 0, opacity: state.hidden ? 0.95 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="sticky top-3 z-50"
    >
      {/* your existing glassy inner nav */}
      <div className="mx-auto max-w-6xl px-3">
        <div className="relative flex h-14 items-center justify-between rounded-full border bg-white/60 dark:bg-slate-950/60 border-slate-200/60 dark:border-white/10 backdrop-blur-xl shadow-lg">
          <Link to="/" className="ml-2 flex items-center gap-2 px-3 py-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-[12px] font-bold">
              S
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              Snaperbay
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="py-2 px-3 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Contact
            </Link>
          </div>
          <div className="mr-2">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100/70 dark:hover:bg-white/10">
              <DarkModeToggle />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
