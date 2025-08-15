
import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./ui/DarkModeToggle";

export default function Navbar() {
  return (
    <nav
      className="relative z-50 mx-auto max-w-5xl
                 rounded-full backdrop-blur-md
                 bg-white/70 dark:bg-neutral-900/70
                 border border-neutral-200 dark:border-neutral-800
                 shadow-lg flex justify-between items-center
                 px-10 py-2 transition-all duration-300"
    >
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="text-base font-medium text-gray-800 dark:text-gray-200 hover:opacity-80 transition"
        >
          Home
        </Link>
      </div>

      <div className="flex items-center">
        <div className="p-2 rounded-full hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70 transition">
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}
