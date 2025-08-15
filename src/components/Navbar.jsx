import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./ui/DarkModeToggle";

export default function Navbar() {
  return (
    <nav className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        
      </div>
      <DarkModeToggle />
    </nav>
  );
}
