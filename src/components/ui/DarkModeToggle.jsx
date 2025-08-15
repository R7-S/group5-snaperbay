import React, { useEffect, useState } from "react";

import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
export default function DarkModeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <MdOutlineLightMode className="text-yellow-400" size={20} />
      ) : (
        <MdOutlineDarkMode className="text-gray-800" size={20} />
      )}
    </button>
  );
}

