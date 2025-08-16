// Contributors: Bhumil Parate(8994642)
// src/components/ui/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function DarkModeToggle({ className = "" }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const dark = theme === "dark";
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300 ${className}`}
      aria-label={label}
      aria-pressed={dark}
    >
      {dark ? (
        <MdOutlineLightMode className="text-yellow-400" size={20} />
      ) : (
        <MdOutlineDarkMode className="text-gray-800" size={20} />
      )}
    </button>
  );
}
