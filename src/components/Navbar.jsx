// src/components/Navbar.jsx
// Contributors: Your Name (nav + dark mode a11y, arcade HUD styling)
import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import DarkModeToggle from "./ui/DarkModeToggle";

export default function Navbar() {
  const { pathname } = useLocation();

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

  const NavLink = ({ to, children }) => {
    const active = pathname === to || (to !== "/" && pathname.startsWith(to));
    return (
      <Link
        to={to}
        className="group relative py-2 px-3 rounded-xl text-sm font-semibold uppercase tracking-wider
                   text-slate-800 dark:text-slate-200 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-2
                   dark:focus-visible:ring-offset-slate-900"
      >
        <span
          className={`absolute left-3 right-3 -bottom-0.5 h-0.5 origin-left
                      bg-gradient-to-r from-fuchsia-500 via-sky-400 to-lime-400
                      transition-transform duration-300
                      ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
        />
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition
                         bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35),rgba(255,255,255,0))]
                         dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),rgba(255,255,255,0))]"
        />
        <span className="relative z-10">{children}</span>
      </Link>
    );
  };

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
        <div className="relative group">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[2px] rounded-full
                       bg-[conic-gradient(from_90deg_at_50%_50%,#f0f,#60a5fa,#22c55e,#f0f)]
                       opacity-60 blur-md transition-all duration-300
                       group-hover:opacity-90"
          />
          <div
            className="relative flex h-14 items-center justify-between rounded-full border
                       bg-white/65 dark:bg-slate-950/60 border-slate-200/60 dark:border-white/10
                       backdrop-blur-xl shadow-xl"
          >
            <Link
              to="/"
              aria-label="Snaperbay Home"
              className="ml-2 flex items-center gap-3 px-3 py-1.5"
            >
              <span className="relative inline-flex items-center justify-center">
                <span
                  aria-hidden
                  className="absolute -inset-4 rounded-3xl
                 bg-[conic-gradient(from_90deg_at_50%_50%,#f0f,#60a5fa,#22c55e,#f0f)]
                 opacity-40 dark:opacity-60 blur-md"
                />

                <img
                  src="/images/logo/snaperbay.svg"
                  alt="Snaperbay"
                  loading="eager"
                  decoding="async"
                  className="relative h-11 md:h-12 w-auto block dark:hidden
                 filter drop-shadow-[0_1px_0_rgba(0,0,0,0.22)]"
                  draggable="false"
                />
                <img
                  src="/images/logo/snaperbay-dark.svg"
                  alt="Snaperbay"
                  loading="eager"
                  decoding="async"
                  className="relative h-11 md:h-12 w-auto hidden dark:block
                 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]
                 dark:brightness-110"
                  draggable="false"
                />
              </span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-1">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>

            <div className="mr-2 flex items-center gap-2">
              {/* Dark mode toggle */}
              <DarkModeToggle
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border
                           border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5
                           hover:bg-slate-100/70 dark:hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
