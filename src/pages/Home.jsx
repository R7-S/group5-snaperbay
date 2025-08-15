import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { fetchPopularImages, fetchImagesByQuery } from "../api/image";
import HoverBlurEffect from "../components/ui/Hover-Blur-Effect";

export default function Home() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchPopularImages().then(setImages);
  }, []);

  const handleSearch = () => {
    if (query.trim() === "") return;
    fetchImagesByQuery(query).then(setImages);
  };

  const handleClear = () => {
    setQuery("");
    fetchPopularImages().then(setImages);
  };

  return (
    <div className="relative px-4">
      
      <div
        className="
          fixed left-1/2 -translate-x-1/2 z-40
          w-full max-w-2xl px-3 py-2
          top-24 sm:top-28    /* <-- spacing from top (navbar) */
          flex items-center
          bg-white/20 dark:bg-gray-900/40
          backdrop-blur-lg rounded-full shadow-lg border border-white/20
        "
      >
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow px-4 py-2 bg-transparent text-lg 
                     text-black dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none"
          aria-label="Search for images"
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-500"
            aria-label="Clear search"
          >
            <IoClose size={22} />
          </button>
        )}

        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-5 py-2 rounded-full 
                     hover:bg-blue-600 transition font-medium shadow"
        >
          Search
        </button>
      </div>

      
      <div className="mt-36 sm:mt-40 columns-1 sm:columns-2 lg:columns-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="break-inside-avoid mb-4">
            <Link to={`/images/${img.id}`}>
              <HoverBlurEffect imageUrl={img.webformatURL} photographer={img.user} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
