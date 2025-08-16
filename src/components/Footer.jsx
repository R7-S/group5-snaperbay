
// Contributors: Bhumil Parate(8994642)

import React from "react";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiTwitter,
  FiMail,
  FiHeart,
  FiArrowUpRight,
} from "react-icons/fi";
import ReadableSpot from "./ui/ReadableSpot";

function External({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex items-center gap-1.5 hover:underline underline-offset-4 " +
        "text-slate-700 dark:text-slate-200 " +
        className
      }
    >
      {children}
      <FiArrowUpRight className="opacity-70" />
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16">
      <ReadableSpot
        className="z-0"
        size="w-[min(1100px,94%)] h-[230px]"
        blur="blur-[26px]"
        rounding="rounded-[9999px]"
        offsetY={0}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl overflow-hidden ring-1 ring-slate-200/70 dark:ring-slate-800/70
                     bg-white/80 dark:bg-slate-900/65 supports-[backdrop-filter]:backdrop-blur-md"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-slate-700/60 to-transparent" />

          <div className="p-6 sm:p-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="inline-block">
                <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Snaperbay
                </span>
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Discover stunning visuals. Fast search, elegant UI, and readable
                everywhere.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <External href="https://github.com/">
                  <FiGithub />
                  <span>GitHub</span>
                </External>
                <External href="https://twitter.com/">
                  <FiTwitter />
                  <span>Twitter</span>
                </External>
                <a
                  href="mailto:hello@example.com"
                  className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:underline underline-offset-4"
                >
                  <FiMail />
                  <span>Email</span>
                </a>
              </div>
            </div>

            <nav aria-label="Explore" className="grid gap-2 content-start">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                Explore
              </h3>
              <Link
                className="text-slate-700 dark:text-slate-300 hover:underline underline-offset-4"
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-slate-700 dark:text-slate-300 hover:underline underline-offset-4"
                to="/about"
              >
                About
              </Link>
              <Link
                className="text-slate-700 dark:text-slate-300 hover:underline underline-offset-4"
                to="/contact"
              >
                Contact
              </Link>
            </nav>

            {/* Resources */}
            <nav aria-label="Resources" className="grid gap-2 content-start">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                Resources
              </h3>
              <External href="https://pixabay.com/api/docs/">
                Pixabay API
              </External>
              <Link
                className="text-slate-700 dark:text-slate-300 hover:underline underline-offset-4"
                to="/privacy"
              >
                Privacy
              </Link>
              <Link
                className="text-slate-700 dark:text-slate-300 hover:underline underline-offset-4"
                to="/terms"
              >
                Terms
              </Link>
            </nav>

            <form
              className="content-start"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              aria-label="Subscribe to newsletter"
            >
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                Newsletter
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Get occasional updates. No spam.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-800/80
                             ring-1 ring-slate-300 dark:ring-slate-700
                             text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400
                             focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900
                             hover:opacity-95 transition"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {/* bottom bar */}
          <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between text-sm">
            <div className="text-slate-600 dark:text-slate-300">
              © {year} Snaperbay. All rights reserved.
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              Made with{" "}
              <FiHeart className="mx-1 text-rose-500 dark:text-rose-400" /> for
              creatives.
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/70
                       ring-1 ring-slate-200 dark:ring-slate-700
                       text-slate-900 dark:text-white hover:translate-y-[-1px] transition
                       supports-[backdrop-filter]:backdrop-blur-md"
            aria-label="Back to top"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
