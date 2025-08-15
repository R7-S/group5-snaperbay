import React from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./ui/DarkModeToggle";
import { Home, Info,Mail} from "lucide-react";
  
export default function Navbar() {
  const location = useLocation();

  const navLinkClasses = (path) =>
    `flex items-center gap-2 text-base font-medium px-3 py-1 rounded-full transition 
     ${
       location.pathname === path
         ? "bg-blue-500 text-white"
         : "text-gray-800 dark:text-gray-200 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70"
     }`;

  return (
    <nav
      className="relative z-50 mx-auto max-w-5xl
                 rounded-full backdrop-blur-md
                 bg-white/70 dark:bg-neutral-900/70
                 border border-neutral-200 dark:border-neutral-800
                 shadow-lg flex justify-between items-center
                 px-4 sm:px-8 py-2 transition-all duration-300"
    >
      <div className="flex gap-4 sm:gap-6 items-center">
        <Link to="/" className={navLinkClasses("/")}>
          <Home size={18} /> Home
        </Link>

        <Link to="/about" className={navLinkClasses("/about")}>
          <Info size={18} /> About
        </Link>

        <Link to="/Contact" className={navLinkClasses("/Contacts")}>
          <Mail size={18} /> Contact US
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
